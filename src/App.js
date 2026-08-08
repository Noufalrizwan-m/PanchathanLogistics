import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useRef, useState, useEffect } from "react";

// Import Components
import Header from '../src/Components/header';
import Footer from '../src/Components/footer';
import AmbientBackground from '../src/Components/ui/AmbientBackground';
import CursorFollower from '../src/Components/ui/CursorFollower';

// Import Pages
import Home from '../src/Pages/home';
import Tracking from '../src/Pages/tracking';
import Services from '../src/Pages/services';
import About from '../src/Pages/aboutus';
import Contact from '../src/Pages/contactus';

function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Router>
      <CursorFollower />
      <AmbientBackground />
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