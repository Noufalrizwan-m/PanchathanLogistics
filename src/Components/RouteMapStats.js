import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Package, Plane } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeading from './ui/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

const GREEN = '#175d29';

const cardStats = [
  { number: 45000, suffix: '+', label: 'Shipments Delivered', variant: 'light' },
  { number: 6, suffix: ' Years', label: 'In Logistics', variant: 'dark' },
  { number: 18450, suffix: '+', label: 'Worldwide Shipments', variant: 'light' },
];

const StatCard = ({ stat, delay, className = '' }) => {
  const valueRef = useRef(null);
  const isDark = stat.variant === 'dark';

  useEffect(() => {
    if (!valueRef.current) return undefined;
    const el = valueRef.current;
    el.innerText = '0' + stat.suffix;

    const tween = gsap.to({ val: 0 }, {
      val: stat.number,
      duration: 2,
      ease: 'power1.out',
      onUpdate: function () {
        const current = Math.floor(this.targets()[0].val);
        el.innerText = `${current.toLocaleString('en-IN')}${stat.suffix}`;
      },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });

    return () => tween.kill();
  }, [stat]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}
        className={`rounded-2xl px-5 py-4 md:px-6 md:py-5 shadow-glass-lg border ${
          isDark ? 'bg-brand-green text-white border-white/10' : 'bg-white/90 backdrop-blur-xl text-gray-900 border-white/60'
        }`}
      >
        <p ref={valueRef} className={`text-2xl md:text-3xl font-sora font-extrabold ${isDark ? 'text-white' : 'text-brand-green'}`}>
          0
        </p>
        <p className={`text-xs md:text-sm mt-1 font-semibold ${isDark ? 'text-white/80' : 'text-gray-500'}`}>
          {stat.label}
        </p>
      </motion.div>
    </motion.div>
  );
};

const RouteMapStats = () => {
  return (
    <section className="relative section-space px-4 md:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Our Network"
          title="Growing Rapidly, Thanks to You"
          subtitle="45,000+ shipments and 250+ happy clients, moving across every branch in our network."
        />

        <div className="relative rounded-3xl border border-white/60 bg-white/40 backdrop-blur-xl shadow-glass overflow-hidden">
          <img
            src="/india.webp"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-[0.07] grayscale"
          />

          <svg viewBox="0 0 800 300" className="w-full h-[260px] md:h-[320px]" preserveAspectRatio="none">
            <motion.path
              d="M100,220 C 250,80 350,260 420,150 C 490,40 600,180 700,90"
              fill="none"
              stroke={GREEN}
              strokeWidth="2.5"
              strokeDasharray="8 8"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.5 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              style={{ vectorEffect: 'non-scaling-stroke' }}
            />
            <motion.circle
              cx="100" cy="220" r="6" fill={GREEN}
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            />
            <motion.circle
              cx="700" cy="90" r="6" fill="#f5a623"
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 2 }}
            />
          </svg>

          <div className="absolute left-[6%] bottom-[12%] flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-glass text-xs font-bold text-brand-green">
            <Package className="w-3.5 h-3.5" /> Chennai HQ
          </div>
          <div className="absolute right-[6%] top-[16%] flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-glass text-xs font-bold text-brand-amberDark">
            <Plane className="w-3.5 h-3.5" /> Global Reach
          </div>

          <div className="relative z-10 -mt-10 md:-mt-14 pb-8 md:pb-10 px-4 md:px-10 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            {cardStats.map((stat, i) => (
              <StatCard key={i} stat={stat} delay={i * 0.15} className={i === 1 ? 'sm:-translate-y-4' : ''} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RouteMapStats;
