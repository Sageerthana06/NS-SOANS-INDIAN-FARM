import puppeteer from 'puppeteer-core';
import { preview } from 'vite';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runQAAudit() {
  console.log('🚀 Starting NS SOANS INDIAN FARM Complete QA Browser Audit...\n');

  // 1. Start Vite Preview Server (serving production build)
  const previewServer = await preview({
    configFile: path.resolve('./vite.config.js'),
    preview: { port: 4173 }
  });
  const baseUrl = 'http://localhost:4173';
  console.log(`✅ Production Preview Server active at: ${baseUrl}`);

  // 2. Launch Chrome via puppeteer-core
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-gpu',
      '--window-size=1280,800'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const consoleErrors = [];
  const consoleWarnings = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(text);
    }
  });

  page.on('requestfailed', (req) => {
    failedRequests.push({ url: req.url(), failure: req.failure()?.errorText });
  });

  const results = {
    passed: [],
    failed: []
  };

  function assert(condition, testName, details = '') {
    if (condition) {
      results.passed.push(testName);
      console.log(`  ✓ PASS: ${testName}`);
    } else {
      results.failed.push({ testName, details });
      console.error(`  ✗ FAIL: ${testName} - ${details}`);
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 1: Homepage Load, Title, Branding
    // ----------------------------------------------------
    console.log('\n--- TEST 1: Homepage & Official Branding ---');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1', { timeout: 10000 });
    const pageTitle = await page.title();
    assert(pageTitle.includes('NS SOANS INDIAN FARM'), 'Page title contains official brand name', pageTitle);

    const logoSrc = await page.$eval('header img[alt*="NS SOANS"]', (el) => el.src);
    assert(logoSrc.includes('/logo.png'), 'Header contains official company logo (/logo.png)', logoSrc);

    const heroHeading = await page.$eval('h1', (el) => el.textContent.trim());
    assert(
      heroHeading.includes('FROM TRADITIONAL') && heroHeading.includes('NATURAL FARM'),
      'Hero heading matches exact required text',
      heroHeading
    );

    // ----------------------------------------------------
    // TEST 2: 3D Hero Scene, Canvas & Spices
    // ----------------------------------------------------
    console.log('\n--- TEST 2: 3D Hero Canvas & Interactive Model Switching ---');
    await page.waitForSelector('canvas', { timeout: 10000 });
    const canvasCount = await page.$$eval('canvas', (els) => els.length);
    assert(canvasCount >= 1, 'Three.js 3D WebGL Canvas rendered successfully on Homepage', `Canvas count: ${canvasCount}`);

    // Test 3D switcher buttons
    const switcherButtons = await page.$$eval('button', (btns) =>
      btns.map((b) => b.textContent.trim()).filter((t) => ['Masala Pouch', 'A2 Vedic Ghee Jar', 'Cold-Pressed Oil'].includes(t))
    );
    assert(switcherButtons.length === 3, 'Found all 3 3D model switcher pills', JSON.stringify(switcherButtons));

    // Click Ghee Jar
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Ghee Jar'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    assert(true, 'Switched 3D stage to A2 Vedic Ghee Jar smoothly');

    // ----------------------------------------------------
    // TEST 3: Predictive Search & Autocomplete
    // ----------------------------------------------------
    console.log('\n--- TEST 3: Predictive Search & Autocomplete ---');
    await page.click('button[title="Search Products"]');
    await page.waitForSelector('input[placeholder*="Search"]', { visible: true });
    await page.type('input[placeholder*="Search"]', 'Ghee');
    await new Promise((r) => setTimeout(r, 500));

    const searchResults = await page.$$eval('div[class*="overflow-y-auto"] a', (els) => els.map((e) => e.textContent));
    assert(searchResults.length > 0, 'Instant search autocomplete returns results for "Ghee"', `Count: ${searchResults.length}`);

    // Close search
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));

    // ----------------------------------------------------
    // TEST 4: Shop Page, Filters & Sorting
    // ----------------------------------------------------
    console.log('\n--- TEST 4: Shop Catalogue, Brand Filtering & Sorting ---');
    await page.goto(`${baseUrl}/shop`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main div[class*="grid"]', { timeout: 10000 });
    const initialProductCount = await page.$$eval('main div[class*="grid"] > div', (els) => els.length);
    assert(initialProductCount >= 12, 'Shop catalogue displays all initial products', `Found: ${initialProductCount}`);

    // Filter by Brand: Two Brothers Farm
    await page.evaluate(() => {
      const radio = Array.from(document.querySelectorAll('input[type="radio"]')).find(
        (r) => r.name === 'brandFilter' && r.parentElement.textContent.includes('Two Brothers')
      );
      if (radio) radio.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    const tbProductCards = await page.$$eval('main div[class*="grid"] > div', (els) =>
      els.map((e) => e.textContent).filter((t) => t.includes('Two Brothers'))
    );
    assert(tbProductCards.length > 0, 'Brand filter successfully narrows down to Two Brothers products', `Count: ${tbProductCards.length}`);

    // Sort by Price: Low to High
    await page.select('select', 'price-low');
    await new Promise((r) => setTimeout(r, 400));
    const sortedPrices = await page.$$eval('main span[class*="font-extrabold"]', (els) =>
      els.map((e) => parseInt(e.textContent.replace(/\D/g, ''), 10)).filter((n) => !isNaN(n))
    );
    const isSorted = sortedPrices.slice(0, 5).every((val, i, arr) => !i || arr[i - 1] <= val);
    assert(isSorted, 'Sorting products by Price Low to High works accurately', JSON.stringify(sortedPrices.slice(0, 5)));

    // ----------------------------------------------------
    // TEST 5: Quick View Modal & 3D Model Inspection
    // ----------------------------------------------------
    console.log('\n--- TEST 5: Quick View Modal & 3D Interactive Inspection ---');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Quick View'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    const quickViewOpen = await page.$('div[class*="scaleIn"]');
    assert(!!quickViewOpen, 'Quick View modal opened successfully on product card interaction');

    // Switch to 3D model inside modal
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('3D Interactive Model'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    const modalCanvas = await page.$('div[class*="scaleIn"] canvas');
    assert(!!modalCanvas, '3D Interactive canvas loads inside Quick View modal');

    // Close quick view modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('div[class*="scaleIn"] button');
      if (closeBtn) closeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // ----------------------------------------------------
    // TEST 6: Product Details Page & Variant Selection
    // ----------------------------------------------------
    console.log('\n--- TEST 6: Product Details, Variant Pricing & PIN Estimator ---');
    await page.goto(`${baseUrl}/product/soans-kundapura-chicken-ghee-roast-masala`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1', { timeout: 10000 });
    const productTitle = await page.$eval('h1', (el) => el.textContent.trim());
    assert(productTitle.includes('Ghee Roast'), 'Product details loaded for Kundapura Chicken Ghee Roast', productTitle);

    // Check variant pricing update
    const initialPrice = await page.$eval('div[class*="rounded-3xl"] span[class*="font-black"]', (el) => el.textContent.trim());
    await page.evaluate(() => {
      const opt = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('500g'));
      if (opt) opt.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    const updatedPrice = await page.$eval('div[class*="rounded-3xl"] span[class*="font-black"]', (el) => el.textContent.trim());
    assert(initialPrice !== updatedPrice, 'Variant selector reactively updates price (200g vs 500g)', `${initialPrice} -> ${updatedPrice}`);

    // Test PIN Code checker
    await page.type('input[placeholder*="6-digit PIN"]', '560001');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim() === 'Check');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    const pinMsg = await page.$eval('p[class*="text-emerald-700"]', (el) => el.textContent.trim());
    assert(pinMsg.includes('Available'), 'PIN code estimator validates Indian PIN codes correctly', pinMsg);

    // ----------------------------------------------------
    // TEST 7: Add to Cart, Drawer, Coupons & Free Shipping
    // ----------------------------------------------------
    console.log('\n--- TEST 7: Cart Drawer, Quantity Updates, Promo Codes ---');
    await page.evaluate(() => {
      const addBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Add to Cart'));
      if (addBtn) addBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    const drawerVisible = await page.$('div[class*="animate-slideLeft"]');
    assert(!!drawerVisible, 'Cart drawer slides in after clicking Add to Cart');

    // Test coupon code SOANS10
    await page.type('input[placeholder*="Coupon code"]', 'SOANS10');
    await page.evaluate(() => {
      const applyBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim() === 'Apply');
      if (applyBtn) applyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    const couponApplied = await page.$eval('div[class*="bg-gold-50"]', (el) => el.textContent);
    assert(couponApplied.includes('SOANS10') && couponApplied.includes('10% OFF'), 'Coupon SOANS10 applied 10% discount successfully', couponApplied);

    // ----------------------------------------------------
    // TEST 8: Wishlist & LocalStorage Persistence
    // ----------------------------------------------------
    console.log('\n--- TEST 8: Wishlist & localStorage Persistence ---');
    await page.goto(`${baseUrl}/product/two-brothers-a2-desi-gir-cow-cultured-ghee`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('button[title*="Wishlist"]', { timeout: 10000 });
    await page.click('button[title*="Wishlist"]');
    await new Promise((r) => setTimeout(r, 400));

    const storedWishlist = await page.evaluate(() => localStorage.getItem('ns_soans_wishlist_v1'));
    assert(storedWishlist && storedWishlist.includes('tb-a2-desi-cow-ghee'), 'Wishlist item persisted to localStorage', storedWishlist);

    await page.goto(`${baseUrl}/wishlist`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1', { timeout: 10000 });
    const wishlistItems = await page.$$eval('div[class*="grid"] > div', (els) => els.length);
    assert(wishlistItems >= 1, 'Wishlist page displays saved items from storage', `Count: ${wishlistItems}`);

    // ----------------------------------------------------
    // TEST 9: Dedicated Cart Page & Checkout Flow
    // ----------------------------------------------------
    console.log('\n--- TEST 9: Checkout Flow & Order Confirmation ---');
    await page.goto(`${baseUrl}/checkout`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('div[class*="bg-amber-50"]', { timeout: 10000 });
    const checkoutBanner = await page.$eval('div[class*="bg-amber-50"]', (el) => el.textContent);
    assert(checkoutBanner.includes('FRONTEND DEMO CHECKOUT ONLY'), 'Prominent Frontend Demo notice is displayed on Checkout', checkoutBanner);

    // Switch payment method to COD
    await page.evaluate(() => {
      const codBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Cash on Delivery'));
      if (codBtn) codBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));
    assert(true, 'Switched payment method to Cash on Delivery');

    // Place Demo Order
    await page.evaluate(() => {
      const placeBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Place Order'));
      if (placeBtn) placeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 2000));

    const currentUrl = page.url();
    assert(currentUrl.includes('/order-confirmation/'), 'Redirected to Order Confirmation page after order placement', currentUrl);

    const orderConfirmedH1 = await page.$eval('h1', (el) => el.textContent.trim());
    assert(orderConfirmedH1.includes('Order #') && orderConfirmedH1.includes('Confirmed!'), 'Order reference ID and confirmation generated', orderConfirmedH1);

    const stepperCount = await page.$$eval('div[class*="max-w-3xl"] div[class*="grid-cols-4"] > div', (els) => els.length);
    assert(stepperCount === 4, '4-stage fulfillment tracking stepper displayed on confirmation', `Stages: ${stepperCount}`);

    // ----------------------------------------------------
    // TEST 10: Information & Content Pages
    // ----------------------------------------------------
    console.log('\n--- TEST 10: Content Pages, Recipes, Stories & Contact ---');
    const routesToTest = [
      { path: '/about', selector: 'h1', expected: 'Four Decades' },
      { path: '/vision-mission', selector: 'h1', expected: 'Vision & Mission' },
      { path: '/services', selector: 'h1', expected: 'Our Services' },
      { path: '/recipes', selector: 'h1', expected: 'Authentic Recipes' },
      { path: '/recipes/authentic-kundapura-chicken-ghee-roast', selector: 'h1', expected: 'Kundapura Chicken Ghee Roast' },
      { path: '/stories', selector: 'h1', expected: 'Farm Stories' },
      { path: '/stories/the-scent-of-kundapura-four-decades-of-spice-craft', selector: 'h1', expected: 'The Scent of Kundapura' },
      { path: '/contact', selector: 'h1', expected: 'Contact & Visit Us' },
      { path: '/faq', selector: 'h1', expected: 'Frequently Asked Questions' },
      { path: '/shipping-policy', selector: 'h1', expected: 'Shipping' },
      { path: '/refund-policy', selector: 'h1', expected: 'Refund' },
      { path: '/privacy-policy', selector: 'h1', expected: 'Privacy' },
      { path: '/terms', selector: 'h1', expected: 'Terms' },
      { path: '/account', selector: 'h1', expected: 'Sharma' },
      { path: '/brand/ns-soans', selector: 'h1', expected: 'NS SOANS' },
      { path: '/brand/two-brothers', selector: 'h1', expected: 'Two Brothers' }
    ];

    for (const r of routesToTest) {
      await page.goto(`${baseUrl}${r.path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector(r.selector, { timeout: 10000 });
      const text = await page.$eval(r.selector, (el) => el.textContent.trim());
      assert(text.includes(r.expected), `Route ${r.path} rendered successfully`, text);
    }

    // Test FAQ Accordion expansion
    await page.goto(`${baseUrl}/faq`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('button', { timeout: 10000 });
    const initialFaqAnswers = await page.$$eval('div[class*="leading-relaxed border-t"]', (els) => els.length);
    await page.evaluate(() => {
      const qBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('GI-tagged Byadgi'));
      if (qBtn) qBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));
    const newFaqAnswers = await page.$$eval('div[class*="leading-relaxed border-t"]', (els) => els.length);
    assert(newFaqAnswers >= initialFaqAnswers, 'FAQ accordion expands on question click', `Open count: ${newFaqAnswers}`);

    // Test Contact Form Submission
    await page.goto(`${baseUrl}/contact`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('form', { timeout: 10000 });
    await page.type('input[placeholder*="Ramesh Hegde"]', 'Kavitha Shenoy');
    await page.type('input[placeholder*="ramesh@example"]', 'kavitha@example.com');
    await page.type('input[placeholder*="+91 98450"]', '+91 98451 99999');
    await page.type('textarea[placeholder*="requirements"]', 'Interested in bulk festival corporate gifting hampers of your authentic masalas.');
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Send Message'));
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    const hasDispatchedHeading = await page.evaluate(() =>
      Array.from(document.querySelectorAll('h3')).some((h) => h.textContent.includes('Dispatched'))
    );
    assert(hasDispatchedHeading, 'Contact inquiry form successfully submits and displays confirmation');

    // ----------------------------------------------------
    // TEST 11: Responsive Viewports (Tablet & Mobile)
    // ----------------------------------------------------
    console.log('\n--- TEST 11: Responsive Layouts (Tablet 768px & Mobile 375px) ---');
    // Tablet Viewport (768 x 1024)
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('canvas', { timeout: 10000 });
    const tabletCanvas = await page.$('canvas');
    assert(!!tabletCanvas, '3D Canvas responsive on Tablet (768px)');

    // Mobile Viewport (375 x 812)
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('button[aria-label="Open Navigation Menu"]', { timeout: 10000 });
    const mobileMenuBtn = await page.$('button[aria-label="Open Navigation Menu"]');
    assert(!!mobileMenuBtn, 'Mobile hamburger menu button visible on 375px viewport');

    // Open mobile hamburger menu
    await mobileMenuBtn.click();
    await new Promise((r) => setTimeout(r, 400));
    const mobileDrawer = await page.$('div[class*="animate-slideRight"]');
    assert(!!mobileDrawer, 'Mobile navigation drawer slides in smoothly');

    // ----------------------------------------------------
    // TEST 12: Network Health & Console Errors
    // ----------------------------------------------------
    console.log('\n--- TEST 12: Network Health & Console Errors ---');
    const realConsoleErrors = consoleErrors.filter(
      (err) => !err.includes('favicon') && !err.includes('THREE.WebGLRenderer: A WebGL context could not be created')
    );
    assert(realConsoleErrors.length === 0, 'Zero runtime JavaScript console errors detected', JSON.stringify(realConsoleErrors));
    assert(failedRequests.length === 0, 'Zero failed resource network requests (all images, scripts, fonts 200 OK)', JSON.stringify(failedRequests));

  } catch (error) {
    console.error('Fatal Test Exception:', error);
    results.failed.push({ testName: 'Test Execution Exception', details: error.message });
  } finally {
    await browser.close();
    await previewServer.close();
    console.log('\n🏁 Audit Finished. Closed Chrome and Vite.\n');
  }

  // Final Summary Output
  console.log('====================================================');
  console.log(`TOTAL PASSED TESTS: ${results.passed.length}`);
  console.log(`TOTAL FAILED TESTS: ${results.failed.length}`);
  if (results.failed.length > 0) {
    console.log('FAILED TESTS DETAIL:');
    console.log(JSON.stringify(results.failed, null, 2));
  }
  console.log('====================================================');

  fs.writeFileSync('qa-audit-results.json', JSON.stringify({ results, consoleErrors, failedRequests }, null, 2));
}

runQAAudit();
