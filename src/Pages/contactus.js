import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Clock, Loader2, CheckCircle2, XCircle,
  ShieldCheck, ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../Components/SEO';

const inputClass = "border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors bg-white text-gray-900 placeholder:text-gray-400 disabled:opacity-60";

const branches = [
  { city: 'Chennai', hq: true, address: 'Head Quarters, Plot No. 65, Annai Therasa Street, V.O.C. Nagar, Pammal, Chennai, Tamil Nadu - 600075' },
  { city: 'Kochi', address: 'New/63/3289, MBA Residency, Brother Mayooras Road, Kochi - 682016' },
  { city: 'Bangalore', address: 'No.29, 6th Main, 10th Cross, Sampangi Ram Nagar, Bangalore - 560027' },
  { city: 'Hyderabad', address: '1-8-506/B/1, Prakash Nagar, Begumpet, Hyderabad - 500016' },
  { city: 'Mumbai', address: 'Shop 03A/1B, Shanti Nagar, Opp. Marol MIDC Bus Depot, Andheri East, Mumbai - 400093' },
  { city: 'Kolkata', address: '#193A/17 Picnic Garden Road, Kolkata - 700039' },
  { city: 'Delhi', address: 'Plot No. A-50, Near Grand Shoba Hotel, Road No. 6, Mahipalpur, New Delhi - 110037' },
];

