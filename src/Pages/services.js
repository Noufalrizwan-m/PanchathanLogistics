import React, { useState, useLayoutEffect } from 'react';
import PageHero from '../Components/pagehero';
import { motion } from 'framer-motion';
import { Plane, Ship, Truck, Factory, Shield, BarChart2, Plus, Minus } from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

// Register ScrollTrigger for GSAP animations
gsap.registerPlugin(ScrollTrigger);

// --- Custom Forms Data ---
const customForms = [
    { name: "ANNEXURE C1 FOR EOU", file: "Annexure-C1-for-EOU.xls" },
    { name: "ANNEXURE D FOR DEPB", file: "Annexure-D-for-DEPB.xls" },
    { name: "ANNEXURE I FOR DRAWBACK", file: "Annexure-I-for-Drawback.xls" },
    { name: "ANNEXURE II FOR DRAWBACK", file: "Annexure-II-for-DRAWback.xls" },
    { name: "APPENDIX II FOR DEEC", file: "Appendix-II-for-DEEC.xls" },
    { name: "APPENDIX III FOR DRAWBACK", file: "Appendix-III-for-DRAWback.xls" },
    { name: "APPENDIX IV FOR DRAWBACK", file: "Appendix-IV-for-DRAWback.xls" },
    { name: "AUTHORISATION LETTER", file: "Authorisation-Letter.docs" },
    { name: "COMMERCIAL INVOICE", file: "Commercial-Invoice.xls" },
    { name: "GR WAIVER FORM (FOR FREE TRADE SAMPLE)", file: "GR-Waiver-Form-(for-Free-Trade-Sample).xls" },
    { name: "GR WAIVER FORM (FOR REPAIR & RETURN)", file: "GR-Waiver-Form-(for-Repair-&-Return).xls" },
    { name: "KYC FORMAT", file: "KYC-Format.xls" },
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

// --- Toggle Button Component (Reusable) ---
const ToggleButton = ({ isExpanded, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center justify-center mt-6 py-2 px-4 rounded-full text-white font-semibold bg-amber-500 hover:bg-amber-600 transition-colors duration-300 shadow-md"
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
        icon: Plane,
        name: "Air Freight Forwarding",
        subtitle: "Global Speed, Zero Compromise.",
        details: [
            "Express Air Cargo (Time-Critical)",
            "Consolidation Services (Cost-Efficient)",
            "Charter Services (Volume/Special Cargo)",
            "Perishable & Hazardous Goods Handling (IATA Certified)",
        ],
        description: "From India to the world's major hubs, we offer reliable air freight solutions optimized for speed and security. Our network ensures swift customs clearance and timely delivery, crucial for high-value and time-sensitive cargo."
    },
     {
        icon: Shield,
        name: "Customs & Compliance",
        subtitle: "Expert Clearance, Minimized Risk.",
        details: [
            "Import/Export Documentation & Filing",
            "Duty Calculation & Refund Management",
            "Regulatory Consulting (GST/EXIM Policy)",
            "Trusted Partner Status (AEO/Accreditation)",
        ],
        description: "Navigate complex Indian customs regulations effortlessly. Our team ensures 100% compliance, accelerating the clearance process and mitigating potential penalties or delays.",
        
        longContentJSX: (
            <>
                <div className="mt-6 pt-4 border-t border-gray-300">
                    <h4 className="text-xl font-bold text-[#175d29] mb-3">Clearance Assistance & Custom Forms</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        At Panchathan Logistics, we specialize in providing seamless **Customs House Agent (CHA)** services. Our experienced team handles all regulatory procedures and documentation, allowing you to focus on your core business.
                        Our CHA services include end-to-end customs clearance for imports and exports, accurate documentation, real-time tracking, and expert support in handling duty assessments.
                    </p>
                    
                    <h5 className="text-lg font-bold text-gray-800 mb-3 mt-4">Essential Custom Forms (Downloads)</h5>
                    
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {customForms.map((form, i) => (
                            <li 
                                key={i} 
                                className="bg-gray-200 p-3 rounded-lg font-medium text-center text-sm transition-colors duration-300 hover:bg-amber-500 hover:text-white"
                            >
                               <a 
                                    href={`doc/${form.file}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="block w-full h-full leading-snug"
                                >
                                    {form.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        )
    },
    {
        icon: Ship,
        name: "Ocean Freight Solutions",
        subtitle: "Connecting Continents Seamlessly.",
        details: [
            "Full Container Load (FCL)",
            "Less than Container Load (LCL) Consolidation",
            "Break Bulk & Project Cargo",
            "Cross-Trade & Multi-Modal Transport",
        ],
        description: "Maximize your cost efficiency with our flexible sea freight options. We manage the complexity of port operations, providing end-to-end visibility and documentation for smooth international trade."
    },
    {
        icon: Truck,
        name: "Surface Transport & ODC",
        subtitle: "Reliable Road & Rail Network Across India.",
        details: [
            "Full Truck Load (FTL) & Part Truck Load (PTL)",
            "Dedicated Cold Chain Logistics",
            "Rail Cargo Services (Cost-Effective)",
            "Over-Dimensional Cargo (ODC) Handling",
        ],
        description: "Our extensive domestic network ensures safe, timely, and secure delivery across every state in India. We use GPS-enabled vehicles and dedicated support for primary and secondary distribution."
    },
    {
        icon: Factory,
        name: "Warehousing & Supply Chain",
        subtitle: "Optimizing Inventory and Distribution.",
        details: [
            "Multi-User & Dedicated Warehousing",
            "Inventory Management & Fulfillment",
            "Packaging, Kitting, and Labeling",
            "Last-Mile Delivery Optimization",
        ],
        description: "Reduce lead times and inventory costs with our smart warehousing solutions. Located strategically near major industrial hubs, we offer customizable storage and value-added services."
    },
   
    {
        icon: BarChart2,
        name: "Technology & Visibility",
        subtitle: "Data-Driven Logistics.",
        details: [
            "Real-Time Shipment Tracking (IoT)",
            "API Integration with ERP/WMS",
            "Predictive Analytics & Route Optimization",
            "Automated Reporting & Billing",
        ],
        description: "We leverage proprietary technology to give you complete, transparent control over your cargo, from origin to destination. Efficiency and decision-making powered by real data."
    },
];


const Services = () => {
    // State to track which service card (by index) is currently expanded
    const [expandedServiceIndex, setExpandedServiceIndex] = useState(null);

    // Toggle function
    const toggleExpansion = (index) => {
        setExpandedServiceIndex(expandedServiceIndex === index ? null : index);
    };

    // GSAP animation for content reveal
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

        // Cleanup
        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, []);

    return (
        <div className="bg-white">
            <PageHero
                title="Our Global Logistics Services"
                subtitle="Integrated solutions ensuring speed, compliance, and transparency from India to the world."
                breadcrumb="Home / Services"
            />
            
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">The Panchathan Advantage </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        We don't just move cargo, we manage complex supply chains with a commitment to efficiency, integrity, and the latest technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {serviceCategories.map((service, i) => {
                        const isExpanded = expandedServiceIndex === i;
                        const hasLongContent = service.longContentJSX;

                        return (
                            <div key={i} className="service-item bg-[#f0f9ff] p-8 rounded-xl shadow-lg border-t-4 border-[#175d29] hover:shadow-2xl transition-shadow duration-500">
                                <service.icon className="w-10 h-10 text-amber-500 mb-4" />
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h3>
                                <p className="text-lg font-semibold text-[#175d29] mb-4">{service.subtitle}</p>
                                
                                <p className="text-gray-700 leading-relaxed mb-6">{service.description}</p>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    {service.details.map((detail, index) => (
                                        <div key={index} className="flex items-start text-sm font-medium text-gray-800">
                                            <motion.svg 
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 500, damping: 30 }}
                                                className="w-4 h-4 text-amber-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"
                                            >
                                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                            </motion.svg>
                                            {detail}
                                        </div>
                                    ))}
                                </div>
                                
                                {/* --- NEW: CONDITIONAL EXPANDABLE CONTENT --- */}
                                {hasLongContent && (
                                    <div 
                                        className={`transition-all duration-700 overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        {service.longContentJSX}
                                    </div>
                                )}

                                {/* --- NEW: TOGGLE BUTTON --- */}
                                {hasLongContent && (
                                    <ToggleButton 
                                        isExpanded={isExpanded} 
                                        onClick={() => toggleExpansion(i)} 
                                    />
                                )}

                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Services;