import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Instagram } from 'lucide-react';

const Footer = () => (
  <footer className="bg-white text-gray-900 py-12 px-6 md:px-12">
    <div className="max-w-7xl mx-auto border-b border-gray-300 pb-8 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Logo & Tagline */}
        <div className="flex flex-col items-start">
          <Link to="/" className="flex items-center space-x-2 mb-4">
            <img
              src="logo.png"
              alt="Panchathan Logistics"
              className="w-3/4 md:w-full h-auto object-contain"
            />
          </Link>
          <p className="text-sm text-gray-500">
            One Stop For All Your Courier and Cargo Needs.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold text-[#175d29] mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { name: 'About Us', path: '/about' },
              { name: 'Services', path: '/services' },
              { name: 'Tracking', path: '/tracking' },
              { name: 'Contact Us', path: '/contact' },
            ].map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-gray-500 hover:text-[#175d29] transition-colors duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Core Services */}
        <div>
          <h4 className="text-lg font-bold text-[#175d29] mb-4">Core Services</h4>
          <ul className="space-y-2 text-sm">
            {[
              'Air Freight',
              'Ocean Freight',
              'Customs Clearance (Essential Forms)',
              'Warehousing',
            ].map((service) => (
              <li key={service}>
                <Link
                  to="/services"
                  className="text-gray-500 hover:text-[#175d29] transition-colors duration-300"
                >
                  {service}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h4 className="text-lg font-bold text-[#175d29] mb-4">Contact us</h4>
          <p className="text-sm text-gray-500">Email: info@panchathanlogistics.com</p>
          <p className="text-sm text-gray-500 mb-4">Phone: +91 73394 33590, +91 95147 53332</p>
          <div className="flex space-x-4 mt-2">
            <a
              href="https://www.facebook.com/profile.php?id=100066693142443"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#175d29] hover:text-[#0f3d19] transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>

            <a
              href="https://www.instagram.com/panchathan_logistics/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#175d29] hover:text-[#0f3d19] transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>

            <a
              href="https://www.linkedin.com/in/a-mohammed-jaffar-863003299"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#175d29] hover:text-[#0f3d19] transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>

    {/* Footer Bottom */}
    <div className="text-center">
      <p className="text-sm text-gray-400">
        © {new Date().getFullYear()} Panchathan Logistics. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