// Free, backend-less form delivery — sign up at web3forms.com with
// info@panchathanlogistics.com to get this key. It's a public site key
// (like a Formspree form ID), not a secret, so it's safe to ship client-side.
const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (WEB3FORMS_ACCESS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY") {
      console.error(
        'Contact form is not configured: WEB3FORMS_ACCESS_KEY in src/Pages/contactus.js is still ' +
        'the placeholder value. Sign up at web3forms.com with info@panchathanlogistics.com to get a ' +
        'real key, or every submission on this form will fail.'
      );
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Quote Request — ${form.service || 'General Enquiry'}`,
          from_name: form.name,
          name: form.name,
          email: form.email,
          phone: form.phone,
          service_of_interest: form.service,
          message: form.message,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', service: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div>
      <SEO
        title="Contact Us — Chennai HQ & Branches Across India"
        description="Get in touch with Panchathan Logistics. Head office in Pammal, Chennai, Tamil Nadu, with branches in Kochi, Bangalore, Hyderabad, Mumbai, Kolkata and Delhi. Call +91 73394 33590 for courier and cargo enquiries."
        keywords="contact Panchathan Logistics, courier office Chennai, cargo branch Tamil Nadu, logistics company contact India, Panchathan Logistics phone number"
        path="/contact"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Panchathan Logistics',
          url: 'https://panchathanlogistics.com/contact',
          telephone: '+91-73394-33590',
          location: branches.map((b) => ({
            '@type': 'Place',
            name: `Panchathan Logistics — ${b.city}`,
            address: b.address,
          })),
        }}
      />
      {/* HERO */}
      <section
        className="relative bg-brand-green text-white pt-32 md:pt-40 pb-16 md:pb-20 overflow-hidden flex items-center justify-center min-h-[50vh]"
      >
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{ backgroundImage: "url('/homebg.png')", backgroundSize: '420px', backgroundRepeat: 'repeat', backgroundAttachment: 'fixed' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center"
        >
          <h1 className="font-sora text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Nationwide Reach, Personal Response
          </h1>
          <p className="text-white/75 text-base md:text-lg max-w-2xl mx-auto">
            Whether you need a quote for one shipment or a full asset-management program, our team is
            ready to help.
          </p>
        </motion.div>
      </section>

      {/* INFO + FORM */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Contact Options */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="bg-white border border-gray-200 rounded-lg p-8"
            >
              <h3 className="text-xl font-sora font-bold text-brand-green mb-6">How Can We Help?</h3>
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">General Inquiries</p>
                    <p className="text-sm text-gray-700">info@panchathanlogistics.com</p>
                    <p className="text-sm text-gray-700">+91 73394 33590</p>
                  </div>
                </div>
                <div className="h-px w-full bg-gray-200" />
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Corporate Office</p>
                    <p className="text-sm text-gray-700">#1, Pallavan St, VOC Nagar, Pammal, Chennai, Tamil Nadu 600075</p>
                  </div>
                </div>
                <div className="h-px w-full bg-gray-200" />
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Office Hours (IST)</p>
                    <p className="text-sm text-gray-700">Mon – Sat: 10:00 AM – 7:30 PM</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-50 border border-gray-200 rounded-lg p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-7 h-7 text-brand-amberDark" />
                <h4 className="text-lg font-sora font-bold text-brand-green">24/7 Support</h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Logistics never sleeps, and neither do we. Our team ensures round-the-clock accountability
                for every asset in our network.
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-8 bg-white border border-gray-200 rounded-lg p-6 md:p-12"
          >
            <h2 className="text-2xl md:text-3xl font-sora font-bold text-brand-green mb-8">Send an Inquiry</h2>

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center py-10"
                >
                  <div className="w-14 h-14 rounded-lg bg-brand-green text-white flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-green mb-1">Message Sent!</h3>
                  <p className="text-sm text-gray-600 max-w-sm">
                    Thanks for reaching out — our team will get back to you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-5 text-sm font-semibold text-brand-green hover:text-brand-amberDark transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-6"
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Full Name</label>
                      <input type="text" placeholder="John Doe" required disabled={status === 'loading'} value={form.name} onChange={handleChange('name')} className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Work Email</label>
                      <input type="email" placeholder="john@company.com" required disabled={status === 'loading'} value={form.email} onChange={handleChange('email')} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone Number</label>
                      <input type="tel" placeholder="+91 00000 00000" required disabled={status === 'loading'} value={form.phone} onChange={handleChange('phone')} className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Service of Interest</label>
                      <select required disabled={status === 'loading'} value={form.service} onChange={handleChange('service')} className={`${inputClass} text-gray-600`}>
                        <option value="" disabled>Select a Service</option>
                        <option>Air Freight</option>
                        <option>Ocean Freight</option>
                        <option>Domestic Surface</option>
                        <option>Warehousing</option>
                        <option>Asset Management</option>
                        <option>International Export</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Message</label>
                    <textarea
                      placeholder="Provide details about your shipment needs (cargo type, volume, origin/destination)..."
                      rows="5"
                      required
                      disabled={status === 'loading'}
                      value={form.message}
                      onChange={handleChange('message')}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-start gap-2.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3.5">
                      <XCircle className="w-5 h-5 flex-shrink-0" />
                      <span>
                        Something went wrong sending your message. Please try again, or call us directly at{' '}
                        <a href="tel:+917339433590" className="font-semibold underline">+91 73394 33590</a>.
                      </span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="inline-flex items-center gap-2 bg-brand-amber text-gray-900 font-bold text-sm px-8 py-4 rounded hover:bg-brand-amberDark hover:text-white transition-colors disabled:opacity-60"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Submit Inquiry
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* REGIONAL HUBS */}
        <div className="mt-16 md:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-sora font-bold text-brand-green mb-3">Regional Hubs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Strategic branches ensuring seamless execution across every major commercial corridor in India.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((b, i) => (
              <motion.div
                key={b.city}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-brand-green transition-colors duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-sora font-bold text-gray-900">{b.city}</h3>
                  {b.hq && (
                    <span className="bg-brand-green text-white text-xs font-bold px-2 py-1 rounded">Head Office</span>
                  )}
                </div>
                <div className="flex flex-col gap-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-brand-amberDark mt-0.5 flex-shrink-0" />
                    <p>{b.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-amberDark flex-shrink-0" />
                    <p>+91 73394 33590</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
