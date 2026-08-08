import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const RotatingBadge = ({ to = '/tracking', label = 'TRACK YOUR SHIPMENT', className = '' }) => {
  const pathId = 'rotating-badge-path';
  const repeated = `${label} • `.repeat(3);

  return (
    <Link
      to={to}
      className={`relative inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 group ${className}`}
      aria-label={label}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spin-slow">
        <defs>
          <path id={pathId} d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <text fill="currentColor" className="text-brand-green text-[9px] font-bold uppercase tracking-widest">
          <textPath href={`#${pathId}`}>{repeated}</textPath>
        </text>
      </svg>
      <span className="w-10 h-10 rounded-full bg-brand-amber text-gray-900 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
        <ArrowUpRight className="w-5 h-5" />
      </span>
    </Link>
  );
};

export default RotatingBadge;
