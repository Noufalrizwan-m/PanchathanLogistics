import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import GlassButton from './ui/GlassButton';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Tracking', path: '/tracking' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact Us', path: '/contact' },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const menuButton = useRef(null);
  const menuPanel = useRef(null);
  useEffect(() => { setIsOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!isOpen) return;
    const onKey = event => {
      if (event.key === 'Escape') { setIsOpen(false); menuButton.current?.focus(); }
      if (event.key === 'Tab') {
        const nodes = [menuButton.current, ...menuPanel.current.querySelectorAll('a')].filter(Boolean);
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const onResize = () => { if (window.innerWidth >= 1024) setIsOpen(false); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => { document.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-3 md:top-4 left-0 right-0 z-50 px-3 md:px-6"
      >
        <div
          className="relative max-w-6xl mx-auto flex items-center justify-between gap-3 rounded-full h-16 md:h-[4.5rem] pl-4 pr-3 md:pl-6 md:pr-4 bg-white/50 backdrop-blur-2xl backdrop-saturate-150 border border-white/70 shadow-[0_8px_32px_rgba(23,93,41,0.12),inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-1px_1px_rgba(255,255,255,0.1)] overflow-hidden"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-full" />
          <Link to="/" onClick={handleNavClick} className="flex items-center h-full shrink-0">
            <img
              src="/logo-480.webp" width="480" height="124"
              className="h-10 md:h-12 w-auto object-contain"
              alt="Panchathan Logistics"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  aria-current={active ? "page" : undefined}
                  to={link.path}
                  onClick={handleNavClick}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${active ? 'text-white' : 'text-gray-700 hover:text-brand-green'}`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-brand-green rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:block">
              <GlassButton to="/contact" size="sm" onClick={handleNavClick}>
                Get a Quote
              </GlassButton>
            </div>

            <button
              className="lg:hidden min-w-11 min-h-11 flex items-center justify-center p-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-brand-green"
              onClick={() => setIsOpen((v) => !v)}
              ref={menuButton} aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen} aria-controls="mobile-navigation"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            id="mobile-navigation" ref={menuPanel} role="navigation" aria-label="Mobile navigation"
            className="lg:hidden fixed inset-0 z-40 bg-brand-green flex flex-col items-center justify-center gap-2"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.4 }}
              >
                <Link
                  to={link.path}
                  onClick={handleNavClick}
                  className="block px-8 py-3 text-2xl font-sora font-bold text-white/90 hover:text-brand-amber transition-colors"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * navLinks.length, duration: 0.4 }}
              className="mt-6"
            >
              <GlassButton to="/contact" onClick={handleNavClick} size="lg">
                Get a Quote <ArrowRight className="w-4 h-4" />
              </GlassButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
