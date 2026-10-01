import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, Target, CheckCircle2, ArrowRight } from 'lucide-react';
import { staggerContainer, staggerItem } from '../lib/motion';
import SEO from '../Components/SEO';

const milestones = [
  {
    year: '2019',
    title: 'Foundation',
    desc: "Started as a specialized freight forwarder in Chennai, challenging fragmented logistics with one unified, accountable model.",
  },
  {
    year: '2021',
    title: 'Regional Expansion',
    desc: "Rapidly scaled to dedicated branches across 7 states, each with its own warehousing and last-mile team.",
  },
  {
    year: 'Today',
    title: 'Full Asset Management',
    desc: "Solidified audit-ready programs for IT and banking sector clients, and opened international export operations.",
  },
];

const pillars = [
  { icon: Shield, title: 'Accountability', desc: "We don't deal in excuses. By controlling the entire network, we take full responsibility for every asset." },
  { icon: Eye, title: 'Visibility', desc: "Radical transparency. Real-time tracking means you see exactly what we see, always." },
  { icon: Target, title: 'Precision', desc: "Engineered execution. We optimize every route and handoff for maximum reliability." },
];

const checklist = ['Single Point of Accountability', 'Audit-Ready Documentation', 'Real-Time Asset Visibility'];

const branches = ['Chennai', 'Kochi', 'Bangalore', 'Hyderabad', 'Mumbai', 'Kolkata', 'Delhi'];

