import React, { useLayoutEffect } from 'react';
import PageHero from '../Components/pagehero';
import GlassCard from '../Components/ui/GlassCard';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Handshake, Zap, ShieldCheck, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
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
    { icon: Handshake, title: "Integrity", desc: "Complete transparency — we deliver on every promise." },
    { icon: Zap, title: "Innovation", desc: "Technology-driven supply chain efficiency." },
    { icon: ShieldCheck, title: "Accountability", desc: "Full responsibility for your cargo, at every touchpoint." },
    { icon: MapPin, title: "Global Reach", desc: "Connecting Indian businesses to the world, reliably." },
  ];

  return (
    <div>
      <PageHero
        title="Our Journey of Trust"
        subtitle="From our roots in India to a global logistics partner — our commitment hasn't changed."
        breadcrumb="Home / About Us"
      />

      <section className="snap-section py-16 md:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="about-animate">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sora font-extrabold text-brand-green mb-6 leading-snug sm:leading-tight">
              The Indian Heart of Global Logistics
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-6">
              Founded in 2019 in Chennai on one principle: the customer is God, and service is our highest duty.
            </p>
            <p className="text-base sm:text-lg text-gray-700 border-l-4 border-brand-amber pl-4 italic">
              "Our mission isn't to be the largest in logistics, but the most trusted partner behind every
              successful delivery." <br />— A. Mohammed Jaffar, CEO
            </p>
          </div>

          <GlassCard hover={false} className="about-animate p-4 sm:p-6 md:p-8 overflow-hidden h-64 sm:h-80 md:h-[400px]">
            <img
              src="/ofc.png"
              alt="Panchathan Logistics office and warehouse"
              className="w-full h-full object-cover rounded-2xl"
            />
          </GlassCard>
        </div>
      </section>

      <section className="snap-section relative py-20 md:py-28 px-6 md:px-12 bg-brand-green overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.7) 0%, rgba(245,166,35,0) 70%)' }}
        />
        <div className="relative max-w-7xl mx-auto text-center">
          <h2 className="about-animate font-sora text-3xl md:text-4xl font-bold text-white mb-14">Our Guiding Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <GlassCard key={i} className="about-animate p-6">
                <value.icon className="w-9 h-9 text-brand-amber mb-4 mx-auto" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
