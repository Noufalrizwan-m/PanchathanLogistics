import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DeliveryProcess from '../Components/DeliveryProcess';
import { motion } from 'framer-motion';
import {
  Plane, Truck, Factory, Shield, BarChart2, PackageSearch,
  Search, X, FileText, FileSpreadsheet, Download, ArrowRight, ArrowDown, FolderSearch,
  ClipboardList, FileCheck2, PackageCheck, CheckCircle2, User, ShieldCheck,
} from 'lucide-react';
import { staggerContainer, staggerItem } from '../lib/motion';
import SEO from '../Components/SEO';
import customForms from '../lib/customForms.mjs';

// Filenames verified against public/doc/


const getFormMeta = (file) => {
  const ext = file.split('.').pop().toLowerCase();
  if (ext === 'docx' || ext === 'doc') {
    return { Icon: FileText, tint: 'bg-sky-500/10 text-sky-700 group-hover:bg-sky-600 group-hover:text-white' };
  }
  return { Icon: FileSpreadsheet, tint: 'bg-brand-green text-white' };
};

const processSteps = [
  { icon: ClipboardList, title: "Request a Quote", desc: "Tell us what you're shipping, we scope the right mode, route, and cost." },
  { icon: FileCheck2, title: "Documentation", desc: "We prepare and verify customs paperwork before anything moves." },
  { icon: PackageCheck, title: "Pickup & Handling", desc: "Cargo is collected, scanned, and staged at the nearest branch." },
  { icon: Truck, title: "In Transit", desc: "Shipment tracking across air and road, with every leg logged." },
  { icon: CheckCircle2, title: "Delivered & Signed", desc: "Proof of delivery at the doorstep, accountability to the last mile." },
];

// Bento grid: "large" spans 8/12 cols, "tall" spans 4/12 (paired with large),
// "standard" spans 4/12 (three across), "featured" spans the full 12 cols.
const bentoServices = [
  {
    id: 'asset-management',
    size: 'large',
    icon: PackageSearch,
    name: "Asset Management & Tracking",
    desc: "IT asset management and logistics in Chennai for laptops, desktops, servers and office equipment, with shipment tracking and coordinated business deliveries.",
    bullets: ["Condition & custody monitoring", "Laptop, computer & IT equipment logistics"],
  },
  {
    size: 'standard',
    icon: Plane,
    id: "air-freight",
    name: "Air Freight Forwarding",
    desc: "Express, priority, and consolidated air cargo to India's major trade lanes managed end-to-end for speed and schedule integrity.",
    bullets: ["Priority and consolidated cargo", "Charter & consolidation services"],
  },
  {
    size: 'tall',
    icon: Shield,
    id: "customs-clearance",
    name: "Customs & Compliance",
    desc: "In-house clearance covering documentation, duty calculation, and GST/EXIM compliance, with coordinated support.",
    bullets: ["Import/export documentation", "Clearance coordination"],
    formsLink: true,
  },
  {
    size: 'standard',
    icon: Factory,
    id: "warehousing",
    name: "Warehousing & Supply Chain",
    desc: "Scalable storage, pick-and-pack, and distribution fully integrated with freight and transport operations.",
    bullets: ["Multi-user & dedicated warehousing", "Last-mile optimization"],
  },
  
  {
    size: 'standard',
    icon: Truck,
    id: "surface-transport",
    name: "Surface Transport",
    desc: "Local, metro, and interstate transport managed for consistent service levels and full delivery visibility across every state in India.",
  },
];

const pillars = [
  { icon: User, title: "One Point of Contact", desc: "No more chasing multiple vendors. One team manages your entire shipment from origin to destination." },
  { icon: BarChart2, title: "Total Visibility", desc: "Shipment updates and coordinated documentation help you follow your cargo’s progress." },
  { icon: ShieldCheck, title: "Compliance Excellence", desc: "In-house customs and audit-ready programs keep IT, banking, and export shipments moving within every regulatory requirement." },
];

