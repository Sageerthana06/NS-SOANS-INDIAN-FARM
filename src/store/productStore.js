import { create } from 'zustand';
import { products } from '../data/products.js';
import initialHistoryData from '../data/priceImportHistory.json' with { type: 'json' };
import { normalizeWeightKey } from '../utils/excelPriceParser.js';
import { useCartStore } from './cartStore.js';

export const PRICE_OVERRIDES_STORAGE_KEY = 'ns_soans_price_overrides_v1';
export const PRICE_HISTORY_STORAGE_KEY = 'ns_soans_price_import_history_v1';

/**
 * Compute a strict deterministic fingerprint of all NON-PRICE fields across the entire
 * 124-product catalogue. Used by the transaction manager to guarantee that a bulk price
 * import NEVER alters product names, descriptions, images, categories, IDs, stock, or variants.
 */
export function computeNonPriceCatalogueFingerprint(catalogue) {
  return JSON.stringify(
    catalogue.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      collection: p.collection,
      collectionName: p.collectionName,
      brandAttribution: p.brandAttribution,
      category: p.category,
      categorySlug: p.categorySlug,
      subcategory: p.subcategory,
      subcategorySlug: p.subcategorySlug,
      badge: p.badge,
      shortDescription: p.shortDescription,
      description: p.description,
      images: p.images,
      origin: p.origin,
      shelfLife: p.shelfLife,
      storage: p.storage,
      variants: (p.weightOptions || []).map((w) => ({
        weight: w.weight,
        stock: w.stock
      }))
    }))
  );
}

/**
 * Snapshot all current prices across the catalogue for transaction rollback
 */
function snapshotCurrentPrices(catalogue) {
  const snap = {};
  for (const p of catalogue) {
    snap[p.id] = {
      basePrice: p.price,
      variants: {}
    };
    for (const opt of p.weightOptions || []) {
      snap[p.id].variants[opt.weight] = opt.price;
    }
  }
  return snap;
}

/**
 * Restore all prices from a transaction snapshot (ROLLBACK)
 */
function restorePricesFromSnapshot(catalogue, snap) {
  for (const p of catalogue) {
    const pSnap = snap[p.id];
    if (!pSnap) continue;
    p.price = pSnap.basePrice;
    for (const opt of p.weightOptions || []) {
      if (Object.prototype.hasOwnProperty.call(pSnap.variants, opt.weight)) {
        opt.price = pSnap.variants[opt.weight];
      }
    }
  }
}

/**
 * Build the compact overrides map { [productId]: { [weightLabel]: price } } for persistence
 */
function buildPriceOverridesMap(catalogue) {
  const map = {};
  for (const p of catalogue) {
    const prodPrices = {};
    let hasAny = false;
    for (const opt of p.weightOptions || []) {
      if (opt.price !== null && opt.price !== undefined) {
        prodPrices[opt.weight] = opt.price;
        hasAny = true;
      }
    }
    if (hasAny) {
      map[p.id] = prodPrices;
    }
  }
  return map;
}

function getInitialImportHistory() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return Array.isArray(initialHistoryData) ? initialHistoryData : [];
  }
  try {
    const raw = window.localStorage.getItem(PRICE_HISTORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to read price import history from localStorage', e);
  }
  return Array.isArray(initialHistoryData) ? initialHistoryData : [];
}

