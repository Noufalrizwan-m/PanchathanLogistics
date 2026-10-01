import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { buttonTap } from '../../lib/motion';

const VARIANTS = {
  primary: 'bg-gradient-to-r from-brand-amber to-brand-amberDark text-gray-900 shadow-glass border border-white/40',
  secondary: 'bg-white/50 backdrop-blur-xl text-brand-green border border-brand-green hover:bg-white/70',
  ghost: 'bg-transparent text-brand-green border border-transparent hover:border-brand-green',
  dark: 'bg-brand-green text-white border border-white/10 hover:brightness-110',
};

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm md:text-base',
  lg: 'px-8 py-4 text-base md:text-lg',
};

const GlassButton = ({ to, href, onClick, type = 'button', variant = 'primary', size = 'md', className = '', children, disabled, ...rest }) => {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (to) {
    return (
      <motion.div {...buttonTap} className="inline-block">
        <Link to={to} className={classes}>{children}</Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...buttonTap} {...rest}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} disabled={disabled} className={classes} {...buttonTap} {...rest}>
      {children}
    </motion.button>
  );
};

export default GlassButton;
