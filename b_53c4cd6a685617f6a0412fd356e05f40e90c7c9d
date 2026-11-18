import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Truck, RotateCcw, FileText, Lock } from 'lucide-react';
import { Reveal } from '../components/LuxuryMotion';

export default function LegalPolicies() {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Terms & Conditions';
  let icon = FileText;
  let subtitle = 'Guidelines for using the NS SOANS INDIAN FARM frontend storefront.';

  if (path.includes('shipping')) {
    title = 'Shipping & International Delivery Policy';
    icon = Truck;
    subtitle = 'Comprehensive dispatch timelines, coverage, and packaging standards.';
  } else if (path.includes('refund') || path.includes('return')) {
    title = 'Return & Refund Policy';
    icon = RotateCcw;
    subtitle = 'Zero-hassle replacement and refund policy for food safety and integrity.';
  } else if (path.includes('privacy')) {
    title = 'Privacy & Data Protection Policy';
    icon = Lock;
    subtitle = 'How we respect and safeguard customer information.';
  }

  const IconComponent = icon;

  return (
    <div className="min-h-screen bg-cream-50 py-12 px-4 sm:px-6 lg:px-8">
      <Reveal className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto mb-2">
            <IconComponent className="w-6 h-6 text-gold-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-serif text-forest-950">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            {subtitle}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm text-xs sm:text-sm text-stone-700 leading-relaxed space-y-6">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <strong>Demonstration Notice:</strong> The terms and policies displayed here represent our operational guidelines under Soans Home Industries, Kundapura.
          </div>

          {path.includes('shipping') && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-forest-950">1. Domestic Delivery (Pan-India)</h3>
              <p>
                All orders are dispatched from our production and warehousing facility in Kundapura, Udupi District, Karnataka. Orders are processed within 24 to 48 hours of confirmation. Standard delivery takes 3–5 business days, with free shipping on orders above ₹999.
              </p>
              <h3 className="text-base font-bold text-forest-950">2. International Coverage</h3>
              <p>
                We service international addresses in the USA, UK, UAE, Canada, Australia, Singapore, and Europe. Cross-border packages are vacuum-sealed and cleared with phytosanitary documentation.
              </p>
            </div>
          )}

          {(path.includes('refund') || path.includes('return')) && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-forest-950">1. Perishable Food Safety Standards</h3>
              <p>
                Due to food safety and hygiene protocols, consumable food items once unsealed cannot be returned. However, if your order arrives damaged, leaking, or with a broken seal, we offer an immediate 100% free replacement or refund.
              </p>
              <h3 className="text-base font-bold text-forest-950">2. Transit Damage Claims</h3>
              <p>
                Please notify our customer care team via WhatsApp (+91 63615 78948) or email (
                <a
                  href="mailto:nssoansindianfarm.masala@gmail.com"
                  className="text-forest-900 hover:text-gold-700 font-semibold underline transition-colors"
                >
                  nssoansindianfarm.masala@gmail.com
                </a>
                ) within 48 hours of delivery with photos of the damaged parcel.
              </p>
            </div>
          )}

          {path.includes('privacy') && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-forest-950">1. Collection of Information</h3>
              <p>
                We only collect essential customer contact and delivery details required for order processing and dispatch communication. We never sell or lease personal data to external advertisers.
              </p>
              <h3 className="text-base font-bold text-forest-950">2. Payment Security</h3>
              <p>
                In production, all financial transactions occur via RBI-authorized, PCI-DSS Level 1 compliant payment gateways. In this frontend demo, no financial information is processed.
              </p>
            </div>
          )}

          {path.includes('terms') && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-forest-950">1. Intellectual Property &amp; Branding</h3>
              <p>
                The trademarks NS SOANS INDIAN FARM and Soans Home Industries belong to their respective proprietary owners in Kundapura, Udupi District, Karnataka.
              </p>
              <h3 className="text-base font-bold text-forest-950">2. Product Descriptions &amp; Accuracy</h3>
              <p>
                All weights, prices, and specifications represent our standard artisanal offerings and may be subject to agricultural seasonal availability.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <span>Last Updated: November 2024</span>
            <Link to="/contact" className="text-forest-900 hover:underline font-bold">
              Contact Legal Desk &rarr;
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

