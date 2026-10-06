import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/motion';
import PrivacyNotice from './PrivacyNotice';

const quickLinks = [
  { name: 'About Us', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Tracking', path: '/tracking' },
  { name: 'Contact Us', path: '/contact' },
];

const coreServices = [{ name: 'Asset Management', id: 'asset-management' }, { name: 'Air Freight', id: 'air-freight' }, { name: 'Customs Forms', id: 'customs-forms' }, { name: 'Warehousing', id: 'warehousing' }];

const socials = [
  { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/profile.php?id=100066693142443' },
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/panchathan_logistics/' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/panchathan-logistics-pvt-ltd/' },
];

const Footer = () => (
  <footer className="relative bg-brand-green text-white overflow-hidden">
    <div
      className="absolute inset-0 opacity-[0.08] pointer-events-none"
      style={{ backgroundImage: "url('/homebg-420.webp')", backgroundSize: '420px', backgroundRepeat: 'repeat', backgroundAttachment: 'scroll' }}
    />
    <div
      className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
      style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.7) 0%, rgba(245,166,35,0) 70%)' }}
    />
    <motion.div {...fadeUp} className="relative max-w-7xl mx-auto p-6 md:p-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 pb-6 lg:pb-8 border-b border-white/15">
        <div className="col-span-2 lg:col-span-1 flex flex-col items-start">
          <Link to="/" className="mb-4 bg-white/95 rounded-2xl p-2 inline-block">
            <img src="/logo-480.webp" width="689" height="178" loading="lazy" alt="Panchathan Logistics" className="h-10 sm:h-12 w-auto object-contain" />
          </Link>
          <p className="text-sm text-white/85 leading-relaxed">
            One stop for your courier &amp; cargo needs across India, and beyond.
          </p>
        </div>

        <div>
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider sm:tracking-widest text-brand-amber mb-3 lg:mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="text-white/85 hover:text-white transition-colors duration-300">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider sm:tracking-widest text-brand-amber mb-3 lg:mb-4">Core Services</h2>
          <ul className="space-y-2 text-sm">
            {coreServices.map((service) => (
              <li key={service.id}>
                <Link to={`/services#${service.id}`} className="text-white/85 hover:text-white transition-colors duration-300">
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-1 min-w-0">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-5 mb-5">
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider sm:tracking-widest text-brand-amber mb-3 lg:mb-4">Head Office</h2>
              <address className="not-italic text-sm text-white/85 leading-relaxed">
                Plot No. 65, Annai Therasa Street,<br />
                V.O.C. Nagar, Pammal,<br />
                Chennai, Tamil Nadu 600075
              </address>
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider sm:tracking-widest text-brand-amber mb-3 lg:mb-4 lg:sr-only">Contact</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs font-semibold text-brand-amber mb-1">Email</h3>
                  <a href="mailto:info@panchathanlogistics.com" className="block py-1 text-sm text-white/85 break-all hover:text-white">info@panchathanlogistics.com</a>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-brand-amber mb-1">Phone</h3>
                  <a href="tel:+917339433590" className="block py-1 text-sm text-white/85 hover:text-white">+91 73394 33590</a>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {socials.map(({ name, icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                aria-label={name}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand-amber hover:text-brand-green transition-colors duration-300"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-white/80 pt-6 lg:pt-8">
        © {new Date().getFullYear()} Panchathan Logistics. All rights reserved. <PrivacyNotice className="inline-flex min-h-11 items-center underline ml-2">Enquiry privacy</PrivacyNotice>
      </p>
    </motion.div>
  </footer>
);

export default Footer;
