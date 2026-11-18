# NS SOANS INDIAN FARM
## Premium 3D E-Commerce Frontend Platform

Official Web Storefront for **Soans Home Industries** (Kundapura, Karnataka).  
Uniting the generational, slow-roasted masala heritage of **NS SOANS Masalas** (formerly Abhiruchi Masala) with the certified regenerative organic farm staples of **Two Brothers Organic Farms** (Bhodani, Maharashtra).

---

## 🌾 Official Corporate & Heritage Details

- **Brand Name:** NS SOANS INDIAN FARM
- **Parent Company:** Soans Home Industries (Estd. 1982)
- **Headquarters & Production Facility:**  
  Soans Home Industries  
  'Ashwin'  
  Opp. Parijatha Hotel, Main Road  
  Kundapura, Udupi District  
  Karnataka, India – 576201  
- **Customer Helpline:** +91 63615 78948
- **Customer Care Email:** care@nssoansfarm.com
- **Currency:** Indian Rupees (₹ INR)
- **FSSAI License:** 11218334000122 (100% Preservative-Free & Lab-Tested)
- **Shipping Coverage:** Pan-India Express (Free above ₹999) & International Shipping to 45+ Countries

---

## 🚀 Key Architectural & Design Highlights

1. **Cinematic 3D Interactive Homepage (`/`):**
   - Built with **Three.js**, **React Three Fiber (`@react-three/fiber`)**, and **Drei (`@react-three/drei`)**.
   - Procedural 3D Indian Spices: Cardamom pods, textured rolled cinnamon sticks, star anise pods with seeds, curved Byadgi red chillies, and turmeric nuggets with shimmering golden dust particles.
   - Interactive 3D Product Showcase with live 3D models of:
     - NS SOANS Masala Pouch (with embossed gold foil seals and brand typography)
     - Two Brothers A2 Vedic Bilona Ghee Jar (with transmission glass and golden clarified ghee)
     - Wood-Pressed Cold-Pressed Oil Bottle (with glass reflections and wooden stopper)
   - OrbitControls with mouse tracking, parallax floating physics, and reduced-motion fallbacks.

2. **Interactive 3D Product Viewer (`ProductViewer3D`):**
   - Available on Product Details pages and Quick View modals.
   - 360-degree rotation, zoom in/out, auto-rotation toggle, and real-time wireframe geometry inspection mode.

3. **Unified Brand Product Catalogue (`/shop`):**
   - **NS SOANS Masala Collection:** Traditional Sambar Powder, Udupi Rasam Powder, Kundapura Chicken Ghee Roast Masala, Mangalore Chicken Sukka, Royal Butter Chicken Masala, Coastal Fish Curry Masala, Dal Chutney Pudi, Puliyogare Tamarind Rice Mix.
   - **Two Brothers Farm Collection:** A2 Desi Gir Cow Cultured Bilona Ghee, Wood-Pressed Groundnut Oil, Kachi Ghani Yellow Mustard Oil, Khapli Emmer Wheat Flour (Ancient Grain Atta), Raw Multifloral Wild Forest Honey, Natural Sugarcane Jaggery Powder, Indigenous Black Rice, Spiced Millet Crisps.
   - Dynamic multi-variant weight selection with real-time price re-calculation.
   - Rich filtering by Brand, Category, Price Range Slider, Best Seller tag, and instant keyword search.

4. **Complete E-Commerce Flow (Frontend Simulated):**
   - Slide-over animated Cart Drawer with free shipping progress threshold (₹999).
   - Dedicated Cart page (`/cart`) with order notes and instant coupons (`SOANS10`, `FARM20`, `FREESHIP`).
   - Checkout Flow (`/checkout`) modeled after Two Brothers reference:
     - Step 1: Contact Details
     - Step 2: Shipping Address (India with states + International country picker)
     - Step 3: Shipping Method (Standard Surface, Express Air Cargo, International DHL/FedEx)
     - Step 4: Payment Method UI (UPI / QR Demo, Card Mockup, NetBanking, Cash on Delivery)
     - Clear Demo Notices: "No real payments processed or collected".
   - Order Confirmation Page (`/order-confirmation/:orderId`) with confetti celebration, generated Order ID, live 4-stage tracking stepper, and printable PDF invoice action.

5. **Complete Suite of Navigation Pages:**
   - Home (`/`)
   - Unified Shop Catalogue (`/shop`)
   - Category View (`/category/:slug`)
   - Brand View (`/brand/:slug`)
   - Product Details with 3D Inspector (`/product/:slug`)
   - About NS SOANS & Kundapura Heritage (`/about`)
   - Vision & Mission (`/vision-mission`)
   - Services & Institutional Supply (`/services`)
   - Heritage Recipes with "Shop Ingredients" action (`/recipes` & `/recipes/:slug`)
   - Farm Stories & Soil Blog (`/stories` & `/stories/:slug`)
   - Customer Contact & Map (`/contact`)
   - Saved Wishlist (`/wishlist`)
   - Customer Portal (`/account`, `/login`, `/register`)
   - Frequently Asked Questions (`/faq`)
   - Legal Policies (`/shipping-policy`, `/refund-policy`, `/privacy-policy`, `/terms`)

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Core Framework** | React.js 18.3.1 (Vite 6.4.6) |
| **Styling & Theme** | Tailwind CSS 3.4.16 with bespoke Forest Green, Warm Gold & Cream palette |
| **3D Rendering** | Three.js 0.170, React Three Fiber 8.17, React Three Drei 9.120 |
| **Routing** | React Router DOM 6.28 |
| **State Management** | Zustand 5.0 with localStorage persistence |
| **Icons & Effects** | Lucide React 0.468, Canvas Confetti 1.9 |
| **Typography** | Playfair Display, Cormorant Garamond, Plus Jakarta Sans |

