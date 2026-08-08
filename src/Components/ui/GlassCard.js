import React from 'react';
import { motion } from 'framer-motion';
import { glassHover } from '../../lib/motion';

// Glass is always the white/frosted surface — bold color blocks (e.g. the
// stats panel) are plain solid brand-green fills, not a "glass" variant.
const GlassCard = ({ as = 'div', hover = true, className = '', children, ...rest }) => {
  const Comp = motion[as] || motion.div;
  const hoverProps = hover ? glassHover : {};

  return (
    <Comp
      className={`backdrop-blur-xl border rounded-3xl shadow-glass bg-white/60 border-white/60 text-gray-900 ${className}`}
      {...hoverProps}
      {...rest}
    >
      {children}
    </Comp>
  );
};

export default GlassCard;
