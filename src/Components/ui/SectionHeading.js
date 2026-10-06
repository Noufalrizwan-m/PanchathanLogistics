import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../lib/motion';

const SectionHeading = ({ eyebrow, title, subtitle, align = 'center', light = false, className = '' }) => {
  const alignClass = align === 'left' ? 'text-left items-start' : 'text-center items-center mx-auto';

  return (
    <motion.div {...fadeUp} className={`flex flex-col ${alignClass} max-w-3xl mb-8 md:mb-10 ${className}`}>
      {eyebrow && (
        <span className={`text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-3 ${light ? 'text-brand-amber' : 'text-brand-amberDark'}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`font-sora font-extrabold text-3xl md:text-4xl xl:text-5xl leading-tight ${light ? 'text-white' : 'text-brand-green'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base md:text-lg font-titillium ${light ? 'text-white/80' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