export const useProductStore = create((set, get) => ({
  priceVersion: 1,
  importHistory: getInitialImportHistory(),

  /**
   * Fetch server-side persisted prices & import history if Vite API is running
   */
  syncFromServer: async () => {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('/api/admin/price-state');
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.overrides && typeof data.overrides === 'object') {
        const localRaw = window.localStorage.getItem(PRICE_OVERRIDES_STORAGE_KEY);
        // If localStorage is empty and server has overrides, hydrate from server
        if (!localRaw && Object.keys(data.overrides).length > 0) {
          for (const prod of products) {
            const po = data.overrides[prod.id];
            if (po && Array.isArray(prod.weightOptions)) {
              let minPrice = null;
              for (const opt of prod.weightOptions) {
                if (Object.prototype.hasOwnProperty.call(po, opt.weight)) {
                  opt.price = po[opt.weight];
                }
                if (opt.price !== null && opt.price > 0) {
                  if (minPrice === null || opt.price < minPrice) minPrice = opt.price;
                }
              }
              prod.price = minPrice;
            }
          }
          window.localStorage.setItem(PRICE_OVERRIDES_STORAGE_KEY, JSON.stringify(data.overrides));
        }
      }
      if (data && Array.isArray(data.history) && data.history.length > 0) {
        const currentHistory = get().importHistory;
        if (currentHistory.length === 0) {
          window.localStorage.setItem(PRICE_HISTORY_STORAGE_KEY, JSON.stringify(data.history));
          set({ importHistory: data.history, priceVersion: get().priceVersion + 1 });
          return;
        }
      }
      set({ priceVersion: get().priceVersion + 1 });
    } catch {
      // Static build / offline mode — localStorage is primary
    }
  },

  /**
   * Execute a safe, transactional Price-Only Bulk Import.
   * Updates ONLY matched product weight variant prices.
   * Rolls back automatically if any error or non-price mutation is detected.
   */
  executeBulkPriceImport: async ({ fileName, previewRows, summary }) => {
    // 1. BEGIN TRANSACTION: Snapshot current prices & non-price integrity fingerprint
    const preTransactionSnap = snapshotCurrentPrices(products);
    const preFingerprint = computeNonPriceCatalogueFingerprint(products);

    const appliedChanges = [];
    const seenVariantKeys = new Set();
    let updatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    try {
      for (const row of previewRows) {
        if (row.status === 'INVALID_PRICE') {
          failedCount++;
          continue;
        }
        if (row.status !== 'MATCHED_UPDATE' || !row.willUpdate) {
          skippedCount++;
          continue;
        }

        const newPrice = Number(row.newPrice);
        if (!Number.isFinite(newPrice) || newPrice <= 0) {
          failedCount++;
          continue;
        }

        const targetProduct = products.find((p) => p.id === row.productId);
        if (!targetProduct || !Array.isArray(targetProduct.weightOptions)) {
          skippedCount++;
          continue;
        }

        const targetWeightKey = normalizeWeightKey(row.weight);
        const targetVariant = targetProduct.weightOptions.find(
          (w) => normalizeWeightKey(w.weight) === targetWeightKey
        );

        if (!targetVariant) {
          skippedCount++;
          continue;
        }

        const uniqueKey = `${targetProduct.id}__${targetWeightKey}`;
        if (seenVariantKeys.has(uniqueKey)) {
          // Prevent duplicate updates within the same transaction
          skippedCount++;
          continue;
        }
        seenVariantKeys.add(uniqueKey);

        const oldPrice = targetVariant.price;
        // STRICT RULE: Mutate ONLY the variant's price field
        targetVariant.price = newPrice;

        // Recompute product-level minimum active variant price for display consistency
        let minPrice = null;
        for (const opt of targetProduct.weightOptions) {
          if (opt.price !== null && opt.price !== undefined && opt.price > 0) {
            if (minPrice === null || opt.price < minPrice) {
              minPrice = opt.price;
            }
          }
        }
        targetProduct.price = minPrice;

        updatedCount++;
        appliedChanges.push({
          productId: targetProduct.id,
          productName: targetProduct.name,
          category: targetProduct.category,
          weight: targetVariant.weight,
          oldPrice,
          newPrice,
          priceDiff: oldPrice !== null ? Math.round((newPrice - oldPrice) * 100) / 100 : newPrice,
          currency: 'INR'
        });
      }

      // 2. VERIFY TRANSACTION INTEGRITY: Ensure 0 non-price fields were modified
      const postFingerprint = computeNonPriceCatalogueFingerprint(products);
      if (preFingerprint !== postFingerprint) {
        throw new Error(
          'CRITICAL SAFETY VIOLATION: Non-price product data was altered. Rolling back transaction.'
        );
      }

      // 3. COMMIT TRANSACTION
      const now = new Date();
      const historyEntry = {
        id: `IMP-${now.getTime()}`,
        timestamp: now.toISOString(),
        formattedDate: now.toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }),
        fileName: fileName || 'Excel Bulk Upload',
        currency: 'INR',
        integrityVerified: true,
        counts: {
          totalRows: previewRows.length,
          successful: updatedCount,
          skipped: skippedCount,
          failed: failedCount,
          duplicates: summary?.duplicates || 0,
          unmatched: summary?.unmatched || 0
        },
        changes: appliedChanges
      };

      const overridesMap = buildPriceOverridesMap(products);
      const updatedHistory = [historyEntry, ...get().importHistory];

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(PRICE_OVERRIDES_STORAGE_KEY, JSON.stringify(overridesMap));
        window.localStorage.setItem(PRICE_HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      }

      // Synchronize active shopping cart items with the newly updated catalogue prices
      useCartStore.getState().syncCartPricesWithCatalogue(products);

      // Persist to backend API if dev server is running
      try {
        await fetch('/api/admin/price-bulk-import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            overrides: overridesMap,
            historyEntry
          })
        });
      } catch {
        // Ignore network error in static preview mode
      }

      set((state) => ({
        priceVersion: state.priceVersion + 1,
        importHistory: updatedHistory
      }));

      return {
        success: true,
        historyEntry
      };
    } catch (err) {
      // ROLLBACK TRANSACTION ON ANY ERROR
      restorePricesFromSnapshot(products, preTransactionSnap);
      return {
        success: false,
        error: err.message || 'Database transaction failed and was safely rolled back.'
      };
    }
  },

  /**
   * Revert a specific import history entry's price changes in a transaction
   */
  revertImportHistoryEntry: async (historyId) => {
    const entry = get().importHistory.find((h) => h.id === historyId);
    if (!entry || !Array.isArray(entry.changes)) {
      return { success: false, error: 'Import history entry not found.' };
    }

    const preSnap = snapshotCurrentPrices(products);
    const preFingerprint = computeNonPriceCatalogueFingerprint(products);

    try {
      for (const chg of entry.changes) {
        const prod = products.find((p) => p.id === chg.productId);
        if (!prod || !Array.isArray(prod.weightOptions)) continue;
        const variant = prod.weightOptions.find((w) => w.weight === chg.weight);
        if (variant) {
          variant.price = chg.oldPrice !== undefined ? chg.oldPrice : null;
        }
        let minPrice = null;
        for (const opt of prod.weightOptions) {
          if (opt.price !== null && opt.price !== undefined && opt.price > 0) {
            if (minPrice === null || opt.price < minPrice) minPrice = opt.price;
          }
        }
        prod.price = minPrice;
      }

      const postFingerprint = computeNonPriceCatalogueFingerprint(products);
      if (preFingerprint !== postFingerprint) {
        throw new Error('Integrity check failed during rollback.');
      }

      const overridesMap = buildPriceOverridesMap(products);
      const updatedHistory = get().importHistory.map((h) =>
        h.id === historyId ? { ...h, reverted: true, revertedAt: new Date().toISOString() } : h
      );

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(PRICE_OVERRIDES_STORAGE_KEY, JSON.stringify(overridesMap));
        window.localStorage.setItem(PRICE_HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      }

      useCartStore.getState().syncCartPricesWithCatalogue(products);

      try {
        await fetch('/api/admin/price-bulk-import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            overrides: overridesMap,
            replaceHistory: updatedHistory
          })
        });
      } catch {
        // Static build fallback
      }

      set((state) => ({
        priceVersion: state.priceVersion + 1,
        importHistory: updatedHistory
      }));

      return { success: true };
    } catch (err) {
      restorePricesFromSnapshot(products, preSnap);
      return { success: false, error: err.message };
    }
  }
}));
