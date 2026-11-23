import { create } from 'zustand';
import { getProductImage } from '../data/productImageMap';

const CART_STORAGE_KEY = 'ns_soans_cart_v1';

const getInitialCart = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to parse cart from localStorage', e);
    return [];
  }
};

export const useCartStore = create((set, get) => ({
  cart: getInitialCart(),
  isCartOpen: false,
  promoCode: '',
  discountPercent: 0,
  shippingMethod: 'standard', // 'standard', 'express', 'intl'

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  addToCart: (product, selectedWeight = null, qty = 1) => {
    const rawWeight =
      selectedWeight ||
      (product.weightOptions && product.weightOptions.length > 0
        ? product.weightOptions[0]
        : { weight: 'Standard', price: product.price });

    // Always resolve the latest price directly from product.weightOptions if available
    const liveVariant =
      product.weightOptions && rawWeight?.weight
        ? product.weightOptions.find((w) => w.weight === rawWeight.weight)
        : null;
    const latestPrice =
      liveVariant && liveVariant.price !== null && liveVariant.price !== undefined
        ? liveVariant.price
        : rawWeight?.price ?? product.price;

    // Prevent COMING SOON / unpriced items from ever being added to cart with a zero or invalid price
    const numericPrice = Number(latestPrice);
    if (
      latestPrice === null ||
      latestPrice === undefined ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      return;
    }

    const chosenWeight = {
      ...rawWeight,
      price: numericPrice
    };
    const cartItemId = `${product.id}-${chosenWeight.weight}`;

    set((state) => {
      const existingIndex = state.cart.findIndex((item) => item.cartItemId === cartItemId);
      let updatedCart;

      if (existingIndex > -1) {
        updatedCart = [...state.cart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          price: chosenWeight.price,
          currency: 'INR',
          quantity: updatedCart[existingIndex].quantity + qty
        };
      } else {
        const newItem = {
          cartItemId,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          brandAttribution: product.brandAttribution,
          image: getProductImage(product),
          weight: chosenWeight.weight,
          price: chosenWeight.price,
          currency: 'INR',
          quantity: qty,
          slug: product.slug
        };
        updatedCart = [newItem, ...state.cart];
      }

      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      } catch (err) {
        console.error('Failed to save cart to localStorage', err);
      }

      return { cart: updatedCart, isCartOpen: true };
    });
  },

  syncCartPricesWithCatalogue: (catalogueProducts) => {
    if (!Array.isArray(catalogueProducts)) return;
    set((state) => {
      if (!state.cart || state.cart.length === 0) return state;
      let changed = false;
      const updatedCart = state.cart.map((item) => {
        const prod = catalogueProducts.find((p) => p.id === item.productId || p.slug === item.slug);
        if (!prod || !Array.isArray(prod.weightOptions)) return item;
        const variant = prod.weightOptions.find((w) => w.weight === item.weight);
        if (variant && variant.price !== null && variant.price !== undefined && variant.price !== item.price) {
          changed = true;
          return { ...item, price: Number(variant.price), currency: 'INR' };
        }
        return item;
      });

      if (changed) {
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
        } catch (err) {
          console.error('Failed to sync cart prices to localStorage', err);
        }
        return { cart: updatedCart };
      }
      return state;
    });
  },

  updateQuantity: (cartItemId, newQty) => {
    if (newQty <= 0) {
      get().removeFromCart(cartItemId);
      return;
    }

    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      );
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      } catch (err) {
        console.error('Failed to save cart', err);
      }
      return { cart: updatedCart };
    });
  },

  removeFromCart: (cartItemId) => {
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.cartItemId !== cartItemId);
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      } catch (err) {
        console.error('Failed to save cart', err);
      }
      return { cart: updatedCart };
    });
  },

  clearCart: () => {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    set({ cart: [], promoCode: '', discountPercent: 0 });
  },

  applyPromoCode: (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SOANS10') {
      set({ promoCode: clean, discountPercent: 10 });
      return { success: true, message: 'Coupon applied! 10% discount added.' };
    } else if (clean === 'FARM20') {
      set({ promoCode: clean, discountPercent: 20 });
      return { success: true, message: 'FARM20 applied! 20% festive discount added.' };
    } else if (clean === 'FREESHIP') {
      set({ promoCode: clean, discountPercent: 5 });
      return { success: true, message: 'FREESHIP applied! Extra 5% off + Free Pan-India Delivery!' };
    } else {
      return { success: false, message: 'Invalid coupon code. Try SOANS10 or FARM20' };
    }
  },

  removePromoCode: () => {
    set({ promoCode: '', discountPercent: 0 });
  },

  setShippingMethod: (method) => {
    set({ shippingMethod: method });
  },

  // Computation helpers
  getSubtotal: () => {
    const { cart } = get();
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getDiscountAmount: () => {
    const { getSubtotal, discountPercent } = get();
    const subtotal = getSubtotal();
    return Math.round((subtotal * discountPercent) / 100);
  },

  getShippingCost: () => {
    const { getSubtotal, shippingMethod } = get();
    const subtotal = getSubtotal();

    if (shippingMethod === 'intl') {
      return 1850;
    }
    if (shippingMethod === 'express') {
      return 150;
    }
    // Standard domestic shipping: Free for orders >= 999, else 70
    return subtotal >= 999 || subtotal === 0 ? 0 : 70;
  },

  getGrandTotal: () => {
    const { getSubtotal, getDiscountAmount, getShippingCost } = get();
    return Math.max(0, getSubtotal() - getDiscountAmount() + getShippingCost());
  },

  getTotalItemsCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  }
}));

