import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, staggerItem } from '../lib/motion';
import GlassButton from './ui/GlassButton';

gsap.registerPlugin(ScrollTrigger);

const branchData = [
  {
    name: 'KERALA',
    details: 'Vijayanand Mishra, New/63/3289, MBA Residency Brother Mayooras Road, Kochi-682016',
    class: 'kerala',
    top: 95,
    left: 30,
  },
  {
    name: 'TAMIL NADU (CHENNAI)',
    details: 'Head Quaters, Plot. No. 65, Annai Therasa Street,\nV.O.C. Nagar, Pammal\nCHENNAI, Tamil Nadu - 600075',
    class: 'tamilnadu',
    top: 90,
    left: 35,
  },
  {
    name: "KARNATAKA (B'LORE)",
    details: 'Arvind Bhatiya, No.29, 6th Main, 10th Cross,\nSampangi Ram Nagar, Bangalore - 560027',
    class: 'bangalore',
    top: 75,
    left: 28,
  },
  {
    name: 'TELANGANA (HYDERABAD)',
    details: 'Surya Prakash 1-8-506/B/1, Prakash Nagar,\nBegumpet, Hyderabad - 500016',
    class: 'hyderabad',
    top: 68,
    left: 40,
  },
  {
    name: 'MAHARASHTRA (MUMBAI)',
    details: 'Rajjak Shaikh, Shop 03A/1B, Shanti Nagar,\nOpp. Marol MIDC Bus Depot,Andheri East, Mumbai - 400093',
    class: 'mumbai',
    top: 50,
    left: 15,
  },
  {
    name: 'WEST BENGAL (KOLKATA)',
    details: 'Deepanjun, #193A/17 Picnic Garden Road,\nKolkata - 700039',
    class: 'kolkata',
    top: 50,
    left: 65,
  },
  {
    name: 'DELHI',
    details: 'Vinod, Plot No. A-50, Near Grand Shoba Hotel,\nRoad No. 6, Mahipalpur, New Delhi - 110037',
    class: 'delhi',
    top: 35,
    left: 35,
  },
];

const checklist = [
  'Fast service in key regional hubs (South, West, North, East).',
  'Dedicated teams for domestic and international cargo compliance.',
  'Proactive, real-time shipment monitoring and tracking.',
];

const LocationMarker = ({ branch }) => {
  const pulseRef = useRef(null);

  useEffect(() => {
    if (!pulseRef.current) return undefined;
    const tween = gsap.to(pulseRef.current, {
      scale: 3.2,
      opacity: 0,
      duration: 1.8,
      repeat: -1,
      ease: 'power1.out',
    });
    return () => tween.kill();
  }, []);

  const isEdgeLeft = branch.class === 'kerala';
  const isEdgeRight = branch.class === 'tamilnadu';

  const popupPosition = isEdgeLeft
    ? 'right-full top-1/2 -translate-y-1/2 mr-3'
    : isEdgeRight
    ? 'left-full top-1/2 -translate-y-1/2 ml-3'
    : 'left-1/2 -translate-x-1/2 bottom-full mb-3';

  return (
    <div
      className="absolute group"
      style={{ top: `${branch.top}%`, left: `${branch.left}%`, transform: 'translate(-50%, -50%)' }}
    >
      <div className="relative w-3.5 h-3.5 cursor-pointer">
        <div ref={pulseRef} className="absolute inset-0 rounded-full bg-brand-amber" />
        <div className="absolute inset-0 rounded-full bg-brand-green border-2 border-white shadow-md" />
      </div>

      <div
        className={`absolute ${popupPosition} opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-20 w-52 md:w-60`}
      >
        <div className="bg-white/85 backdrop-blur-xl border border-white/60 shadow-glass-lg rounded-2xl p-3">
          <h3 className="font-bold text-sm mb-1 text-brand-green">{branch.name}</h3>
          <p className="text-xs leading-snug text-gray-600 whitespace-pre-wrap">{branch.details}</p>
        </div>
      </div>
    </div>
  );
};

const BranchesSection = () => {
  useEffect(() => {
    gsap.utils.toArray('.branch-animate').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      );
    });
  }, []);

  return (
    <section className="relative py-20 bg-white xl:py-28 px-6 md:px-12 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.1] pointer-events-none"
        style={{ backgroundImage: "url('/homebg.png')", backgroundSize: '420px', backgroundRepeat: 'repeat', backgroundAttachment: 'fixed', filter: 'invert(1)' }}
      />
      <div className="relative max-w-7xl mx-auto">
        <motion.h2 {...fadeUp} className="branch-animate font-sora text-3xl md:text-5xl text-center font-extrabold text-brand-green mb-14">
          Our National Footprint
        </motion.h2>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-8 items-stretch">
          <div className="w-full lg:w-3/5 branch-animate  p-4 md:p-8">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <img src="/india.webp" alt="India Map" className="w-full h-full object-contain" />
              {branchData.map((branch, index) => (
                <LocationMarker key={index} branch={branch} />
              ))}
            </div>
          </div>

          <motion.div {...staggerContainer(0.12)} className="w-full lg:w-2/5 flex flex-col justify-center">
            <motion.h3 variants={staggerItem} className="text-2xl md:text-4xl font-sora font-bold text-gray-900 mb-4">
              Seamless Logistics, Coast-to-Coast
            </motion.h3>
            <motion.p variants={staggerItem} className="text-base text-gray-700 leading-relaxed mb-8">
              Strategic hubs across every major commercial corridor — from South Indian ports to the industrial North — for fast, compliant delivery.
            </motion.p>

            <ul className="space-y-3 mb-10">
              {checklist.map((item, i) => (
                <motion.li key={i} variants={staggerItem} className="flex items-start gap-3 text-gray-800">
                  <span className="w-5 h-5 mt-0.5 rounded-full bg-brand-green text-white flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                  <span className="text-sm md:text-base">{item}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div variants={staggerItem} className="self-start">
              <GlassButton to="/contact">Connect with a Branch</GlassButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BranchesSection;