const Services = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredForms = useMemo(() => {
    const q = search.trim().toUpperCase();
    if (!q) return customForms;
    return customForms.filter((form) => form.name.includes(q));
  }, [search]);

  const scrollToForms = () => {
    const el = document.getElementById('customs-forms');
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  // Mandatory scroll-snap fights a page this long — it traps scroll
  // position on the last snap section and blocks reaching the footer.
  // Same workaround Home uses: opt this page out entirely.
  useEffect(() => {
    document.documentElement.classList.add('no-snap');
    return () => document.documentElement.classList.remove('no-snap');
  }, []);

  return (
    <div>
      <SEO path="/services" />
      {/* HERO */}
      <section className="relative bg-brand-green text-white py-12 md:py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{ backgroundImage: "url('/homebg-420.webp')", backgroundSize: '420px', backgroundRepeat: 'repeat', backgroundAttachment: 'scroll' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-4xl mx-auto px-6 md:px-12"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-5 inline-block">
            Home / Services
          </span>
          <h1 className="font-sora text-4xl md:text-6xl font-extrabold mb-6 leading-[1.05] tracking-tight">
            Our Logistics Capabilities
          </h1>
          <p className="text-white/75 text-base md:text-lg max-w-2xl mb-8">
            Full cycle supply chain solutions across every mode from asset tracking to customs
            clearance, we bring experience across every freight discipline.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#capabilities"
              className="inline-flex items-center gap-2 bg-brand-amber text-gray-900 font-bold text-sm px-6 py-3 rounded hover:bg-brand-amberDark hover:text-white transition-colors"
            >
              View All Services
            </a>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-2 border border-white/50 text-white font-bold text-sm px-6 py-3 rounded hover:bg-white/10 transition-colors"
            >
              Talk to an Expert
            </button>
          </div>
        </motion.div>
      </section>

      {/* CAPABILITIES BENTO GRID */}
      <section id="capabilities" className="section-space px-6 md:px-12 max-w-7xl mx-auto scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-8 md:mb-10"
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gray-500 mb-2">Our Expertise</p>
          <h2 className="text-2xl md:text-4xl font-sora font-bold text-brand-green mb-3">
            Everything your freight needs. Under one group.
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            From air freight and road transport to customs clearance and final delivery, we bring experience
            across every freight discipline.
          </p>
        </motion.div>

        <motion.div {...staggerContainer(0.1)} className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {bentoServices.map((service, i) => {
            if (service.size === 'featured') {
              return (
                <div
                  key={i}
                  className="md:col-span-12 relative overflow-hidden bg-brand-green text-white rounded-lg p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  {/* Plain (untransformed) box carries the texture so it
                      stays anchored to the viewport via background-attachment:
                      fixed — a transform on an animated ancestor breaks that. */}
                  <div
                    className="absolute inset-0 opacity-[0.08] pointer-events-none"
                    style={{ backgroundImage: "url('/homebg-420.webp')", backgroundSize: '420px', backgroundRepeat: 'repeat', backgroundAttachment: 'scroll' }}
                  />
                  <motion.div variants={staggerItem} className="relative md:max-w-2xl">
                    <service.icon className="w-9 h-9 text-brand-amber mb-3" />
                    <h3 className="text-xl font-sora font-bold text-white mb-2">{service.name}</h3>
                    <p className="text-white/75 text-sm md:text-base leading-relaxed">{service.desc}</p>
                  </motion.div>
                </div>
              );
            }

            const isLarge = service.size === 'large';
            const isTall = service.size === 'tall';

            return (
              <motion.div
                key={i}
                id={service.id}
                variants={staggerItem}
                className={`relative scroll-mt-28 overflow-hidden border border-gray-200 rounded-lg p-6 md:p-8 flex flex-col justify-between hover:border-brand-green transition-colors ${
                  isLarge ? 'md:col-span-8 bg-white' : isTall ? 'md:col-span-4 bg-gray-50' : 'md:col-span-4 bg-white'
                }`}
              >
                {isLarge && (
                  <service.icon className="absolute -top-2 -right-2 w-40 h-40 text-brand-green/[0.06] pointer-events-none" />
                )}
                <div className="relative">
                  <service.icon className="w-8 h-8 text-brand-green mb-4" />
                  <h3 className="text-lg md:text-xl font-sora font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-base text-gray-600 leading-relaxed mb-4">{service.desc}</p>
                  {service.bullets && (
                    <ul className="space-y-1.5 mb-2">
                      {service.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-amberDark flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {service.formsLink && (
                  <button
                    type="button"
                    onClick={scrollToForms}
                    className="group/link relative mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-green hover:text-brand-amberDark transition-colors self-start"
                  >
                    Browse customs forms
                    <ArrowDown className="w-4 h-4 group-hover/link:translate-y-0.5 transition-transform" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* WHY PARTNER WITH US */}
      <section className="section-space px-6 md:px-12 max-w-7xl mx-auto border-t border-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 md:mb-10"
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-gray-500 mb-2">Why Partner With Us</p>
          <h2 className="text-2xl md:text-4xl font-sora font-bold text-brand-green">Logistics that works as hard as you do.</h2>
        </motion.div>
        <motion.div {...staggerContainer(0.12)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <motion.div key={i} variants={staggerItem} className="bg-white p-8 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-gray-50 rounded-md flex items-center justify-center mb-4 text-brand-green">
                <p.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-sora font-bold text-gray-900 mb-2">{p.title}</h3>
              <p className="text-base text-gray-600 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="customs-forms" className="section-space px-6 md:px-12 max-w-7xl mx-auto scroll-mt-24 border-t border-gray-200">
        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10"
          >
            <div>
              <span className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-brand-amberDark mb-3">
                <FolderSearch className="w-4 h-4" />
                Clearance Assistance
              </span>
              <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-brand-green leading-tight">
                Download Customs Forms
              </h2>
              <p className="mt-3 text-base text-gray-600 max-w-2xl">
                Download customs and export documentation templates, including commercial invoice, packing list, KYC, authorisation letter and shipping declaration forms. Contact our Chennai team to confirm which forms apply and the current requirements before use.
              </p>
            </div>

            <div className="relative w-full lg:w-72 flex-shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="forms-search"
                aria-label="Search customs forms"
                placeholder="Search forms, e.g. KYC"
                className="w-full pl-11 pr-10 py-3 rounded border border-gray-300 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>

          <p aria-live="polite" className="text-sm font-semibold text-gray-600 mb-4">
            {filteredForms.length} of {customForms.length} forms
          </p>

          {filteredForms.length > 0 ? (
            <motion.div key={search} {...staggerContainer(0.02)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredForms.map((form) => {
                const { Icon, tint } = getFormMeta(form.file);
                return (
                  <motion.a
                    key={form.file}
                    variants={staggerItem}
                    href={`/doc/${form.file}`}
                    download
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 350, damping: 24 }}
                    className="group flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3.5 hover:border-brand-green transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${tint}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-gray-800 leading-snug">
                      {form.name}<span className="block text-xs font-normal text-gray-600 mt-1">{form.file.endsWith("docx") ? "Word document" : "Excel spreadsheet"}</span>
                    </span>
                    <Download className="w-4 h-4 text-gray-300 group-hover:text-brand-amberDark flex-shrink-0 transition-colors" />
                  </motion.a>
                );
              })}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center text-center py-14">
              <div className="w-14 h-14 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center mb-4">
                <FolderSearch className="w-7 h-7" />
              </div>
              <p className="font-bold text-gray-700">No forms match "{search}"</p>
              <p className="text-sm text-gray-500 mt-1">Try a different keyword, or clear the search.</p>
            </div>
          )}
        </div>

        <div className="mt-16 md:mt-24 -mx-6 md:-mx-12">
          <DeliveryProcess
            steps={processSteps}
            eyebrow="Our Process"
            title="How It Works"
            subtitle="From first request to signed delivery, with a clear, accountable path every time."
          />
        </div>

        <div className="relative overflow-hidden rounded-lg bg-brand-green px-8 py-12 md:px-16 md:py-14 text-center mt-10 md:mt-14">
          {/* Plain (untransformed) box carries the texture so it stays
              anchored to the viewport via background-attachment: fixed —
              a transform on an animated ancestor would break that and
              cause a visible seam against the Footer's own texture. */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{ backgroundImage: "url('/homebg-420.webp')", backgroundSize: '420px', backgroundRepeat: 'repeat', backgroundAttachment: 'scroll' }}
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <h3 className="font-sora text-2xl md:text-3xl xl:text-4xl font-extrabold text-white mb-3">
              Ready to Move Smarter?
            </h3>
            <p className="text-white/75 max-w-xl mx-auto mb-8">
              We're here to help you grow without hassle. No call centres, no runaround. Just experienced
              people ready to help.
            </p>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-2 bg-brand-amber text-gray-900 font-bold text-sm px-8 py-4 rounded hover:bg-white transition-colors"
            >
              Get a Custom Quote
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
