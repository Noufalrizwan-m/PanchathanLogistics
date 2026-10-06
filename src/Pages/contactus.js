import React from 'react';
import useInquiryForm from '../lib/useInquiryForm';
import { business } from '../lib/business';
import {
  Mail, Phone, MapPin, Clock, Loader2, XCircle,
  ShieldCheck, ArrowRight, Navigation,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../Components/SEO';
import EnquirySuccessDialog from '../Components/EnquirySuccessDialog';
import PhoneNumberField from '../Components/PhoneNumberField';
import SelectMenu from '../Components/SelectMenu';
import PrivacyNotice from '../Components/PrivacyNotice';
import { useNavigate } from 'react-router-dom';

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

const Contact = () => {
  const navigate = useNavigate();
  const { form, status, error, update, submit: handleSubmit, setStatus } = useInquiryForm();
  const handleChange = (field) => (event) => update({ target: { name: field, value: event.target.value } });

  return (
    <div>
      <SEO path="/contact" />
      {status === 'success' && <EnquirySuccessDialog onDone={() => { setStatus('idle'); navigate('/'); }} onAnother={() => { setStatus('idle'); requestAnimationFrame(() => document.getElementById('inquiry-name')?.focus({ preventScroll: true })); }} />}
      {/* HERO */}
      <section
        className="relative bg-brand-green text-white  overflow-hidden flex items-center justify-center min-h-[50vh]"
      >
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{ backgroundImage: "url('/homebg-420.webp')", backgroundSize: '420px', backgroundRepeat: 'repeat', backgroundAttachment: 'scroll' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-4xl mx-auto px-6 py-12 md:px-12"
        >
          <span className="text-xs text-white/60 font-bold uppercase tracking-[0.2em] mb-5 inline-block">
            Home / Contact Us
          </span>
          <h1 className="font-sora text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Nationwide Reach, Personal Response
          </h1>
          <p className="text-white/75 text-base md:text-lg max-w-2xl ">
            Whether you need a quote for one shipment or a full asset-management program, our team is
            ready to help.
          </p>
        </motion.div>
      </section>

      {/* INFO + FORM */}
      <section className="section-space px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Contact information follows the original two-card layout. */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 lg:col-span-4 rounded-xl border-t-4 border-brand-green bg-white p-6 md:p-8 shadow-lg">
            <h2 className="text-2xl font-sora font-bold text-gray-900 mb-7">Our Information</h2>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-brand-amber mt-1 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-brand-green mb-1">24/7 Support</h3>
                  <a href={business.phoneHref} className="inline-flex min-h-11 sm:min-h-0 items-center py-1 text-base font-semibold text-gray-700">{business.phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-brand-amber mt-1 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-brand-green mb-1">Email Enquiries</h3>
                  <a href={`mailto:${business.email}`} className="inline-flex min-h-11 sm:min-h-0 items-center py-1 text-base font-semibold text-gray-700 break-all">{business.email}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-brand-amber mt-1 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-brand-green mb-1">Corporate Address</h3>
                  <address className="not-italic text-base font-semibold leading-relaxed text-gray-700">{business.address}</address>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-brand-amber mt-1 shrink-0" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-brand-green mb-1">Office Hours (IST)</h3>
                  <p className="text-base font-semibold text-gray-700">Mon to Sat: 10:00 AM to 7:30 PM</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-6 h-6 shrink-0 text-brand-green" aria-hidden="true" />
                  <h3 className="text-base font-bold text-brand-green">Reliable Support</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">Logistics never sleeps, and neither do we. Our team ensures round-the-clock accountability for every asset in our network.</p>
              </div>
            </div>
          </motion.aside>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="order-1 lg:order-2 lg:col-span-8 bg-white rounded-xl shadow-lg p-6 md:p-8"
          >
            <h2 className="text-2xl md:text-3xl font-sora font-bold text-gray-900 mb-7">Get Your Personalised Quote</h2>

            <AnimatePresence mode="wait">
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-6"
                  onSubmit={handleSubmit}
                  aria-busy={status === 'loading'}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="inquiry-name" className="text-sm font-bold uppercase tracking-wider text-gray-500">Full Name *</label>
                      <input id="inquiry-name" name="name" autoComplete="name" maxLength={120} type="text" placeholder="John Doe" required disabled={status === 'loading'} value={form.name} onChange={handleChange('name')} className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="inquiry-email" className="text-sm font-bold uppercase tracking-wider text-gray-500">Work Email *</label>
                      <input id="inquiry-email" name="email" autoComplete="email" maxLength={254} type="email" placeholder="john@company.com" required disabled={status === 'loading'} value={form.email} onChange={handleChange('email')} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PhoneNumberField value={form.phone} country={form.phoneCountry}
                      onChange={(phone, country) => {
                        update({ target: { name: 'phone', value: phone } });
                        update({ target: { name: 'phoneCountry', value: country } });
                      }} disabled={status === 'loading'} inputClass={inputClass} />
                    <div className="flex flex-col gap-2">
                      <label id="inquiry-service-label" htmlFor="inquiry-service" className="text-sm font-bold uppercase tracking-wider text-gray-500">Service of Interest *</label>
                      <SelectMenu id="inquiry-service" labelId="inquiry-service-label" label="Service of Interest"
                        value={form.service} onChange={value => update({ target: { name: 'service', value } })}
                        disabled={status === 'loading'} placeholder="Select a Service"
                        options={['Asset Management', 'Air Freight', 'Domestic Surface', 'Warehousing', 'International Export', 'General Inquiry'].map(value => ({value, label: value === 'General Inquiry' ? 'General Enquiry' : value}))} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="inquiry-message" className="text-sm font-bold uppercase tracking-wider text-gray-500">Message (optional)</label>
                    <textarea
                      id="inquiry-message" name="message" maxLength={5000}
                      placeholder="Provide details about your shipment needs (cargo type, volume, origin/destination)..."
                      rows="5"
                      disabled={status === 'loading'}
                      value={form.message}
                      onChange={handleChange('message')}
                      className={`${inputClass} resize-y`}
                    />
                  </div>

                  <div className="hidden" aria-hidden="true"><label htmlFor="inquiry-website">Website</label><input id="inquiry-website" name="website" value={form.website} onChange={handleChange('website')} tabIndex={-1} autoComplete="off" /></div>
                  <p className="text-sm text-gray-600">We use your details to respond to your enquiry. <PrivacyNotice className="underline text-brand-green">How we use your details</PrivacyNotice></p>
                  {status === 'error' && (
                    <div role="alert" className="flex items-start gap-2.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3.5">
                      <XCircle className="w-5 h-5 flex-shrink-0" />
                      <span>
                        {error} Call us at{' '}
                        <a href="tel:+917339433590" className="font-semibold underline">+91 73394 33590</a>. <a href="mailto:info@panchathanlogistics.com" className="inline-flex min-h-11 items-center font-semibold underline">Email our team directly</a>
                      </span>
                    </div>
                  )}

                  <div className="flex">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="inline-flex w-full justify-center min-h-11 items-center gap-2 bg-brand-amber text-gray-900 font-bold text-sm px-8 py-4 rounded hover:bg-brand-amberDark hover:text-white transition-colors disabled:opacity-60"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Submit Enquiry
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
            </AnimatePresence>
          </motion.div>
        </div>

        <section aria-labelledby="office-map-heading" className="mt-8 md:mt-10 overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 md:p-6">
            <div>
              <h2 id="office-map-heading" className="text-xl font-bold text-gray-900">Visit Our Head Office</h2>
              <p className="mt-1 text-sm text-gray-600">{business.address}</p>
            </div>
            <a href={business.officeMapUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-green px-5 py-3 text-sm font-semibold text-white hover:brightness-110">
              <Navigation size={16} aria-hidden="true" /> Get directions
            </a>
          </div>
          <iframe title="Head office address on Google Maps" loading="lazy" referrerPolicy="strict-origin-when-cross-origin"
            src={business.officeMapEmbedUrl}
            className="block h-[260px] md:h-[320px] w-full border-0" allowFullScreen />
        </section>

        {/* REGIONAL HUBS */}
        <div className="mt-12 md:mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-8 md:mb-10"
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
                viewport={{ once: true, amount: 0.3 }}
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
