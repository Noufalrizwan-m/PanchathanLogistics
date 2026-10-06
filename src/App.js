import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect } from "react";

// Import Components
import Header from '../src/Components/header';
import Footer from '../src/Components/footer';
import ShaderBackground from './Components/ShaderBackground';
import { MotionConfig } from 'framer-motion';

// Import Pages
import Home from '../src/Pages/home';
import Tracking from '../src/Pages/tracking';
import Services from '../src/Pages/services';
import About from '../src/Pages/aboutus';
import SEO from './Components/SEO';
import Contact from '../src/Pages/contactus';

function ScrollToTop() {
  const { pathname, hash, key } = useLocation();
  useLayoutEffect(() => {
    if (hash) {
      let target = hash.slice(1);
      try { target = decodeURIComponent(target); } catch (_) { /* Keep malformed fragments harmless. */ }
      const frame = requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView());
      return () => cancelAnimationFrame(frame);
    } else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash, key]);
  useEffect(() => {
    let frame;
    const reset = () => {
      if (window.location.hash) return;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
      });
    };
    reset();
    window.addEventListener('load', reset);
    window.addEventListener('pageshow', reset);
    window.addEventListener('beforeunload', reset);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('load', reset); window.removeEventListener('pageshow', reset); window.removeEventListener('beforeunload', reset); };
  }, []);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="fixed inset-0 -z-10"><ShaderBackground /></div>
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-screen pt-24 md:pt-28">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<div className="page-container section-space"><SEO path="/privacy" /><h1 className="text-4xl font-bold text-brand-green mb-6">Enquiry privacy</h1><p className="max-w-2xl leading-relaxed">We use the contact and shipment details you provide to respond to your enquiry and arrange requested logistics services. Your enquiry is sent to our business inboxes. Please do not include payment details, passwords, or identity documents. For questions about your enquiry or a request to remove it, email <a className="underline" href="mailto:info@panchathanlogistics.com">info@panchathanlogistics.com</a>.</p></div>} />
          <Route path="*" element={<div className="page-container section-space"><SEO path="/404" title="Page not found" description="The requested page is unavailable." /><h1 className="text-4xl font-bold text-brand-green mb-4">Page not found</h1><p className="mb-6">The page you requested is unavailable.</p><a className="underline text-brand-green font-semibold" href="/">Return home</a></div>} />
        </Routes>
      </main>
      <Footer />
      </MotionConfig>
    </Router>
  );
}

export default App;
