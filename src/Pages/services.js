import React, { useState, useLayoutEffect } from 'react';
import ServicesShowcase from '../Components/ServicesShowcase';
import GlassCard from '../Components/ui/GlassCard';
import SectionHeading from '../Components/ui/SectionHeading';
import { motion } from 'framer-motion';
import { Plane, Ship, Truck, Factory, Shield, BarChart2, Plus, Minus, FileDown, PackageSearch } from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

gsap.registerPlugin(ScrollTrigger);

// Filenames verified against public/doc/
const customForms = [
  { name: "ANNEXURE C1 FOR EOU", file: "Annexure-C1-for-EOU.xls" },
  { name: "ANNEXURE D FOR DEPB", file: "Annexure-D-for-DEPB.xls" },
  { name: "ANNEXURE I FOR DRAWBACK", file: "Annexure-I-for-Drawback.xls" },
  { name: "ANNEXURE II FOR DRAWBACK", file: "Annexure-II-for-Drawback.xls" },
  { name: "APPENDIX II FOR DEEC", file: "Appendix-II-for-DEEC.xls" },
  { name: "APPENDIX III FOR DRAWBACK", file: "Appendix-III-for-Drawback.xls" },
  { name: "APPENDIX IV FOR DRAWBACK", file: "Appendix-IV-for-Drawback.xls" },
  { name: "AUTHORISATION LETTER", file: "Authorisation-Letter.docx" },
  { name: "COMMERCIAL INVOICE", file: "Commercial-Invoice.xls" },
  { name: "GR WAIVER FORM (FOR FREE TRADE SAMPLE)", file: "GR-Waiver-Form-(for-Free-Trade-Sample).xls" },
  { name: "GR WAIVER FORM (FOR REPAIR & RETURN)", file: "GR-Waiver-Form-(for-Repair-&-Return).xls" },
  { name: "KYC FORMAT", file: "KYC-FORMAT.xls" },
  { name: "MSDS", file: "MSDS.xls" },
  { name: "MULTIPLE COUNTRY DECLARATION", file: "Multiple-Country-Declaration.xls" },
  { name: "NEGATIVE DECLARATION", file: "Negative-Declaration.xls" },
  { name: "NON DG DECLARATION", file: "Non-DG-Declaration.xls" },
  { name: "PACKING LIST", file: "Packing-List.xls" },
  { name: "QUOTA CHARGE STATEMENT", file: "Quota-Charge-Statement.xls" },
  { name: "SDF FORM", file: "SDF-Form.xls" },
  { name: "SHIPPERS LETTER OF INSTRUCTIONS", file: "Shippers-Letter-of-Instructions.xls" },
  { name: "SINGLE COUNTRY DECLARATION", file: "Single-Country-Declaration.xls" },
  { name: "TSCA CERTIFICATE", file: "TSCA-Certificate.xls" },
];

