import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/motion';

const quickLinks = [
  { name: 'About Us', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Tracking', path: '/tracking' },
  { name: 'Contact Us', path: '/contact' },
];

const coreServices = ['Air Freight', 'Ocean Freight', 'Customs Clearance (Essential Forms)', 'Warehousing'];

const socials = [
  { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=100066693142443' },
  { icon: Instagram, href: 'https://www.instagram.com/panchathan_logistics/' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/a-mohammed-jaffar-863003299' },
];

const Footer = () => (
  <footer className="relative bg-brand-green text-white overflow-hidden">
    <div
      className="absolute inset-0 opacity-[0.08] pointer-events-none"
      style={{ backgroundImage: "url('/homebg.png')", backgroundSize: '420px', backgroundRepeat: 'repeat', backgroundAttachment: 'fixed' }}
    />
    <div
      className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
      style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.7) 0%, rgba(245,166,35,0) 70%)' }}
    />
    <motion.div {...fadeUp} className="relative max-w-7xl mx-auto px-6 md:px-12 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-10 border-b border-white/15">
        <div className="flex flex-col items-start">
          <Link to="/" className="mb-4 bg-white/95 rounded-2xl p-2 inline-block">
            <img src="/Logo.png" alt="Panchathan Logistics" className="h-12 w-auto object-contain" />
          </Link>
          <p className="text-sm text-white/70 leading-relaxed">
            One stop for your courier &amp; cargo needs — across India, and beyond.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-brand-amber mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="text-white/70 hover:text-white transition-colors duration-300">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-brand-amber mb-4">Core Services</h4>
          <ul className="space-y-2 text-sm">
            {coreServices.map((service) => (
              <li key={service}>
                <Link to="/services" className="text-white/70 hover:text-white transition-colors duration-300">
                  {service}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-brand-amber mb-4">Head Office</h4>
          <p className="text-sm text-white/70">info@panchathanlogistics.com</p>
          <p className="text-sm text-white/70 mb-4">+91 73394 33590</p>
          <div className="flex gap-3">
            {socials.map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand-amber hover:text-brand-green transition-colors duration-300"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-white/50 pt-8">
        © {new Date().getFullYear()} Panchathan Logistics. All rights reserved.
      </p>
    </motion.div>
  </footer>
);

export default Footer;