---

## 📁 Clean Folder Structure

```text
ns-soans-indian-farm/
├── public/
│   ├── logo.svg              # Official NS SOANS Gold & Green Crest Logo
│   ├── logo-white.svg        # Official Inverted Logo for dark header & footer
│   └── favicon / assets
├── src/
│   ├── components/
│   │   ├── AnnouncementBar.jsx # Rotating top alert bar
│   │   ├── Header.jsx          # Sticky header with instant predictive search & mega-menu
│   │   ├── Footer.jsx          # Comprehensive 5-column footer with official address & FSSAI
│   │   ├── ProductCard.jsx     # Card with hover zoom, weight selector, and quick view
│   │   ├── CategoryCard.jsx    # Card with dark vignette and explore link
│   │   ├── CartDrawer.jsx      # Slide-in drawer with live shipping calculator
│   │   ├── QuickViewModal.jsx  # Modal with 3D/photo switch & instant Add to Cart
│   │   ├── Newsletter.jsx      # Interactive newsletter with coupon voucher
│   │   └── StarRating.jsx      # Gold star review rating component
│   ├── three/
│   │   ├── HeroScene.jsx       # 3D interactive hero with switchable Pouch/Jar/Bottle models
│   │   ├── ProductViewer3D.jsx # 360-degree orbit inspector with wireframe mode
│   │   └── FloatingSpicesScene.jsx # Floating cardamom, cinnamon, star anise, chilli, turmeric
│   ├── pages/
│   │   ├── Home.jsx            # All 18 requested homepage sections
│   │   ├── Shop.jsx            # Unified catalogue with brand and category filters
│   │   ├── CategoryView.jsx    # Filtered category landing page
│   │   ├── BrandView.jsx       # Filtered brand landing page (NS SOANS vs Two Brothers)
│   │   ├── ProductDetails.jsx  # Interactive details page with 3D stage and recipe tips
│   │   ├── Cart.jsx            # Dedicated cart page with order notes
│   │   ├── Checkout.jsx        # Two Brothers style checkout UI with mock payment
│   │   ├── OrderConfirmation.jsx # Confetti, order tracking stepper, and invoice print
│   │   ├── Wishlist.jsx        # Saved wishlist items
│   │   ├── About.jsx           # Soans Home Industries origin and heritage story
│   │   ├── VisionMission.jsx   # Ecological vision and pure food mission
│   │   ├── Services.jsx        # Institutional supply, private labeling, exports
│   │   ├── Recipes.jsx         # Recipe archive
│   │   ├── RecipeDetails.jsx   # Step-by-step recipe with "Shop Ingredients" button
│   │   ├── FarmStories.jsx     # Farm chronicles and regenerative soil articles
│   │   ├── StoryDetails.jsx    # Full article view
│   │   ├── Contact.jsx         # Contact form, Kundapura address, and WhatsApp chat
│   │   ├── Account.jsx         # Sign in, registration, and patron dashboard
│   │   ├── FAQ.jsx             # Categorized accordion FAQs
│   │   └── LegalPolicies.jsx   # Shipping, Returns, Privacy, and Terms
│   ├── data/
│   │   ├── products.js         # Comprehensive product catalog with variants and nutrition
│   │   ├── categories.js       # Curated category metadata
│   │   ├── recipes.js          # Authentic recipes with ingredient cross-links
│   │   ├── stories.js          # Farm and spice heritage articles
│   │   └── reviews.js          # Customer reviews and testimonials
│   ├── store/
│   │   ├── cartStore.js        # Cart state, shipping rates, and coupon logic
│   │   └── wishlistStore.js    # Wishlist toggle and local storage sync
│   ├── styles/
│   │   └── index.css           # Tailwind base, gold gradients, glassmorphism, 3D card tilt
│   ├── App.jsx                 # Routing tree and scroll restoration
│   └── main.jsx                # Application root mount
├── index.html                  # HTML entry point with Google Fonts
├── package.json
├── tailwind.config.js          # Forest Green, Elegant Gold, Warm Cream colors
├── vite.config.js              # Vite config with manual chunk splitting
└── README.md
```

---

## 💻 Local Installation & Setup Instructions

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` to view the live website.

### 4. Build for Production
```bash
npm run build
```
Generates an optimized, chunk-split production bundle inside the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🔒 Demo-Only Features & Future Backend Integration Guide

This deliverable is strictly **FRONTEND ONLY**:

1. **State Persistence:**
   - Cart and Wishlist items are stored locally in the browser's `localStorage` (`ns_soans_cart_v1`, `ns_soans_wishlist_v1`).
   - In production, connect this to a REST or GraphQL Cart API / session cookie.

2. **Product Data:**
   - Product information, categories, recipes, and reviews are located in `src/data/products.js`, `categories.js`, `recipes.js`, and `reviews.js`.
   - The data model matches standard e-commerce schemas (`id`, `slug`, `brand`, `weightOptions`, `pricing`, `inventory`, `nutritionalInfo`), allowing drop-in replacement with backend API responses.

3. **Checkout & Payments:**
   - The checkout interface collects contact details, validates PIN codes, and lets users preview payment methods (UPI QR, Credit/Debit Cards, NetBanking, COD).
   - In production, integrate Razorpay, Cashfree, or Stripe SDKs in place of the demo submission timeout in `src/pages/Checkout.jsx`.

4. **Authentication:**
   - The `/account`, `/login`, and `/register` views provide full UI states and toggle between patron accounts and guest views.
   - In production, connect with JWT / OAuth auth endpoints.