const ToggleButton = ({ isExpanded, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center mt-6 py-2 px-4 rounded-full text-white font-semibold bg-brand-amber hover:bg-brand-amberDark transition-colors duration-300 shadow-md"
  >
    {isExpanded ? (
      <>
        <Minus className="w-5 h-5 mr-2" />
        Show Less
      </>
    ) : (
      <>
        <Plus className="w-5 h-5 mr-2" />
        Show More
      </>
    )}
  </button>
);

const serviceCategories = [
  {
    icon: PackageSearch,
    name: "Asset Management & Tracking",
    subtitle: "End-to-end visibility, node to node.",
    details: [
      "Real-time location & status tracking",
      "Condition & custody monitoring",
      "Lifecycle reporting & audit trails",
      "Pan-India asset network coverage",
    ],
    description: "Our core capability — complete visibility and lifecycle tracking for client assets as they move through our network, from origin to final custody.",
  },
  {
    icon: Plane,
    name: "Air Freight Forwarding",
    subtitle: "Global speed, zero compromise.",
    details: [
      "Express air cargo",
      "Consolidation services",
      "Charter services",
      "IATA-certified handling",
    ],
    description: "Reliable air freight from India to the world's major hubs, optimized for speed and secure customs clearance.",
  },
  {
    icon: Shield,
    name: "Customs & Compliance",
    subtitle: "Expert clearance, minimized risk.",
    details: [
      "Import/export documentation",
      "Duty calculation & refunds",
      "GST/EXIM regulatory consulting",
      "AEO accreditation status",
    ],
    description: "Navigate Indian customs regulations effortlessly — full compliance, faster clearance, fewer delays.",
    longContentJSX: (
      <>
        <div className="mt-6 pt-5 border-t border-white/30">
          <h4 className="text-lg font-bold text-brand-green mb-2">Clearance Assistance</h4>
          <p className="text-gray-700 leading-relaxed mb-5 text-sm">
            End-to-end Customs House Agent (CHA) services — documentation, real-time tracking, and duty
            assessment support, so you can focus on your business.
          </p>
          <h5 className="text-sm font-bold uppercase tracking-wide text-gray-800 mb-3">Essential Custom Forms</h5>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {customForms.map((form, i) => (
              <li key={i}>
                <a
                  href={`/doc/${form.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/50 backdrop-blur-md border border-white/50 p-3 rounded-xl text-xs font-medium text-gray-800 hover:bg-brand-amber hover:text-white hover:border-brand-amber transition-colors duration-300 leading-snug"
                >
                  <FileDown className="w-4 h-4 flex-shrink-0" />
                  {form.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </>
    ),
  },
  {
    icon: Ship,
    name: "Ocean Freight Solutions",
    subtitle: "Connecting continents seamlessly.",
    details: [
      "Full Container Load (FCL)",
      "LCL consolidation",
      "Break bulk & project cargo",
      "Multi-modal transport",
    ],
    description: "Cost-efficient sea freight with end-to-end visibility, managing the complexity of port operations for you.",
  },
  {
    icon: Truck,
    name: "Surface Transport & ODC",
    subtitle: "Reliable road & rail, across India.",
    details: [
      "FTL & PTL",
      "Dedicated cold chain",
      "Rail cargo services",
      "Over-dimensional cargo",
    ],
    description: "GPS-enabled domestic network for safe, timely delivery across every state in India.",
  },
  {
    icon: Factory,
    name: "Warehousing & Supply Chain",
    subtitle: "Optimizing inventory and distribution.",
    details: [
      "Multi-user & dedicated warehousing",
      "Inventory & fulfillment",
      "Packaging, kitting, labeling",
      "Last-mile optimization",
    ],
    description: "Smart, strategically located warehousing that reduces lead times and inventory costs.",
  },
  {
    icon: BarChart2,
    name: "Technology & Visibility",
    subtitle: "Data-driven logistics.",
    details: [
      "Real-time IoT tracking",
      "ERP/WMS API integration",
      "Predictive route optimization",
      "Automated reporting",
    ],
    description: "Complete, transparent control over your cargo, from origin to destination.",
  },
];

const Services = () => {
  const [expandedServiceIndex, setExpandedServiceIndex] = useState(null);

  const toggleExpansion = (index) => {
    setExpandedServiceIndex(expandedServiceIndex === index ? null : index);
  };

  useLayoutEffect(() => {
    gsap.utils.toArray(".service-item").forEach((item) => {
      gsap.fromTo(item,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div>
      <ServicesShowcase items={serviceCategories} />

      <section className="snap-section py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="What We Do"
          title="The Panchathan Advantage"
          subtitle="Complex supply chains, managed with efficiency, integrity, and modern technology."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {serviceCategories.map((service, i) => {
            const isExpanded = expandedServiceIndex === i;
            const hasLongContent = service.longContentJSX;

            return (
              <GlassCard key={i} hover={false} className="service-item p-6 md:p-8 border-t-4 border-t-brand-green">
                <div className="w-14 h-14 rounded-2xl bg-brand-amber/15 text-brand-amberDark flex items-center justify-center mb-5">
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl md:text-3xl font-sora font-bold text-gray-900 mb-1">{service.name}</h3>
                <p className="text-base font-semibold text-brand-green mb-4">{service.subtitle}</p>

                <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">{service.description}</p>

                <div className="grid grid-cols-2 gap-3">
                  {service.details.map((detail, index) => (
                    <div key={index} className="flex items-start text-sm font-medium text-gray-800">
                      <motion.svg
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + index * 0.08, type: "spring", stiffness: 500, damping: 30 }}
                        className="w-4 h-4 text-brand-amber mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"
                      >
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </motion.svg>
                      {detail}
                    </div>
                  ))}
                </div>

                {hasLongContent && (
                  <div className={`transition-all duration-700 overflow-hidden ${isExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {service.longContentJSX}
                  </div>
                )}

                {hasLongContent && (
                  <ToggleButton isExpanded={isExpanded} onClick={() => toggleExpansion(i)} />
                )}
              </GlassCard>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Services;
