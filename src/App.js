import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useRef, useState, useEffect } from "react";

// Import Components
import Header from '../src/Components/header';
import Footer from '../src/Components/footer';
import ShaderBackground from '../src/Components/ShaderBackground';
import CursorFollower from '../src/Components/ui/CursorFollower';

// Import Pages
import Home from '../src/Pages/home';
import Tracking from '../src/Pages/tracking';
import Services from '../src/Pages/services';
import About from '../src/Pages/aboutus';
import Contact from '../src/Pages/contactus';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <CursorFollower />
      <div className="fixed inset-0 -z-10">
        <ShaderBackground />
      </div>
      <Header />
      <main className="min-h-screen pt-24 md:pt-28">{/* offset for floating glass header */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;