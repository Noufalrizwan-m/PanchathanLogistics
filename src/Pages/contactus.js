import React, { useState } from 'react';
import PageHero from '../Components/pagehero';
import GlassCard from '../Components/ui/GlassCard';
import GlassButton from '../Components/ui/GlassButton';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/motion';

const inputClass = "w-full p-4 bg-white/60 border border-white/60 rounded-2xl focus:ring-2 focus:ring-brand-green/40 focus:outline-none transition duration-300 placeholder:text-gray-500";

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Quote Request — ${form.service || 'General Enquiry'}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nService: ${form.service}\n\n${form.message}`
    );
    window.location.href = `mailto:info@panchathanlogistics.com?subject=${subject}&body=${body}`;
  };

  return (
    <div>
      <PageHero
        title="Connect with Our Team"
        subtitle="Your next shipment begins with a conversation. We're here to assist you, 24/7."
        breadcrumb="Home / Contact Us"
      />

      <section className="snap-section py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <GlassCard {...fadeUp} hover={false} className="lg:col-span-1 space-y-7 p-8 border-t-4 border-t-brand-green">
            <h2 className="text-2xl font-sora font-bold text-gray-900">Our Information</h2>

            {[
              { icon: Phone, title: "24/7 Support", value: "+91 73394 33590" },
              { icon: Mail, title: "Email Inquiry", value: "info@panchathanlogistics.com" },
              { icon: MapPin, title: "Corporate Address", value: "#1, Pallavan St, VOC Nagar, Pammal, Chennai, Tamil Nadu 600075" },
              { icon: MapPin, title: "Warehouse Address", value: "#4, Lakshmi Nagar, Service Road, Anakaputhur, Chennai - 600 070." },
              { icon: Clock, title: "Office Hours (IST)", value: "Mon - Sat: 10:00 AM - 7:30 PM" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-amber/15 text-brand-amberDark flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-green">{item.title}</p>
                  <p className="text-base text-gray-800 font-medium">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </GlassCard>

          <GlassCard
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
            hover={false}
            className="lg:col-span-2 p-6 md:p-10"
          >
            <h2 className="text-2xl md:text-3xl font-sora font-bold text-gray-900 mb-8">Get Your Personalized Quote</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input type="text" placeholder="Full Name" required value={form.name} onChange={handleChange('name')} className={inputClass} />
                <input type="email" placeholder="Work Email" required value={form.email} onChange={handleChange('email')} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input type="tel" placeholder="Phone Number (+91...)" required value={form.phone} onChange={handleChange('phone')} className={inputClass} />
                <select required value={form.service} onChange={handleChange('service')} className={`${inputClass} text-gray-600`}>
                  <option value="" disabled>Service of Interest</option>
                  <option>Air Freight</option>
                  <option>Ocean Freight</option>
                  <option>Domestic Surface</option>
                  <option>Warehousing</option>
                </select>
              </div>
              <textarea
                placeholder="Tell us about your shipment needs (cargo type, volume, origin/destination)"
                rows="5"
                required
                value={form.message}
                onChange={handleChange('message')}
                className={inputClass}
              />

              <GlassButton type="submit" size="lg" className="w-full">
                Submit Request
              </GlassButton>
            </form>
          </GlassCard>
        </div>
      </section>

      <section className="snap-section px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <GlassCard {...fadeUp} hover={false} className="h-[400px] md:h-[500px] w-full overflow-hidden p-2">
          <iframe
            title="Panchathan Logistics Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.123456789!2d80.1389123!3d12.9767123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266abcdef1234%3A0x1234567890abcdef!2s1%20Pallavan%20St%2C%20VOC%20Nagar%2C%20Pammal%2C%20Chennai%2C%20Tamil%20Nadu%20600075!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '1.25rem' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </GlassCard>
      </section>
    </div>
  );
};

export default Contact;
