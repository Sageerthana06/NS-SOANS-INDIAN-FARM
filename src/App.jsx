import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { PageTransition } from './components/LuxuryMotion';

import Home from './pages/Home';
import Shop from './pages/Shop';
import CategoryView from './pages/CategoryView';
import BrandView from './pages/BrandView';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import VisionMission from './pages/VisionMission';
import Services from './pages/Services';
import Recipes from './pages/Recipes';
import RecipeDetails from './pages/RecipeDetails';
import FarmStories from './pages/FarmStories';
import StoryDetails from './pages/StoryDetails';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import AdminDashboard from './pages/AdminDashboard';
import FAQ from './pages/FAQ';
import LegalPolicies from './pages/LegalPolicies';
import { useProductStore } from './store/productStore';

// Auto scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

// 404 Fallback
function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="bg-white p-10 rounded-3xl border border-stone-200 shadow-sm max-w-md space-y-4">
        <h2 className="text-3xl font-serif font-black text-forest-950">404</h2>
        <p className="text-sm text-stone-600">The harvest page you are looking for has moved or does not exist.</p>
        <a href="/" className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold inline-block">
          Return to Home
        </a>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <PageTransition routeKey={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/category/:slug" element={<CategoryView />} />
        <Route path="/brand/:slug" element={<BrandView />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/vision-mission" element={<VisionMission />} />
        <Route path="/services" element={<Services />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:slug" element={<RecipeDetails />} />
        <Route path="/stories" element={<FarmStories />} />
        <Route path="/stories/:slug" element={<StoryDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/account" element={<Account />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/price-upload" element={<AdminDashboard />} />
        <Route path="/login" element={<Account />} />
        <Route path="/register" element={<Account />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping-policy" element={<LegalPolicies />} />
        <Route path="/refund-policy" element={<LegalPolicies />} />
        <Route path="/privacy-policy" element={<LegalPolicies />} />
        <Route path="/terms" element={<LegalPolicies />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
}

export default function App() {
  const syncFromServer = useProductStore((s) => s.syncFromServer);

  useEffect(() => {
    syncFromServer();
  }, [syncFromServer]);

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-cream-50 selection:bg-gold-500 selection:text-forest-950">
        <AnnouncementBar />
        <Header />
        <div className="flex-grow">
          <AnimatedRoutes />
        </div>
        <Footer />
        <CartDrawer />
      </div>
    </Router>
  );
}

