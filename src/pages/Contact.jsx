import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle
} from 'lucide-react';
import { Reveal } from '../components/LuxuryMotion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Order Inquiry',
    message: ''
  });
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedSubject || !trimmedMessage) {
      setValidationError('Please fill in all required fields before sending your message on WhatsApp.');
      return;
    }

    setValidationError('');

    const whatsappText = [
      'Hello NS SOANS INDIAN FARM Team,',
      '',
      'I would like to make an inquiry.',
      '',
      `Full Name: ${trimmedName}`,
      `Email Address: ${trimmedEmail}`,
      `Phone / Mobile: ${trimmedPhone}`,
      `Inquiry Subject: ${trimmedSubject}`,
      '',
      'Message:',
      trimmedMessage,
      '',
      'Thank you.'
    ].join('\n');

    const encodedMessage = encodeURIComponent(whatsappText);
    const whatsappUrl = `https://wa.me/916361578948?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-cream-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <Reveal className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-forest-100 text-forest-900 inline-block">
            Kundapura Headquarters
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-serif text-forest-950">
            Contact &amp; Visit Us
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Have questions about our generational spice formulations, wholesale supplies, or international parcel tracking? We are here to assist.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Official Info & Hours */}
          <Reveal className="lg:col-span-5 space-y-6" delay={0.08}>
            <div className="bg-forest-950 text-white rounded-3xl p-8 border border-gold-500/30 shadow-xl space-y-6">
              <div className="border-b border-forest-900 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gold-400 block">
                  NS SOANS INDIAN FARM
                </span>
                <h3 className="text-xl font-serif font-black text-white mt-0.5">
                  Soans Home Industries
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-bold mb-0.5">
                      Soans Home Industries
                    </strong>
                    <p className="text-stone-300">'Ashwin'</p>
                    <p className="text-stone-300">Opp. Parijatha Hotel, Main Road,</p>
                    <p className="text-stone-300">Kundapura, Udupi District,</p>
                    <p className="text-stone-300">Karnataka, India – 576201.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gold-400 shrink-0" />
                  <div>
                    <strong className="block text-white font-bold mb-0.5">Direct Helpline:</strong>
                    <a
                      href="tel:+916361578948"
                      className="text-gold-300 hover:text-white font-bold"
                    >
                      +91 63615 78948
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gold-400 shrink-0" />
                  <div>
                    <strong className="block text-white font-bold mb-0.5">Customer Support:</strong>
                    <a
                      href="mailto:nssoansindianfarm.masala@gmail.com"
                      className="text-stone-300 hover:text-white"
                    >
                      nssoansindianfarm.masala@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-forest-900">
                  <Clock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-bold mb-0.5">Operating Hours:</strong>
                    <p className="text-stone-300">Monday – Saturday: 9:00 AM – 7:30 PM IST</p>
                    <p className="text-stone-400 text-[11px]">Sunday: Farm Processing Only</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Link */}
              <div className="pt-2">
                <a
                  href="https://wa.me/916361578948"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp: +91 63615 78948</span>
                </a>
              </div>
            </div>

            {/* Interactive Location Map representation */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-forest-950 uppercase tracking-wider">
                Kundapura, Udupi Coastal Region
              </h4>
              <div className="relative h-48 rounded-2xl bg-emerald-50 border border-stone-200 overflow-hidden flex items-center justify-center text-center p-4">
                <div className="space-y-1">
                  <MapPin className="w-8 h-8 text-spice-600 mx-auto" />
                  <p className="text-xs font-bold text-forest-950">
                    Soans Home Industries • 'Ashwin'
                  </p>
                  <p className="text-xs font-semibold text-forest-900">
                    Opp. Parijatha Hotel, Main Road,
                  </p>
                  <p className="text-[11px] text-stone-600">
                    Kundapura, Udupi District, Karnataka, India – 576201.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Contact Form */}
          <Reveal className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm" delay={0.14}>
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <h3 className="text-xl font-serif font-black text-forest-950 border-b border-stone-100 pb-3">
                Send Us a Direct Message
              </h3>

              {validationError && (
                <div className="p-3.5 rounded-xl bg-spice-50 border border-spice-200 text-spice-700 text-xs font-semibold">
                  {validationError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (validationError) setValidationError('');
                    }}
                    placeholder="e.g. Ramesh Hegde"
                    className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (validationError) setValidationError('');
                    }}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone / Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (validationError) setValidationError('');
                    }}
                    placeholder="+91 98450 00000"
                    className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Inquiry Subject *
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => {
                      setFormData({ ...formData, subject: e.target.value });
                      if (validationError) setValidationError('');
                    }}
                    className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl bg-white focus:border-gold-500 focus:outline-none"
                  >
                    <option value="General Order Inquiry">General Order Inquiry</option>
                    <option value="Bulk & Restaurant Supply">Bulk &amp; Restaurant Supply</option>
                    <option value="Corporate & Wedding Gifting">Corporate &amp; Wedding Gifting</option>
                    <option value="International Shipping Query">International Shipping Query</option>
                    <option value="Recipe Formulation Feedback">Recipe Formulation Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (validationError) setValidationError('');
                  }}
                  placeholder="Tell us about your requirements or product questions..."
                  className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:border-gold-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl gold-btn text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Send Message to Kundapura Desk</span>
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

