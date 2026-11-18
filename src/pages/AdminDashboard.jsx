import React, { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  History,
  ShieldCheck,
  Search,
  ArrowRight,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Database,
  Check,
  Info,
  Package,
  Layers,
  FlaskConical,
  Eye
} from 'lucide-react';
import { products } from '../data/products';
import { useProductStore } from '../store/productStore';
import {
  parseXlsxBuffer,
  parseXlsBuffer,
  parseCsvText,
  buildBulkPricePreview,
  generatePriceTemplateXlsx,
  generatePriceTemplateCsv
} from '../utils/excelPriceParser';

export function BulkPriceUploadPanel({ embedded = false }) {
  const fileInputRef = useRef(null);

  const priceVersion = useProductStore((s) => s.priceVersion);
  const importHistory = useProductStore((s) => s.importHistory);
  const executeBulkPriceImport = useProductStore((s) => s.executeBulkPriceImport);
  const revertImportHistoryEntry = useProductStore((s) => s.revertImportHistoryEntry);

  const [activeSubView, setActiveSubView] = useState('upload'); // 'upload' | 'history' | 'catalogue'
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [parseError, setParseError] = useState(null);
  const [previewData, setPreviewData] = useState(null); // { rows, summary }
  const [previewFilter, setPreviewFilter] = useState('ALL'); // 'ALL' | 'READY' | 'SKIPPED' | 'DUPLICATE' | 'UNMATCHED_INVALID'
  const [previewSearch, setPreviewSearch] = useState('');
  const [previewPage, setPreviewPage] = useState(1);
  const [isImporting, setIsImporting] = useState(false);
  const [lastImportResult, setLastImportResult] = useState(null);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const [catalogueSearch, setCatalogueSearch] = useState('');

  const PREVIEW_PAGE_SIZE = 50;

  // Live catalogue statistics
  const catalogueStats = useMemo(() => {
    let totalVariants = 0;
    let pricedVariants = 0;
    let pricedProducts = 0;

    for (const p of products) {
      let hasPrice = false;
      for (const w of p.weightOptions || []) {
        totalVariants++;
        if (w.price !== null && w.price !== undefined && w.price > 0) {
          pricedVariants++;
          hasPrice = true;
        }
      }
      if (hasPrice) pricedProducts++;
    }

    return {
      totalProducts: products.length,
      pricedProducts,
      totalVariants,
      pricedVariants
    };
  }, [priceVersion]);

  // Process an uploaded Excel (.xlsx, .xls) or .csv file
  const handleFileProcess = async (file) => {
    if (!file) return;
    setParseError(null);
    setLastImportResult(null);

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      setParseError(
        `Unsupported file format ".${ext}". Please upload a valid .xlsx, .xls, or .csv file.`
      );
      return;
    }

    try {
      const arrayBuf = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuf);
      let sheets = [];

      if (ext === 'csv') {
        const text = new TextDecoder('utf-8').decode(uint8);
        sheets = parseCsvText(text);
      } else if (ext === 'xlsx') {
        sheets = parseXlsxBuffer(uint8);
      } else if (ext === 'xls') {
        sheets = parseXlsBuffer(uint8);
      }

      if (!sheets || sheets.length === 0) {
        setParseError('No readable worksheet rows were found in the uploaded file.');
        return;
      }

      const preview = buildBulkPricePreview(sheets, products);
      setUploadedFileName(file.name);
      setPreviewData(preview);
      setPreviewFilter(preview.summary.readyToUpdate > 0 ? 'ALL' : 'ALL');
      setPreviewPage(1);
    } catch (err) {
      console.error('Excel parse error:', err);
      setParseError(
        `Failed to parse "${file.name}": ${err.message || 'Corrupted or invalid spreadsheet file.'}`
      );
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  // Download .xlsx Price Template (Matches 'products details.xlsx')
  const handleDownloadXlsxTemplate = () => {
    const xlsxBytes = generatePriceTemplateXlsx(products);
    const blob = new Blob([xlsxBytes], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NS-Soans-Bulk-Price-Template.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download .csv Price Template
  const handleDownloadCsvTemplate = () => {
    const csvText = generatePriceTemplateCsv(products);
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NS-Soans-Bulk-Price-Template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Load Sample Test Batch to preview & test with sample products first
  const handleLoadSampleTestBatch = () => {
    setParseError(null);
    setLastImportResult(null);

    const sampleSheets = [
      {
        sheetName: 'Sample Price Test Batch',
        rows: [
          ['Product ID', 'Product Name', 'Weight', 'New Price (INR)'],
          ['masala-1-lover-s-tea', "LOVER'S TEA", '250 Grams', '195'],
          ['masala-1-lover-s-tea', "LOVER'S TEA", '500 Grams', '370'],
          ['masala-1-lover-s-tea', "LOVER'S TEA", '1 Kg', '710'],
          ['masala-2-lover-s-masala-kashaya', "LOVER'S MASALA KASHAYA", '250 Grams', '220'],
          ['masala-2-lover-s-masala-kashaya', "LOVER'S MASALA KASHAYA", '500 Grams', '420'],
          ['masala-2-lover-s-masala-kashaya', "LOVER'S MASALA KASHAYA", '1 Kg', '800'],
          ['', 'KUNDAPURA CHICKEN GHEE ROAST', '250 Grams', '260'],
          ['', 'KUNDAPURA CHICKEN GHEE ROAST', '500 Grams', '495'],
          ['', 'KUNDAPURA CHICKEN GHEE ROAST', '1 Kg', '950'],
          ['', 'NS SPECIAL GARAM MASALA', '250 Grams', '210'],
          ['', 'NS SPECIAL GARAM MASALA', '500 Grams', '400'],
          ['', 'NS SPECIAL GARAM MASALA', '1 Kg', '775'],
          ['', 'NS A2 DESI COW GHEE BILONA METHOD', '250 Gram', '690'],
          ['', 'NS A2 DESI COW GHEE BILONA METHOD', '500 Gram', '1350'],
          ['', 'NS A2 DESI COW GHEE BILONA METHOD', '1 Kg', '2650'],
          ['', 'NS DESI GIR COW CULTURED GHEE', '500 Gram', '1420'],
          ['', 'NS DESI GIR COW CULTURED GHEE', '1 Kg', '2790'],
          // Sample duplicate row to demonstrate duplicate detection
          ['masala-1-lover-s-tea', "LOVER'S TEA", '250 Grams', '210'],
          // Sample missing price row to demonstrate safe skipping
          ['', 'NS PAV BHAJI', '250 Grams', ''],
          // Sample unmatched product row to demonstrate strict no-product-creation rule
          ['', 'UNKNOWN EXPERIMENTAL SPICE MIX', '250 Grams', '299'],
          // Sample invalid price row to demonstrate invalid price rejection
          ['', 'NS CHAT MASALA', '250 Grams', 'INVALID_PRICE']
        ]
      }
    ];

    const preview = buildBulkPricePreview(sampleSheets, products);
    setUploadedFileName('Sample-Test-Products-Batch.xlsx');
    setPreviewData(preview);
    setPreviewFilter('ALL');
    setPreviewPage(1);
  };

  // Confirm and execute transactional database price import
  const handleConfirmPriceImport = async () => {
    if (!previewData || previewData.summary.readyToUpdate === 0) return;
    setIsImporting(true);
    setParseError(null);

    const res = await executeBulkPriceImport({
      fileName: uploadedFileName,
      previewRows: previewData.rows,
      summary: previewData.summary
    });

    setIsImporting(false);
    if (res.success) {
      setLastImportResult(res.historyEntry);
      setPreviewData(null);
      setUploadedFileName('');
    } else {
      setParseError(res.error || 'Import transaction failed and was rolled back.');
    }
  };

  // Filtered preview rows
  const filteredPreviewRows = useMemo(() => {
    if (!previewData) return [];
    return previewData.rows.filter((r) => {
      if (previewFilter === 'READY' && r.status !== 'MATCHED_UPDATE') return false;
      if (
        previewFilter === 'SKIPPED' &&
        r.status !== 'SKIPPED_EMPTY' &&
        r.status !== 'MATCHED_UNCHANGED'
      ) {
        return false;
      }
      if (previewFilter === 'DUPLICATE' && r.status !== 'DUPLICATE') return false;
      if (
        previewFilter === 'UNMATCHED_INVALID' &&
        !['UNMATCHED_PRODUCT', 'UNMATCHED_WEIGHT', 'INVALID_PRICE'].includes(r.status)
      ) {
        return false;
      }

      if (previewSearch.trim()) {
        const q = previewSearch.toLowerCase();
        const matchName = r.productName?.toLowerCase().includes(q);
        const matchId = r.productId?.toLowerCase().includes(q);
        const matchWeight = r.weight?.toLowerCase().includes(q);
        const matchStatus = r.statusLabel?.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchWeight && !matchStatus) return false;
      }
      return true;
    });
  }, [previewData, previewFilter, previewSearch]);

  const totalPreviewPages = Math.max(
    1,
    Math.ceil(filteredPreviewRows.length / PREVIEW_PAGE_SIZE)
  );
  const paginatedPreviewRows = filteredPreviewRows.slice(
    (previewPage - 1) * PREVIEW_PAGE_SIZE,
    previewPage * PREVIEW_PAGE_SIZE
  );

  // Filtered catalogue rows for Live Catalogue Price Inspector
  const filteredCatalogue = useMemo(() => {
    const q = catalogueSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [catalogueSearch, priceVersion]);

  return (
    <div className="space-y-8">
      {/* Top Section Banner — Navy Green & Champagne Gold */}
      <div className="bg-forest-950 text-white rounded-3xl p-6 sm:p-8 border border-gold-500/30 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-gold-500/40 text-gold-300 text-[11px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Price Management &rarr; Bulk Price Upload</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">
              Price-Only Bulk Upload System
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Upload your existing <code className="text-gold-300 font-mono">.xlsx</code>,{' '}
              <code className="text-gold-300 font-mono">.xls</code>, or{' '}
              <code className="text-gold-300 font-mono">.csv</code> file to update product weight
              variant prices in INR (₹). Strictly protected by a database transaction: product
              names, descriptions, images, categories, IDs, stock quantities, and variants are never
              modified.
            </p>
          </div>

          {/* Live Catalogue Price Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-forest-900/90 border border-gold-500/25 text-center">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                Catalogue Items
              </span>
              <strong className="text-lg font-black text-white">
                {catalogueStats.totalProducts}
              </strong>
              <span className="text-[10px] text-gold-400 block">
                {catalogueStats.pricedProducts} Priced
              </span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-forest-900/90 border border-gold-500/25 text-center">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                Weight Variants
              </span>
              <strong className="text-lg font-black text-gold-300">
                {catalogueStats.pricedVariants} / {catalogueStats.totalVariants}
              </strong>
              <span className="text-[10px] text-stone-300 block">Active Prices (INR)</span>
            </div>
            <div className="col-span-2 sm:col-span-1 px-4 py-3 rounded-2xl bg-forest-900/90 border border-gold-500/25 text-center">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                Import Logs
              </span>
              <strong className="text-lg font-black text-white">{importHistory.length}</strong>
              <span className="text-[10px] text-emerald-400 block">Audited Batches</span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-forest-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSubView('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeSubView === 'upload'
                  ? 'bg-gold-500 text-forest-950 shadow-md'
                  : 'bg-forest-900 text-stone-300 hover:text-white border border-forest-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Bulk Price Upload</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubView('history')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeSubView === 'history'
                  ? 'bg-gold-500 text-forest-950 shadow-md'
                  : 'bg-forest-900 text-stone-300 hover:text-white border border-forest-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Import History ({importHistory.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubView('catalogue')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeSubView === 'catalogue'
                  ? 'bg-gold-500 text-forest-950 shadow-md'
                  : 'bg-forest-900 text-stone-300 hover:text-white border border-forest-800'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Live Variant Prices ({catalogueStats.pricedVariants})</span>
            </button>
          </div>

          {/* Template Download Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadXlsxTemplate}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-forest-900 hover:bg-forest-800 text-gold-300 border border-gold-500/40 inline-flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Price Template (.xlsx)</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadCsvTemplate}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-forest-900 hover:bg-forest-800 text-stone-200 border border-forest-700 inline-flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-gold-400" />
              <span>CSV Template (.csv)</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SUB-VIEW 1: BULK PRICE UPLOAD & PREVIEW BEFORE IMPORT
      ===================================================================== */}
      {activeSubView === 'upload' && (
        <div className="space-y-6">
          {/* Post-Import Transaction Summary Banner */}
          {lastImportResult && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-600/40 shadow-lg space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-serif font-black text-forest-950">
                        Bulk Price Update Completed Successfully
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Transaction Committed
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      File: <strong className="text-forest-950">{lastImportResult.fileName}</strong>{' '}
                      &bull; {lastImportResult.formattedDate} &bull; Currency:{' '}
                      <strong className="text-forest-950">INR (₹)</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/shop"
                    className="px-4 py-2 rounded-xl text-xs font-bold gold-btn inline-flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Live Shop Prices</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveSubView('history')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-forest-900 text-gold-300 hover:bg-forest-950"
                  >
                    View Import History
                  </button>
                </div>
              </div>

              {/* Counts Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                    Successful Updates
                  </span>
                  <strong className="text-xl font-black text-emerald-900">
                    {lastImportResult.counts.successful}
                  </strong>
                  <span className="text-[10px] text-emerald-700 block">Variant Prices Updated</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Skipped Rows
                  </span>
                  <strong className="text-xl font-black text-forest-950">
                    {lastImportResult.counts.skipped}
                  </strong>
                  <span className="text-[10px] text-stone-500 block">Unchanged / Blank</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                    Duplicates Prevented
                  </span>
                  <strong className="text-xl font-black text-amber-900">
                    {lastImportResult.counts.duplicates}
                  </strong>
                  <span className="text-[10px] text-amber-700 block">Duplicate Rows Skipped</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Unmatched Kept Safe
                  </span>
                  <strong className="text-xl font-black text-forest-950">
                    {lastImportResult.counts.unmatched}
                  </strong>
                  <span className="text-[10px] text-stone-500 block">No New Products Created</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">
                    Failed / Invalid
                  </span>
                  <strong className="text-xl font-black text-red-900">
                    {lastImportResult.counts.failed}
                  </strong>
                  <span className="text-[10px] text-red-700 block">Invalid Price Format</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/70 px-4 py-2.5 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Strict Price-Only Integrity Verified:</strong> Only matched variant price
                  fields were updated. 0 product names, descriptions, images, categories, IDs, or
                  stock quantities were altered.
                </span>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {parseError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-900 flex items-start gap-3 text-xs">
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="font-bold block mb-0.5">Upload / Validation Error</strong>
                <p>{parseError}</p>
              </div>
              <button
                type="button"
                onClick={() => setParseError(null)}
                className="text-red-700 font-bold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Upload Dropzone & Action Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all ${
                  isDragging
                    ? 'border-gold-500 bg-gold-50/40'
                    : 'border-stone-300 hover:border-gold-500/70 bg-cream-50/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-2xl bg-forest-950 text-gold-300 flex items-center justify-center mx-auto mb-4 shadow-md border border-gold-500/30">
                  <FileSpreadsheet className="w-8 h-8" />
                </div>

                <h3 className="text-lg font-serif font-black text-forest-950 mb-1">
                  Upload Your Price Excel or CSV File
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mb-6 leading-relaxed">
                  Supports your existing <strong className="text-forest-950">products details.xlsx</strong>{' '}
                  multi-sheet workbook (<code className="font-mono">.xlsx</code>,{' '}
                  <code className="font-mono">.xls</code>, or <code className="font-mono">.csv</code>
                  ). Automatically matches by Product ID/SKU or exact Product Name + Weight.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 rounded-2xl gold-btn text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-2 shadow-md"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Excel / CSV File</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLoadSampleTestBatch}
                    className="px-5 py-3 rounded-2xl bg-forest-900 hover:bg-forest-950 text-gold-300 border border-gold-500/30 text-xs font-bold inline-flex items-center gap-2 transition-colors"
                  >
                    <FlaskConical className="w-4 h-4 text-gold-400" />
                    <span>Test with Sample Products</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Strict Safety Rules Checklist */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gold-500/30 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-forest-950 font-serif font-black text-base">
                  <ShieldCheck className="w-5 h-5 text-gold-600 shrink-0" />
                  <span>Price-Only Safety Lock</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Every bulk upload is validated in a preview stage and committed inside an atomic
                  transaction.
                </p>
                <ul className="space-y-2 text-xs text-stone-700 pt-1">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      <strong>Updates ONLY:</strong> Variant &amp; Weight prices (150g, 250g, 500g,
                      1kg, 2kg, 5kg, 10kg)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      <strong>Protects:</strong> Product names, descriptions, images &amp;
                      categories
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      <strong>Protects:</strong> Product IDs, stock quantities &amp; variant options
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      <strong>Never Creates</strong> new products or guesses missing prices
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-50 border border-stone-200 text-[11px] text-stone-600">
                <strong className="text-forest-950 block mb-0.5">
                  Need a pre-filled spreadsheet?
                </strong>
                Click <strong>Download Price Template (.xlsx)</strong> above to get an Excel sheet
                with all 124 products ready for price entry.
              </div>
            </div>
          </div>

          {/* =================================================================
              4. PREVIEW BEFORE IMPORT TABLE & CONFIRMATION
          ================================================================= */}
          {previewData && (
            <div className="bg-white rounded-3xl border-2 border-gold-500/40 shadow-xl overflow-hidden">
              {/* Preview Top Bar */}
              <div className="p-6 sm:p-8 bg-forest-950 text-white border-b border-gold-500/30">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-forest-950 inline-block mb-2">
                      Step 2: Preview Before Import
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
                      Review Matched Prices: {uploadedFileName}
                    </h3>
                    <p className="text-xs text-stone-300 mt-1">
                      Verify the matched products, weight variants, existing prices, new Excel
                      prices, and price differences before confirming the database update.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewData(null);
                        setUploadedFileName('');
                      }}
                      className="px-4 py-3 rounded-2xl border border-stone-600 text-stone-300 hover:text-white hover:bg-forest-900 text-xs font-bold transition-colors"
                    >
                      Cancel Preview
                    </button>

                    <button
                      type="button"
                      disabled={isImporting || previewData.summary.readyToUpdate === 0}
                      onClick={handleConfirmPriceImport}
                      className="px-6 py-3.5 rounded-2xl gold-btn text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {isImporting
                          ? 'Executing Transaction...'
                          : `Confirm Price Update (${previewData.summary.readyToUpdate} Variants)`}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Preview KPI Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
                  <div className="p-3 rounded-2xl bg-forest-900 border border-forest-800">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">
                      Total Variant Rows
                    </span>
                    <strong className="text-lg font-black text-white">
                      {previewData.summary.totalRows}
                    </strong>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/40">
                    <span className="text-[10px] text-emerald-300 uppercase font-bold block">
                      Ready to Update
                    </span>
                    <strong className="text-lg font-black text-emerald-400">
                      {previewData.summary.readyToUpdate}
                    </strong>
                  </div>

                  <div className="p-3 rounded-2xl bg-forest-900 border border-forest-800">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">
                      Skipped (Blank Price)
                    </span>
                    <strong className="text-lg font-black text-stone-200">
                      {previewData.summary.skippedMissingPrice}
                    </strong>
                  </div>

                  <div className="p-3 rounded-2xl bg-forest-900 border border-forest-800">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">
                      Unchanged Price
                    </span>
                    <strong className="text-lg font-black text-stone-200">
                      {previewData.summary.unchanged}
                    </strong>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-500/40">
                    <span className="text-[10px] text-amber-300 uppercase font-bold block">
                      Duplicates Found
                    </span>
                    <strong className="text-lg font-black text-amber-400">
                      {previewData.summary.duplicates}
                    </strong>
                  </div>

                  <div className="p-3 rounded-2xl bg-red-950/80 border border-red-500/40">
                    <span className="text-[10px] text-red-300 uppercase font-bold block">
                      Unmatched / Invalid
                    </span>
                    <strong className="text-lg font-black text-red-400">
                      {previewData.summary.unmatched + previewData.summary.invalidPrice}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Filter Tabs & Search inside Preview */}
              <div className="p-4 sm:p-6 bg-cream-50 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'ALL', label: `All Rows (${previewData.summary.totalRows})` },
                    {
                      id: 'READY',
                      label: `Ready to Update (${previewData.summary.readyToUpdate})`
                    },
                    {
                      id: 'SKIPPED',
                      label: `Skipped / Blank (${
                        previewData.summary.skippedMissingPrice + previewData.summary.unchanged
                      })`
                    },
                    {
                      id: 'DUPLICATE',
                      label: `Duplicates (${previewData.summary.duplicates})`
                    },
                    {
                      id: 'UNMATCHED_INVALID',
                      label: `Unmatched / Invalid (${
                        previewData.summary.unmatched + previewData.summary.invalidPrice
                      })`
                    }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setPreviewFilter(tab.id);
                        setPreviewPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        previewFilter === tab.id
                          ? 'bg-forest-900 text-gold-300 shadow-sm'
                          : 'bg-white text-stone-600 border border-stone-200 hover:border-gold-500'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={previewSearch}
                    onChange={(e) => {
                      setPreviewSearch(e.target.value);
                      setPreviewPage(1);
                    }}
                    placeholder="Filter preview by product or weight..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Notice if 0 prices provided in Excel */}
              {previewData.summary.readyToUpdate === 0 && (
                <div className="p-4 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <strong>No new price values detected to update:</strong> All matched product
                    rows in this file either have empty price cells or already match existing
                    database prices. Enter numeric INR prices under the weight columns in your Excel
                    sheet (or click <strong>"Test with Sample Products"</strong> above) to update
                    prices.
                  </div>
                </div>
              )}

              {/* Preview Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-100/80 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-600">
                      <th className="py-3.5 px-4">Product Name</th>
                      <th className="py-3.5 px-4">Weight</th>
                      <th className="py-3.5 px-4">Existing Price</th>
                      <th className="py-3.5 px-4">New Excel Price</th>
                      <th className="py-3.5 px-4">Price Difference</th>
                      <th className="py-3.5 px-4">Matching Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs">
                    {paginatedPreviewRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-stone-500">
                          No preview rows match the selected filter.
                        </td>
                      </tr>
                    ) : (
                      paginatedPreviewRows.map((row) => (
                        <tr
                          key={row.id}
                          className={`hover:bg-cream-50/70 transition-colors ${
                            row.status === 'MATCHED_UPDATE' ? 'bg-emerald-50/20' : ''
                          }`}
                        >
                          {/* Product Name */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-forest-950">{row.productName}</div>
                            <div className="text-[10px] text-stone-400 flex items-center gap-2 mt-0.5">
                              {row.productId && <span>ID: {row.productId}</span>}
                              {row.category && row.category !== '—' && (
                                <>
                                  <span>&bull;</span>
                                  <span>{row.category}</span>
                                </>
                              )}
                              {row.matchedBy && (
                                <>
                                  <span>&bull;</span>
                                  <span className="text-gold-700 font-semibold">
                                    Matched via {row.matchedBy}
                                  </span>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Weight */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-lg bg-cream-100 border border-stone-200 font-bold text-forest-950">
                              {row.weight}
                            </span>
                          </td>

                          {/* Existing Price */}
                          <td className="py-3 px-4 whitespace-nowrap font-semibold text-stone-600">
                            {row.existingPrice !== null && row.existingPrice !== undefined ? (
                              `₹${row.existingPrice.toLocaleString('en-IN')}`
                            ) : (
                              <span className="text-stone-400 italic">Not Set (—)</span>
                            )}
                          </td>

                          {/* New Excel Price */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            {row.newPrice !== null && row.newPrice !== undefined ? (
                              <span className="font-extrabold text-forest-950 text-sm">
                                ₹{row.newPrice.toLocaleString('en-IN')}
                              </span>
                            ) : row.status === 'INVALID_PRICE' ? (
                              <span className="text-red-600 font-mono font-bold">
                                {String(row.rawNewPrice)}
                              </span>
                            ) : (
                              <span className="text-stone-400">—</span>
                            )}
                          </td>

                          {/* Price Difference */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            {row.status === 'MATCHED_UPDATE' ? (
                              row.existingPrice === null ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                  New Price (+₹{row.newPrice.toLocaleString('en-IN')})
                                </span>
                              ) : row.priceDiff > 0 ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                  +₹{row.priceDiff.toLocaleString('en-IN')} (
                                  +{row.priceDiffPercent}%)
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                                  -₹{Math.abs(row.priceDiff).toLocaleString('en-IN')} (
                                  {row.priceDiffPercent}%)
                                </span>
                              )
                            ) : row.status === 'MATCHED_UNCHANGED' ? (
                              <span className="text-stone-400 font-medium">₹0 (No Change)</span>
                            ) : (
                              <span className="text-stone-300">—</span>
                            )}
                          </td>

                          {/* Matching Status */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            {row.status === 'MATCHED_UPDATE' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {row.statusLabel}
                              </span>
                            )}
                            {row.status === 'MATCHED_UNCHANGED' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-600">
                                {row.statusLabel}
                              </span>
                            )}
                            {row.status === 'SKIPPED_EMPTY' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-500">
                                {row.statusLabel}
                              </span>
                            )}
                            {row.status === 'DUPLICATE' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                {row.statusLabel}
                              </span>
                            )}
                            {(row.status === 'UNMATCHED_PRODUCT' ||
                              row.status === 'UNMATCHED_WEIGHT' ||
                              row.status === 'INVALID_PRICE') && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">
                                <XCircle className="w-3.5 h-3.5" />
                                {row.statusLabel}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Preview Pagination & Bottom Confirm Bar */}
              <div className="p-4 sm:p-6 bg-cream-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-stone-500">
                  Showing{' '}
                  <strong className="text-forest-950">
                    {filteredPreviewRows.length === 0
                      ? 0
                      : (previewPage - 1) * PREVIEW_PAGE_SIZE + 1}
                  </strong>{' '}
                  to{' '}
                  <strong className="text-forest-950">
                    {Math.min(previewPage * PREVIEW_PAGE_SIZE, filteredPreviewRows.length)}
                  </strong>{' '}
                  of <strong className="text-forest-950">{filteredPreviewRows.length}</strong> rows
                </div>

                {totalPreviewPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={previewPage <= 1}
                      onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-bold disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-bold text-forest-950 px-2">
                      Page {previewPage} of {totalPreviewPages}
                    </span>
                    <button
                      type="button"
                      disabled={previewPage >= totalPreviewPages}
                      onClick={() => setPreviewPage((p) => Math.min(totalPreviewPages, p + 1))}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-bold disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  disabled={isImporting || previewData.summary.readyToUpdate === 0}
                  onClick={handleConfirmPriceImport}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl gold-btn text-xs font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Confirm Price Update ({previewData.summary.readyToUpdate} Variants)
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 2: IMPORT HISTORY (WITH DATE, TIME, COUNTS & UPDATED PRICES)
      ===================================================================== */}
      {activeSubView === 'history' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif font-black text-forest-950">
                Price Import History &amp; Audit Log
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Complete transactional log of every bulk price import with date, time, summary
                counts, and exact variant price changes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveSubView('upload')}
              className="px-4 py-2.5 rounded-xl gold-btn text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>New Bulk Price Upload</span>
            </button>
          </div>

          {importHistory.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-cream-100 text-stone-400 flex items-center justify-center mx-auto">
                <History className="w-7 h-7" />
              </div>
              <h4 className="text-base font-serif font-bold text-forest-950">
                No Price Imports Recorded Yet
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Once you upload an Excel/CSV file and confirm the price update, the full audit log
                with timestamps and updated prices will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-200">
              {importHistory.map((item) => {
                const isExpanded = expandedHistoryId === item.id;
                return (
                  <div key={item.id} className="p-6 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-black text-forest-950">
                            {item.fileName}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-forest-900 text-gold-300">
                            {item.id}
                          </span>
                          {item.reverted ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              Reverted
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Committed • Price-Only Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500">
                          Date &amp; Time: <strong className="text-stone-700">{item.formattedDate}</strong>{' '}
                          &bull; Currency: <strong className="text-stone-700">INR (₹)</strong>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                            Updated: {item.counts?.successful || 0}
                          </span>
                          <span className="px-3 py-1 rounded-xl bg-stone-100 text-stone-700 font-semibold">
                            Skipped: {item.counts?.skipped || 0}
                          </span>
                          <span className="px-3 py-1 rounded-xl bg-red-50 text-red-700 font-semibold border border-red-200">
                            Failed: {item.counts?.failed || 0}
                          </span>
                        </div>

                        {!item.reverted && (
                          <button
                            type="button"
                            onClick={() => revertImportHistoryEntry(item.id)}
                            className="px-3 py-1.5 rounded-xl border border-stone-200 hover:border-amber-500 text-stone-600 hover:text-amber-800 text-xs font-bold inline-flex items-center gap-1 transition-colors"
                            title="Rollback prices to values before this import"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Revert</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedHistoryId(isExpanded ? null : item.id)
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-cream-100 hover:bg-forest-900 hover:text-gold-300 text-forest-950 text-xs font-bold inline-flex items-center gap-1 transition-colors"
                        >
                          <span>
                            {isExpanded ? 'Hide Updated Prices' : `View Updated Prices (${item.changes?.length || 0})`}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {isExpanded && item.changes && item.changes.length > 0 && (
                      <div className="rounded-2xl border border-stone-200 overflow-hidden bg-cream-50/50">
                        <div className="max-h-80 overflow-y-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-stone-100 border-b border-stone-200 text-[10px] font-bold uppercase text-stone-500">
                                <th className="py-2.5 px-4">Product Name</th>
                                <th className="py-2.5 px-4">Weight</th>
                                <th className="py-2.5 px-4">Previous Price</th>
                                <th className="py-2.5 px-4">Updated Price</th>
                                <th className="py-2.5 px-4">Difference</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                              {item.changes.map((chg, idx) => (
                                <tr key={idx} className="bg-white">
                                  <td className="py-2.5 px-4 font-bold text-forest-950">
                                    {chg.productName}
                                  </td>
                                  <td className="py-2.5 px-4">
                                    <span className="px-2 py-0.5 rounded bg-cream-100 border border-stone-200 font-semibold">
                                      {chg.weight}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-4 text-stone-500">
                                    {chg.oldPrice !== null && chg.oldPrice !== undefined
                                      ? `₹${chg.oldPrice.toLocaleString('en-IN')}`
                                      : 'Not Set (—)'}
                                  </td>
                                  <td className="py-2.5 px-4 font-extrabold text-forest-950">
                                    ₹{chg.newPrice.toLocaleString('en-IN')}
                                  </td>
                                  <td className="py-2.5 px-4">
                                    {chg.oldPrice === null ? (
                                      <span className="text-emerald-700 font-bold">
                                        New (+₹{chg.newPrice.toLocaleString('en-IN')})
                                      </span>
                                    ) : chg.priceDiff >= 0 ? (
                                      <span className="text-emerald-700 font-bold">
                                        +₹{chg.priceDiff.toLocaleString('en-IN')}
                                      </span>
                                    ) : (
                                      <span className="text-amber-700 font-bold">
                                        -₹{Math.abs(chg.priceDiff).toLocaleString('en-IN')}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SUB-VIEW 3: LIVE CATALOGUE VARIANT PRICE INSPECTOR
      ===================================================================== */}
      {activeSubView === 'catalogue' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif font-black text-forest-950">
                Live Website Product &amp; Variant Prices (124 Products)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Synchronized in real time with the Shop, Product Details, Quick View, and Shopping
                Cart.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={catalogueSearch}
                onChange={(e) => setCatalogueSearch(e.target.value)}
                placeholder="Search 124 products..."
                className="w-full pl-9 pr-3 py-2 bg-cream-50 border border-stone-200 rounded-xl text-xs text-forest-950 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="max-h-[600px] overflow-y-auto divide-y divide-stone-100">
            {filteredCatalogue.map((prod) => (
              <div
                key={prod.id}
                className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-cream-50/60"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={prod.images?.[0]}
                    alt={prod.name}
                    className="w-12 h-12 rounded-xl object-contain bg-stone-50 border border-stone-200 p-1 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/product/${prod.slug}`}
                        className="text-xs sm:text-sm font-bold text-forest-950 hover:text-gold-700 truncate"
                      >
                        {prod.name}
                      </Link>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest-900 text-gold-300 shrink-0">
                        {prod.category}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono block mt-0.5">
                      ID: {prod.id}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(prod.weightOptions || []).map((opt) => (
                    <div
                      key={opt.weight}
                      className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2 ${
                        opt.price !== null && opt.price !== undefined
                          ? 'bg-emerald-50/70 border-emerald-300 text-forest-950'
                          : 'bg-stone-50 border-stone-200 text-stone-400'
                      }`}
                    >
                      <span className="font-semibold">{opt.weight}:</span>
                      <strong
                        className={
                          opt.price !== null && opt.price !== undefined
                            ? 'text-emerald-800 font-black'
                            : 'text-stone-400 font-normal'
                        }
                      >
                        {opt.price !== null && opt.price !== undefined
                          ? `₹${opt.price.toLocaleString('en-IN')}`
                          : '—'}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-cream-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Admin Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Link to="/" className="hover:text-forest-950 font-semibold">
              Home
            </Link>
            <span>/</span>
            <span className="text-forest-950 font-bold">Admin Dashboard</span>
            <span>/</span>
            <span className="text-gold-700 font-bold">Price Management &rarr; Bulk Price Upload</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-forest-950 hover:border-gold-500 inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>Go to Product Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5 text-gold-600" />
            </Link>
          </div>
        </div>

        <BulkPriceUploadPanel />
      </div>
    </div>
  );
}
