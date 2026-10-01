import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, Warehouse, Truck, PackageCheck } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';

// Icon badge per delivery-process step — matches the icon treatment used
// for trust pillars and service cards elsewhere on the site.
const StepBadge = ({ Icon }) => (
  <div className="w-full h-full flex items-center justify-center bg-gray-50">
    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-brand-green text-white flex items-center justify-center">
      <Icon className="w-11 h-11 md:w-12 md:h-12" strokeWidth={1.75} />
    </div>
  </div>
);;

// Small walking-person badge that bobs in place; used as the "current
// position" marker on each step's journey track.
const WalkingPerson = () => (
  <motion.div
    animate={{ y: [0, -3, 0], rotate: [0, -4, 4, 0] }}
    transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
    className="w-7 h-7 rounded-full bg-brand-green border-2 border-white shadow-md flex items-center justify-center"
  >
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="12" cy="5" r="2" fill="#fff" stroke="none" />
      <path d="M12 8 v6" />
      <path d="M12 10 l-4 3" />
      <path d="M12 10 l4 3" />
      <path d="M12 14 l-3 6" />
      <path d="M12 14 l3 6" />
    </svg>
  </motion.div>
);

const JourneyTrack = ({ index, total }) => {
  const progress = ((index + 1) / total) * 100;
  return (
    <div className="relative mt-8 mb-2">
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          whileInView={{ width: `${progress}%` }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-brand-green rounded-full"
        />
      </div>
      <motion.div
        initial={{ left: '0%', opacity: 0 }}
        whileInView={{ left: `${progress}%`, opacity: 1 }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -top-2.5"
        style={{ transform: 'translateX(-50%)' }}
      >
        <WalkingPerson />
      </motion.div>
    </div>
  );
};

const defaultSteps = [
  {
    title: 'Booked & Verified',
    desc: 'Every shipment is confirmed and logged by our team the moment it is booked — no surprises down the line.',
    icon: ClipboardCheck,
  },
  {
    title: 'Warehouse Handling',
    desc: 'Cartons are scanned, sorted, and staged at the nearest branch, with condition checked at every touchpoint.',
    icon: Warehouse,
  },
  {
    title: 'On the Road',
    desc: 'Our drivers move your cargo through the network with live status updates at each transit point.',
    icon: Truck,
  },
  {
    title: 'Delivered & Signed',
    desc: 'Handed over at the doorstep with proof of delivery — the same accountability from pickup to last mile.',
    icon: PackageCheck,
  },
];

const DeliveryProcess = ({
  steps = defaultSteps,
  eyebrow = 'Our Process',
  title = 'Your Shipment, Every Step of the Way',
  subtitle = 'From booking to doorstep — the people and process behind every delivery.',
}) => {
  return (
    <section className="relative py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
      </div>

      {steps.map((step, i) => (
        <div
          key={i}
          className="sticky top-20 md:top-24 h-[420px] md:h-[480px] flex items-center justify-center px-4 md:px-6"
          style={{ zIndex: i + 1 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full max-w-5xl bg-white border border-gray-100 rounded-3xl shadow-glass-lg overflow-hidden grid grid-cols-1 md:grid-cols-2"
          >
            <div className="w-full aspect-square md:aspect-auto md:h-full">
              <StepBadge Icon={step.icon} />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-amberDark mb-3">
                Step {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-sora text-2xl md:text-3xl font-extrabold text-brand-green mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">{step.desc}</p>

              <JourneyTrack index={i} total={steps.length} />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                Journey Progress — {String(i + 1).padStart(2, '0')}/{String(steps.length).padStart(2, '0')}
              </p>
            </div>
          </motion.div>
        </div>
      ))}
    </section>
  );
};

export default DeliveryProcess;
