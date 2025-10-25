import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- AnimatedBurgerButton component (remains the same and provides the mirrored animation) ---
const AnimatedBurgerButton = ({ isOpen, onClick }) => {
  // CHANGE 1: Set the default background color to your green ([#175d29])
  const lineBaseClasses =
    'h-1 w-6 block transition-all duration-300 ease-in-out transform rounded-full bg-[#175d29]';

  // CHANGE 2: Set the hover background color to the light gray ([#f9f9f9])
  const hoverColorClass = 'group-hover:bg-[#f9f9f9]';

  return (
    <button
      className="lg:hidden p-2 text-gray-700 hover:text-[#175d29] relative group z-50"
      onClick={onClick}
      aria-label="Toggle Menu"
    >
      <div className="flex flex-col justify-center items-center h-6 w-6">
        {/* Top line */}
        <span
          className={`${lineBaseClasses} ${hoverColorClass} ${isOpen
              ? 'translate-y-2 rotate-45'
              : '-translate-y-0.5'
            }`}
        ></span>

        {/* Middle line - fades out */}
        <span
          className={`${lineBaseClasses} ${hoverColorClass} my-0.5 ${isOpen ? 'opacity-0' : 'opacity-100'
            }`}
        ></span>

        {/* Bottom line */}
        <span
          className={`${lineBaseClasses} ${hoverColorClass} ${isOpen
              ? '-translate-y-2 -rotate-45'
              : 'translate-y-0.5'
            }`}
        ></span>
      </div>
    </button>
  );
};
// -----------------------------------------------------------------------------


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Tracking', path: '/tracking' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  // =========================================================================
  // NEW: Scroll Lock Effect
  // Prevents the body from scrolling when the menu is open.
  // =========================================================================
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to reset overflow when the component unmounts or isOpen changes
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  // =========================================================================


  // Helper to handle navigation and menu close
  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">

        <Link to="/" className="flex items-center h-full">
          <img
            src="logo.png"
            className="h-14 w-auto object-contain"
            alt="Panchathan Logistics Logo"
          />
        </Link>

        <nav className="hidden lg:flex flex-1 justify-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={handleNavClick}
              className="text-gray-600 hover:text-[#175d29] font-medium transition duration-300 relative group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#175d29] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="hidden lg:block px-4 py-2 bg-amber-500 text-gray-900 font-semibold rounded-full hover:bg-amber-600 transition-colors duration-300"
          >
            Get a Quote
          </Link>

          {/* Animated Burger Button */}
          <AnimatedBurgerButton
            isOpen={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          />

        </div>
      </div>

      {/* Mobile Menu - Enhanced Sliding Sidebar 
        - w-[80%] makes it responsive (80% of viewport width).
        - h-[calc(100vh-5rem)] accounts for the 20 (5rem) unit header height.
      */}
      <div
        className={`
          lg:hidden fixed top-20 left-0 h-[calc(100vh-5rem)] w-[100%] max-w-xl 
           backdrop-blur-sm shadow-xl py-4 z-40 overflow-y-auto
          transition-transform duration-300 ease-in-out 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >

        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={handleNavClick}
            className="block px-6 py-4 text-white text-center hover:bg-[#175d29]/10 hover:text-[#175d29] font-semibold transition-all duration-200 border-l-4 border-transparent hover:border-[#175d29]"
          >
            {link.name}
          </Link>
        ))}

        <Link
          to="/contact"
          onClick={() => setIsOpen(false)}
          className="block mt-6 mx-6 px-4 py-2 text-center bg-amber-500 text-gray-900 font-bold rounded-full hover:bg-amber-600 transition-colors duration-300 shadow-md"
        >
          Get a Quote
        </Link>
      </div>

      {/* Overlay/Backdrop with high opacity */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black opacity-70 z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;