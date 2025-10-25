import React from 'react';
import { motion } from 'framer-motion';

// Reusable Hero component for internal pages
const PageHero = ({ title, subtitle, breadcrumb }) => {
    return (
        <div className="relative pt-24 pb-16 bg-[#f0f9ff] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 z-10">
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-sm font-semibold text-gray-500 tracking-widest uppercase mb-2"
                >
                    {breadcrumb}
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-extrabold text-[#175d29] leading-tight"
                >
                    {title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-4 text-xl md:text-2xl text-gray-700 max-w-3xl"
                >
                    {subtitle}
                </motion.p>
            </div>
            {/* Background flourish */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-500 opacity-10 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/4" />
        </div>
    );
};

export default PageHero;