const About = () => {
  const navigate = useNavigate();

  // Mandatory scroll-snap traps scroll on a page this long and blocks
  // reaching the footer — same workaround used on Home and Services.
  useEffect(() => {
    document.documentElement.classList.add('no-snap');
    return () => document.documentElement.classList.remove('no-snap');
  }, []);

  const scrollToPhilosophy = () => {
    document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      <SEO
        title="About Us — Chennai-Based Logistics Company Serving India"
        description="Panchathan Logistics started as a specialized freight forwarder in Chennai, Tamil Nadu, and has grown into a nationwide courier and cargo network with branches in Kochi, Bangalore, Hyderabad, Mumbai, Kolkata and Delhi."
        keywords="Panchathan Logistics Chennai, logistics company history Tamil Nadu, freight forwarder India, about Panchathan Logistics"
        path="/about"
      />
      {/* HERO */}
      <section className="relative bg-brand-green text-white overflow-hidden pt-28 md:pt-32 pb-16 md:pb-20">
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{ backgroundImage: "url('/homebg.png')", backgroundSize: '420px', backgroundRepeat: 'repeat', backgroundAttachment: 'fixed' }}
        />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-5 inline-block">
              Home / About Us
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sora font-extrabold text-white mb-6 leading-[1.05] tracking-tight">
              Pioneering Full Asset Management Across India
            </h1>
            <p className="text-lg text-white/75 mb-8 max-w-xl leading-relaxed">
              Built on absolute precision and accountability. From IT and banking sector assets to
              international export, we own the journey — eliminating friction across the modern supply chain.
            </p>
            <button
              type="button"
              onClick={scrollToPhilosophy}
              className="inline-flex items-center gap-2 bg-brand-amber text-gray-900 font-bold text-sm px-6 py-3 rounded-md hover:bg-white transition-colors"
            >
              Our Approach
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[320px] sm:h-[400px] lg:h-[480px] w-full rounded-lg overflow-hidden border border-white/20 shadow-sm"
          >
            <img
              src="/ofc.png"
              alt="Panchathan Logistics office and warehouse"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/15 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* HERITAGE — sits directly on the animated shader background */}
      <section className="relative py-16 md:py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-14 md:mb-16"
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gray-400 mb-2">Heritage</p>
            <h2 className="text-2xl md:text-4xl font-sora font-bold text-brand-green">7+ Years of Operational Excellence</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={`w-2.5 h-2.5 rounded-full mb-4 ${i === 0 ? 'bg-brand-amber' : 'bg-brand-green'}`} />
                <p className="text-xs font-bold uppercase tracking-widest text-brand-amberDark mb-1">{m.year}</p>
                <h3 className="text-lg md:text-xl font-sora font-bold text-gray-900 mb-2">{m.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section id="philosophy" className="relative bg-white py-16 md:py-24 border-b border-gray-200 scroll-mt-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.1] pointer-events-none"
          style={{ backgroundImage: "url('/homebg.png')", backgroundSize: '420px', backgroundRepeat: 'repeat', backgroundAttachment: 'fixed', filter: 'invert(1)' }}
        />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1 relative h-[320px] md:h-[440px] rounded-lg border border-gray-200 overflow-hidden bg-brand-green"
          >
            <div
              className="absolute inset-0 opacity-[0.08] pointer-events-none"
              style={{ backgroundImage: "url('/homebg.png')", backgroundSize: '420px', backgroundRepeat: 'repeat' }}
            />
            <img
              src="/truck1.png"
              alt="Panchathan Logistics cargo truck"
              className="relative w-full h-full object-contain p-6"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2"
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-amberDark mb-2">Philosophy</p>
            <h2 className="text-2xl md:text-4xl font-sora font-bold text-brand-green mb-6">The Full Asset Management Advantage</h2>
            <p className="text-base md:text-lg text-gray-700 mb-5 leading-relaxed">
              Fragmentation breeds failure. Traditional logistics relies on a web of third parties — leading
              to miscommunication, delays, and no one accountable when it matters most.
            </p>
            <p className="text-base text-gray-600 mb-8 leading-relaxed">
              At Panchathan, we own the journey. From the moment your asset leaves the loading dock to its
              final destination, it stays within our controlled, tracked network — one point of contact,
              zero finger-pointing.
            </p>
            <ul className="space-y-3">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-900 font-semibold text-sm md:text-base">
                  <CheckCircle2 className="w-5 h-5 text-brand-amberDark flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* OPERATIONAL PILLARS */}
      <section className=" py-16 md:py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-2xl md:text-4xl font-sora font-bold text-brand-green">Operational Pillars</h2>
          </motion.div>
          <motion.div {...staggerContainer(0.12)} className="grid md:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="bg-white p-8 rounded-lg border border-gray-200 hover:border-brand-green transition-colors"
              >
                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-md mb-6 text-brand-green">
                  <p.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-sora font-bold text-gray-900 mb-3">{p.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="relative bg-brand-green overflow-hidden py-16 md:py-24">
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{ backgroundImage: "url('/homebg.png')", backgroundSize: '420px', backgroundRepeat: 'repeat', backgroundAttachment: 'fixed' }}
        />
        <div className="relative max-w-5xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 md:mb-12 border-b border-white/20 pb-4"
          >
            <h2 className="text-2xl md:text-4xl font-sora font-bold text-white">Leadership</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8"
          >
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-lg border border-white/20 bg-white flex items-center justify-center flex-shrink-0">
              <span className="text-4xl font-sora font-extrabold text-brand-green">AJ</span>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-sora font-bold text-white">A. Mohammed Jaffar</h3>
              <p className="text-sm text-brand-amber font-bold uppercase tracking-wide mb-3">
                Founder &amp; Chief Executive Officer
              </p>
              <p className="text-white/75 text-sm md:text-base max-w-xl leading-relaxed">
                "Our mission isn't to be the largest in logistics, but the most trusted partner behind every
                successful delivery."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NATIONWIDE REACH / CTA */}
      <section className="relative  py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{ backgroundImage: "url('/homebg.png')", backgroundSize: '420px', backgroundRepeat: 'repeat', backgroundAttachment: 'fixed' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto px-6 md:px-12 flex flex-col items-center text-center"
        >
          <h2 className="text-2xl md:text-4xl font-sora font-bold text-brand-green mb-5">Nationwide Reach, Local Precision</h2>
          <p className="text-brand-green max-w-2xl mb-10 text-base md:text-lg leading-relaxed">
            Operating dedicated branches across seven states from South Indian ports to the industrial
            North alongside growing international export operations. We position our teams where you
            need them most.
          </p>
          <div className="flex flex-wrap  justify-center gap-3 mb-10">
            {branches.map((city) => (
              <span
                key={city}
                className="px-4 py-2 border border-brand-green rounded-md text-sm font-semibold text-brand-green bg-white/5"
              >
                {city}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-2 bg-brand-amber text-gray-900 font-bold text-sm px-8 py-4 rounded-md hover:bg-white transition-colors"
          >
            Partner With Us
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
