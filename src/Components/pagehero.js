import React from 'react';
import { motion } from 'framer-motion';

const PageHero = ({ title, subtitle, breadcrumb }) => {
  return (
    <div className="snap-section relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div
        className="absolute -top-20 right-0 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.6) 0%, rgba(245,166,35,0) 70%)' }}
      />
      <div
        className="absolute -bottom-24 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(23,93,41,0.5) 0%, rgba(23,93,41,0) 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block bg-white/60 backdrop-blur-xl border border-white/50 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-green mb-6"
        >
          {breadcrumb}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-sora text-4xl md:text-6xl xl:text-7xl font-extrabold text-brand-green leading-[1.05]"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-5 text-lg md:text-xl text-gray-600 max-w-2xl"
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );
};

export default PageHero;
