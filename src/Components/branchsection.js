import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Data structure for branches with requested and confirmed data
const branchData = [
    // FIX 1: Kerala data (left side marker)
    {
        name: "KERALA",
        details: "Vijayanand Mishra, New/63/3289, MBA Residency Brother Mayooras Road, Kochi-682016", 
        class: "kerala" // CSS: top: 95%; left: 30%;
    },
    // FIX 2: Confirmed Tamil Nadu data (right side marker, near Chennai)
    {
        name: "TAMIL NADU (CHENNAI)",
        details: "Head Quaters, Plot. No. 65, Annai Therasa Street,\nV.O.C. Nagar, Pammal\nCHENNAI, Tamil Nadu - 600075",
        class: "tamilnadu" // CSS: top: 90%; left: 35%;
    },
    // FIX 3: Karnataka (Bangalore) data (left side marker)
    {
        name: "KARNATAKA (B'LORE)",
        details: "Arvind Bhatiya, No.29, 6th Main, 10th Cross,\nSampangi Ram Nagar, Bangalore - 560027",
        class: "bangalore" // CSS: top: 75%; left: 28%;
    },
    {
        name: "TELANGANA (HYDERABAD)",
        details: "Surya Prakash 1-8-506/B/1, Prakash Nagar,\nBegumpet, Hyderabad - 500016",
        class: "hyderabad"
    },
    {
        name: "MAHARASHTRA (MUMBAI)",
        details: "Rajjak Shaikh, Shop 03A/1B, Shanti Nagar,\nOpp. Marol MIDC Bus Depot,Andheri East, Mumbai - 400093",
        class: "mumbai"
    },
    {
        name: "WEST BENGAL (KOLKATA)",
        details: "Deepanjun, #193A/17 Picnic Garden Road,\nKolkata - 700039",
        class: "kolkata"
    },
    {
        name: "DELHI",
        details: "Vinod, Plot No. A-50, Near Grand Shoba Hotel,\nRoad No. 6, Mahipalpur, New Delhi - 110037",
        class: "delhi"
    },
];

const BranchesSection = () => {
    // GSAP ScrollTrigger for a simple fade-in effect on the branches section itself
    useEffect(() => {
        gsap.utils.toArray(".branch-animate").forEach((el) => {
            gsap.fromTo(
                el,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        });
    }, []);

    return (
        <section className="bg-[#f9f9f9] py-20 xl:py-32 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="branch-animate text-4xl md:text-5xl xl:text-6xl text-center font-extrabold text-gray-900 mb-12 uppercase">
                    Our National Footprint
                </h1>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
                    
                    {/* 🗺️ Map Container (Wider on Desktop) */}
                   <div className="w-full lg:w-3/5 map-container relative p-4 md:p-8 bg-white rounded-xl shadow-2xl branch-animate">
                        <div className="india-map-section relative w-full aspect-[1/1] max-w-lg mx-auto">
                            {/* NOTE: Ensure /india.webp is the correct path to your map image */}
                            <img src="/india.webp" alt="India Map" className="map-image w-full h-full object-contain" /> 
                            
                            {/* Dynamically rendering location markers */}
                            {branchData.map((branch, index) => (
                                <div key={index} className={`location-marker absolute ${branch.class}`}>
                                    {/* Pulse effect for visibility */}
                                    <div className="pulse"></div> 
                                    
                                    {/* Detailed Contact Popup */}
                                    <div className="location-popup absolute left-1/2 transform -translate-x-1/2 mb-2 bg-white text-gray-800 p-3 rounded-md shadow-2xl border border-gray-100 whitespace-pre-wrap opacity-0 pointer-events-none transition-opacity duration-300 z-20">
                                        <h3 className="font-bold text-sm mb-1 text-[#175d29]">{branch.name}</h3>
                                        <p className="text-xs leading-tight text-gray-600">{branch.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 📝 Content Section */}
                     <div className="w-full lg:w-2/5 branch-content flex flex-col justify-center gsap-fade-in-branches">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Seamless Logistics, Coast-to-Coast
              </h2>
              <p className="text-base text-gray-700 leading-relaxed mb-8">
                With strategic hubs in every major commercial corridor, from the bustling South Indian ports to the industrial North, we guarantee fast, reliable, and compliant domestic distribution and global freight handling.
              </p>

              <ul className="branch-list space-y-3 mb-10">
                <li className="flex items-start text-gray-800">
                  <span className="text-green-500 mr-3 text-xl">✅</span>
                  <span>Fast service in key regional hubs (South, West, North, East).</span>
                </li>
                <li className="flex items-start text-gray-800">
                  <span className="text-green-500 mr-3 text-xl">✅</span>
                  <span>Dedicated teams for domestic and international cargo compliance.</span>
                </li>
                <li className="flex items-start text-gray-800">
                  <span className="text-green-500 mr-3 text-xl">✅</span>
                  <span>Proactive, real-time shipment monitoring and tracking.</span>
                </li>
              </ul>

              <a href="/contact" className="contact-button px-8 py-3 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition shadow-md self-start">
                Connect with a Branch
              </a>
            </div>

                </div>
            </div>
        </section>
    );
};

export default BranchesSection;