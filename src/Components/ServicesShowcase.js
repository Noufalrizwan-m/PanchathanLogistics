import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// One card per service; each owns its own scroll-linked transform (hooks
// rules require this to live in its own component, not inside a .map()
// in the parent).
const ShowcaseCard = ({ service, index, total, scrollYProgress }) => {
  const segment = 1 / total;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const start = index * segment;
  const fadeIn = start + segment * 0.15;
  const fadeOut = start + segment * 0.85;
  const end = start + segment;

  // Keyframe points must be strictly increasing, so the first/last cards
  // (which don't need a fade-in/fade-out edge) use a shorter 3-point curve.
  const points = isFirst ? [start, fadeOut, end] : isLast ? [start, fadeIn, end] : [start, fadeIn, fadeOut, end];
  const opacityValues = isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0];
  const yValues = isFirst ? [0, 0, -50] : isLast ? [50, 0, 0] : [50, 0, 0, -50];
  const scaleValues = isFirst ? [1, 1, 0.94] : isLast ? [0.94, 1, 1] : [0.94, 1, 1, 0.94];

  const opacity = useTransform(scrollYProgress, points, opacityValues);
  const y = useTransform(scrollYProgress, points, yValues);
  const scale = useTransform(scrollYProgress, points, scaleValues);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="absolute inset-x-4 sm:inset-x-auto w-auto sm:w-[520px] bg-white rounded-3xl shadow-2xl p-8 md:p-10"
    >
      <div className="flex items-center justify-between mb-6">
        <span className="text-5xl font-sora font-black text-brand-amber/25">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="w-12 h-12 rounded-2xl bg-brand-green text-white flex items-center justify-center flex-shrink-0">
          <service.icon className="w-6 h-6" />
        </div>
      </div>
      <h3 className="font-sora text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{service.name}</h3>
      <p className="text-brand-green font-semibold mb-5 text-sm md:text-base">{service.subtitle}</p>
      <div className="flex flex-wrap gap-2">
        {service.details.slice(0, 3).map((d, i) => (
          <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">
            {d}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

const ServicesShowcase = ({ items, breadcrumb = 'Home / Services' }) => {
  const wrapperRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end end'] });

  return (
    <div ref={wrapperRef} className="snap-section relative" style={{ height: `${items.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-brand-green flex items-center justify-center">
        <span className="absolute top-6 left-6 md:top-10 md:left-10 text-xs font-bold uppercase tracking-widest text-white/50 z-20">
          {breadcrumb}
        </span>

        <h2 className="absolute font-sora font-black text-white/10 leading-none select-none text-center text-[15vw] whitespace-nowrap pointer-events-none">
          OUR SERVICES
        </h2>

        <div className="relative w-full flex items-center justify-center px-4">
          {items.map((service, i) => (
            <ShowcaseCard key={i} service={service} index={i} total={items.length} scrollYProgress={scrollYProgress} />
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-[11px] font-semibold uppercase tracking-[0.3em]">
          Scroll
        </div>
      </div>
    </div>
  );
};

export default ServicesShowcase;
