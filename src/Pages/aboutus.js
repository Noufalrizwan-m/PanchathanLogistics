import React from 'react';
import PageHero from '../Components/pagehero';
import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Handshake, Zap, ShieldCheck, MapPin } from 'lucide-react';

const About = () => {
    // GSAP Content Animation
    useLayoutEffect(() => {
        gsap.utils.toArray(".about-animate").forEach((el, i) => {
            gsap.fromTo(el,
                { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        });

        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, []);

    const values = [
        { icon: Handshake, title: "Integrity", desc: "Our word is our bond. We operate with complete transparency, delivering on every promise." },
        { icon: Zap, title: "Innovation", desc: "Leveraging technology to redefine supply chain efficiency and provide smarter logistics solutions." },
        { icon: ShieldCheck, title: "Accountability", desc: "We take full responsibility for your cargo, ensuring safety and compliance at every touchpoint." },
        { icon: MapPin, title: "Global Reach", desc: "Connecting local Indian businesses to global opportunities seamlessly and reliably." },
    ];

    return (
        <div className="bg-white">
            <PageHero
                title="Our Journey of Trust"
                subtitle="From our roots in India to becoming a global logistics powerhouse, our commitment remains unwavering."
                breadcrumb="Home / About Us"
            />

            {/* Story Section */}
            <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Text Content */}
                    <div className="about-animate">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-snug sm:leading-tight">
                            The Indian Heart of Global Logistics
                        </h2>
                        <p className="text-base sm:text-lg md:text-lg text-gray-700 mb-4 sm:mb-6">
                            Established in 2019 in Chennai, Panchathan Logistics Pvt. Ltd. was founded on the Indian principle that the customer is God and 
                            service is our highest duty. From humble beginnings, we’ve grown step by step, grounded in reliability, trust, and a personal touch 
                            often missing in large logistics corporations. 
                            Our mission is simple: to move your business forward with precision, care, and integrity.
                        </p>
                        <p className="text-base sm:text-lg md:text-lg text-gray-700 border-l-4 border-amber-500 pl-4 italic">
                            Our mission isn’t to be the largest in logistics, but to be the most trusted partner behind every successful delivery. <br />
                            - A. Mohammed Jaffar, CEO
                        </p>
                    </div>

                    {/* Image Content */}
                    <div className="about-animate bg-[#f0f9ff] p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl relative overflow-hidden h-64 sm:h-80 md:h-[400px]">
                        <img
                            src="ofc.png"
                            alt="Indian Office/Warehouse"
                            className="w-full h-full object-cover rounded-lg opacity-80"
                        />
                    </div>

                </div>
            </section>


            {/* Core Values Section */}
            <section className="py-24 px-6 md:px-12 bg-[#175d29]">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="about-animate text-4xl font-bold text-white mb-16">Our Guiding Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {values.map((value, i) => (
                            <div key={i} className="about-animate p-6 bg-white rounded-xl shadow-xl transform transition-transform duration-500 hover:scale-[1.05]">
                                <value.icon className="w-10 h-10 text-amber-500 mb-4 mx-auto" />
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-sm text-gray-700">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;