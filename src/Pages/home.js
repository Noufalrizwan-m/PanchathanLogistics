import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Hash, MapPin, Plane, Truck, Anchor, Package, Factory, Wrench, Shield, UserCheck, Zap, Compass, Radar, Network, Headphones, FileCheck2, PackageSearch, CheckCircle2, XCircle, AlertCircle, Phone, MessageCircle, X, Hand, ArrowRight, Warehouse, Landmark, Globe } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import BranchesSection from '../Components/branchsection';
import GlassCard from '../Components/ui/GlassCard';
import GlassButton from '../Components/ui/GlassButton';
import SectionHeading from '../Components/ui/SectionHeading';
import MarqueeStrip from '../Components/ui/MarqueeStrip';
import SEO from '../Components/SEO';
import { staggerContainer, staggerItem, fadeUp, fadeIn } from '../lib/motion';

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LogisticsBusiness',
  name: 'Panchathan Logistics',
  image: 'https://panchathanlogistics.com/Logo.png',
  url: 'https://panchathanlogistics.com/',
  telephone: '+91-73394-33590',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Plot No. 65, Annai Therasa Street, V.O.C. Nagar, Pammal',
    addressLocality: 'Chennai',
    addressRegion: 'Tamil Nadu',
    postalCode: '600075',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 12.9716, longitude: 80.1256 },
  areaServed: [
    { '@type': 'State', name: 'Tamil Nadu' },
    { '@type': 'Country', name: 'India' },
  ],
  hasMap: 'https://www.google.com/maps/place/Chennai,+Tamil+Nadu',
  sameAs: [],
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Courier Services Chennai' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cargo Services Tamil Nadu' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Air, Sea & Road Freight Forwarding India' } },
  ],
};

const whyChooseUs = [
  { icon: Radar, title: 'Real-Time Tracking', desc: 'Live AWB status from pickup to delivery, no guesswork.' },
  { icon: Network, title: 'Nationwide Network', desc: 'Branches across 7 states, connected to every major hub.' },
  { icon: Headphones, title: 'Dedicated Support', desc: '24/7 assistance for every shipment, every question.' },
  { icon: FileCheck2, title: 'Customs Expertise', desc: 'In-house CHA services for fast, compliant clearance.' },
];

const heroFloatingBadges = [
  { label: 'Pincode Check', icon: MapPin, iconBg: 'bg-sky-500/15 text-sky-700', position: 'top-[24%] left-[6%] lg:left-[12%]' },
  { label: 'Live Tracking', icon: Radar, iconBg: 'bg-lime-600/15 text-lime-700', position: 'top-[18%] right-[6%] lg:right-[12%]' },
  { label: 'Nationwide Network', icon: PackageSearch, iconBg: 'bg-amber-500/15 text-amber-700', position: 'bottom-[22%] left-[8%] lg:left-[16%]' },
  { label: 'Insured Shipments', icon: Shield, iconBg: 'bg-rose-500/15 text-rose-700', position: 'bottom-[18%] right-[8%] lg:right-[16%]' },
];

const partners = [
  'Jasmin Infotech', 'NES', 'Innovative Precision Castings', 'SMFG', 'TTS',
  'Mootek Technologies', 'iTech Service', 'Infinity & Beyond Corporation', 'VES', 'YRM Industries',
];

gsap.registerPlugin(ScrollTrigger, TextPlugin);

function splitText(target) {
  if (target.dataset.split === "true") return;
  target.dataset.split = "true";
  const text = target.innerText;
  target.innerText = "";
  const words = text.split(" ");
  words.forEach(word => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "word-split inline-block whitespace-nowrap overflow-hidden";
    word.split("").forEach(char => {
      const charSpan = document.createElement("span");
      charSpan.className = "char-split inline-block";
      charSpan.textContent = char;
      wordSpan.appendChild(charSpan);
    });
    target.appendChild(wordSpan);
    target.appendChild(document.createTextNode(" "));
  });
}

// Slides up + fades in once it scrolls into view.
const CountUpStat = ({ value, label }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, amount: 0.6 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  >
    <p className="font-sora text-2xl md:text-3xl font-extrabold text-brand-green">{value}</p>
    <p className="text-xs md:text-sm text-gray-500">{label}</p>
  </motion.div>
);

const serviceShortcuts = [
  { title: "Air Freight", icon: Plane, desc: "Global reach for time-critical cargo.", link: "/services" },
  { title: "Custom Forms & Clearance", icon: Anchor, desc: "Downloadable compliance documents.", link: "/services" },
  { title: "Ground Logistics", icon: Truck, desc: "LTL, FTL, and last-mile delivery.", link: "/services" },
];

function Home() {
  const navigate = useNavigate();
  const heroHeadingRef = useRef(null);
  const heroSectionRef = useRef(null);
  const serviceTitleRef = useRef(null);
  const searchBoxRef = useRef(null);
  const searchTokenRef = useRef(0);
  const coreCapSectionRef = useRef(null);
  const coreCapLeftRef = useRef(null);
  const whyChooseSectionRef = useRef(null);

  const [awb, setAwb] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState(null);
  const [awbResult, setAwbResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const greetings = [
    "नमस्ते", "வணக்கம்", "నమస్కారం", "നമസ്കാരം", "ನಮಸ್ಕಾರ", "নমস্কার", "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", "آداب", "राम राम", "जुले"
  ];

  const specializedServices = [
    {
      title: "Asset Management & Tracking",
      icon: PackageSearch,
      desc: "End-to-end visibility and lifecycle tracking for client assets — location, condition, and custody, node to node.",
    },
    {
      title: "IT & Technology Sector Assets",
      icon: Package,
      desc: "Secure, anti-static, climate-controlled handling for servers, laptops, and data center equipment — trusted by IT companies across India.",
    },
    {
      title: "Banking & Financial Institutions",
      icon: Landmark,
      desc: "Chain-of-custody asset logistics for banks and NBFCs — secure transport, tracking, and audit-ready handling of high-value equipment.",
    },
    {
      title: "International Export & Global Trade",
      icon: Globe,
      desc: "Full-cycle export logistics — documentation, customs clearance, and freight forwarding connecting Indian businesses to global markets.",
    },
    {
      title: "Automotive Supply Chain",
      icon: Wrench,
      desc: "Just-In-Time parts delivery, after-market distribution, and assembly kit management.",
    },
    {
      title: "Project & Heavy Cargo",
      icon: Factory,
      desc: "Oversized, complex, and specialized industrial shipments with dedicated planning.",
    },
  ];

  const trustPillars = [
    { icon: Shield, title: "GPS-Verified Fleet", desc: "Every vehicle tracked and driver-vetted before it touches your cargo." },
    { icon: Zap, title: "Seamless Digital Docs", desc: "Paperless operations for speed and customs ease." },
    { icon: UserCheck, title: "Insured Shipments", desc: "Every consignment covered end-to-end, no exceptions." },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroHeadingRef.current) {
        splitText(heroHeadingRef.current);
        const heroChars = heroHeadingRef.current.querySelectorAll(".char-split");
        gsap.from(heroChars, {
          y: "100%",
          opacity: 0,
          stagger: 0.02,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.2,
        });
        // Safety net: guarantees the heading is visible even if the reveal
        // tween above gets interrupted (e.g. by a dev-mode double-effect
        // race) — clears any leftover inline opacity/transform after the
        // animation should be long done.
        gsap.delayedCall(2.5, () => gsap.set(heroChars, { clearProps: "opacity,transform" }));
      }

      if (serviceTitleRef.current) {
        gsap.to(serviceTitleRef.current, {
          x: 100,
          ease: "none",
          scrollTrigger: {
            trigger: serviceTitleRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      gsap.utils.toArray(".scroll-reveal").forEach((el) => {
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
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

    });

    // Disable the site-wide scroll-snap on Home — it fights the pin
    // ScrollTriggers above, which need smooth, uninterrupted scroll.
    document.documentElement.classList.add('no-snap');

    return () => {
      ctx.revert();
      document.documentElement.classList.remove('no-snap');
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % greetings.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [greetings.length]);

  // Load the Elfsight Google Reviews widget script once, site-wide —
  // guard against re-adding it on route changes / re-mounts.
  useEffect(() => {
    if (document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) return;
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // One wheel/swipe from the top of a "snap section" jumps straight to
  // the next section (and one wheel/swipe back up from just past its
  // bottom edge returns to its top), instead of a slow partial scroll.
  // Only active near each section's own boundary — normal scrolling
  // resumes everywhere else. Hero -> Trust Pillars, and Why Choose Us
  // -> Quick Service Access both use this.
  useEffect(() => {
    let locked = false;
    const BACK_ZONE = 80; // how far past a section's bottom "scroll up" still snaps back
    const snapRefs = [heroSectionRef];

    const goToNextSection = (el) => {
      locked = true;
      const nextTop = el.offsetTop + el.offsetHeight;
      window.scrollTo({ top: nextTop, behavior: 'smooth' });
      setTimeout(() => { locked = false; }, 900);
    };

    const goBackToSection = (el) => {
      locked = true;
      window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
      setTimeout(() => { locked = false; }, 900);
    };

    const handleWheel = (e) => {
      if (locked) return;
      for (const ref of snapRefs) {
        const el = ref.current;
        if (!el) continue;
        const bottom = el.offsetTop + el.offsetHeight;
        if (e.deltaY > 0 && window.scrollY >= el.offsetTop - 4 && window.scrollY < bottom - 4) {
          e.preventDefault();
          goToNextSection(el);
          return;
        }
        if (e.deltaY < 0 && window.scrollY >= bottom - 4 && window.scrollY < bottom + BACK_ZONE) {
          e.preventDefault();
          goBackToSection(el);
          return;
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e) => {
      if (locked) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      for (const ref of snapRefs) {
        const el = ref.current;
        if (!el) continue;
        const bottom = el.offsetTop + el.offsetHeight;
        if (deltaY > 30 && window.scrollY >= el.offsetTop - 4 && window.scrollY < bottom - 4) {
          goToNextSection(el);
          return;
        }
        if (deltaY < -30 && window.scrollY >= bottom - 4 && window.scrollY < bottom + BACK_ZONE) {
          goBackToSection(el);
          return;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // AWB & Pincode Search Logic (unchanged business logic)
  const handleAwbSearch = async (trackingAwb) => {
    const token = ++searchTokenRef.current;
    setLoading(true);
    setAwbResult(null);

    try {
      const payload = [trackingAwb];

      const response = await fetch(
        "https://panchathanlogistics.com/billing_php/index.php/multi_tracking_web",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      if (searchTokenRef.current !== token) return;

      if (responseData.status === "failed") {
        setAwbResult({ error: `Tracking data not found for AWB: ${trackingAwb}. Please double-check the number.` });
        return;
      }

      const trackingData = responseData?.data?.[0];

      if (trackingData && trackingData.details && trackingData.details.length > 0) {
        setAwbResult({ success: true, awb: trackingAwb });
        navigate(`/tracking?awb=${encodeURIComponent(trackingAwb)}`);
      } else {
        setAwbResult({
          error: "Tracking data not found or is invalid. Please check the AWB number.",
        });
      }
    } catch (error) {
      console.error("AWB fetch error:", error);
      if (searchTokenRef.current !== token) return;
      setAwbResult({
        error:
          error.message ||
          "Failed to fetch tracking details due to network or parsing error.",
      });
    } finally {
      if (searchTokenRef.current === token) setLoading(false);
    }
  };

  const handlePincodeCheck = async (checkPincode) => {
    const token = ++searchTokenRef.current;
    setLoading(true);
    setPincodeResult(null);

    try {
      const payload = { originId: -1, pincode: checkPincode };
      const response = await fetch(
        "https://panchathanlogistics.com/billing_php/index.php/get_delivery_location_based_pincode",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}.`);
      }

      const responseData = await response.json();
      if (searchTokenRef.current !== token) return;

      if (responseData.status === "failed") {
        setPincodeResult([]);
        console.error("Pincode API Error:", responseData.data);
        return;
      }

      setPincodeResult(responseData?.data || []);
    } catch (error) {
      console.error("Pincode fetch error:", error);
      if (searchTokenRef.current !== token) return;
      setPincodeResult([]);
    } finally {
      if (searchTokenRef.current === token) setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (awb.trim() !== "") {
      setPincode("");
      setPincodeResult(null);
      handleAwbSearch(awb.trim());
    } else if (pincode.trim() !== "") {
      setAwb("");
      setAwbResult(null);
      handlePincodeCheck(pincode.trim());
    }
  };

  const closeResultModal = () => {
    searchTokenRef.current += 1;
    setLoading(false);
    setPincodeResult(null);
    setAwbResult(null);
  };

  const resultModalOpen = (pincodeResult !== null || (awbResult && awbResult.error)) && !loading;

  return (
    <>
      <SEO
        title="Courier & Cargo Services in Chennai, Tamil Nadu | Panchathan Logistics"
        description="Panchathan Logistics is a trusted courier, cargo & freight forwarding company headquartered in Chennai, Tamil Nadu, serving all of India with air, sea, road freight, customs clearance (CHA) and real-time AWB tracking."
        keywords="courier services Chennai, cargo services Chennai, logistics company Tamil Nadu, freight forwarding India, packers and movers Chennai, air cargo Chennai, customs clearance Chennai, best logistics company in India"
        path="/"
        jsonLd={homeJsonLd}
      />
      {/* HERO -> TAILORED EXPERTISE */}
      <div className="relative">
      {/* HERO */}
      <section ref={heroSectionRef} className="relative z-10 -mt-24 md:-mt-28 pt-32 md:pt-40 pb-32 md:pb-36 px-4 md:px-8 overflow-hidden min-h-screen flex items-center">
        {heroFloatingBadges.map((badge, i) => (
          <motion.div
            key={badge.label}
            className={`hidden md:flex absolute z-10 items-center gap-2 px-3 py-1.5 rounded-full text-brand-green text-xs font-semibold border border-brand-green ${badge.position}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <badge.icon className="w-3.5 h-3.5 text-brand-green" />
            {badge.label}
          </motion.div>
        ))}

        <div className="relative max-w-4xl mx-auto w-full flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-xl border border-white/70 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-green mb-6"
          >
            <Radar className="w-3.5 h-3.5" />
            Trusted Nationwide Logistics Partner
          </motion.div>

          <h1
            ref={heroHeadingRef}
            className="text-4xl md:text-6xl xl:text-7xl font-sora font-extrabold leading-[1.05] tracking-tight text-brand-green uppercase"
          >
            Elevate Your Business With Reliable Logistics
          </h1>
          <p className="scroll-reveal mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
            Delivering Confidence, Across Every Border
          </p>

          <motion.form
            ref={searchBoxRef}
            onSubmit={handleSearch}
            className="relative flex flex-col md:flex-row items-stretch gap-2 md:gap-0 mt-10 p-2 rounded-3xl md:rounded-full z-10 w-full max-w-2xl overflow-hidden bg-white/60 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 shadow-[0_8px_32px_rgba(23,93,41,0.12),inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-1px_1px_rgba(255,255,255,0.1)]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-3xl md:rounded-t-full" />

            <div className="relative flex items-center gap-2 px-4 py-3 w-full md:flex-1 min-w-0">
              <Hash className="text-brand-green w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                value={awb}
                onChange={(e) => setAwb(e.target.value)}
                placeholder="AWB number"
                className="bg-transparent outline-none flex-1 min-w-0 text-base text-gray-800 placeholder-gray-500"
              />
            </div>

            <div className="hidden md:block w-px my-2 bg-brand-green" />
            <div className="block md:hidden h-px mx-2 bg-brand-green" />

            <div className="relative flex items-center gap-2 px-4 py-3 w-full md:flex-1 min-w-0">
              <MapPin className="text-brand-green w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="Pincode"
                maxLength={6}
                className="bg-transparent outline-none flex-1 min-w-0 text-base text-gray-800 placeholder-gray-500"
              />
            </div>

            <motion.button
              type="submit"
              disabled={!awb.trim() && !pincode.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative shrink-0 rounded-2xl md:rounded-full transition-all duration-300 flex items-center justify-center gap-2 py-3 px-6 md:px-5 md:w-14 md:h-14 ${
                (!awb.trim() && !pincode.trim())
                  ? 'bg-brand-green/25 text-white/70 cursor-not-allowed'
                  : 'bg-brand-green text-white hover:brightness-110 shadow-md'
              }`}
            >
              <Search className="w-5 h-5" />
              <span className="md:hidden">Search</span>
            </motion.button>
          </motion.form>

          <AnimatePresence>
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-5 flex items-center gap-2 text-brand-green font-medium text-sm"
              >
                <span className="w-4 h-4 rounded-full border-2 border-brand-green/30 border-t-brand-green animate-spin" />
                Checking availability...
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-center gap-2.5 mt-8 text-brand-green font-semibold text-base md:text-lg">
            <span>#HelloIndia</span>
            <span className="italic relative inline-block min-w-[120px] h-7 overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={greetings[currentIndex]}
                  initial={{ opacity: 0, y: "100%" }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: "-100%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute left-0 top-0 bottom-0 flex items-center whitespace-nowrap"
                >
                  {greetings[currentIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex absolute bottom-6 inset-x-0 justify-center z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="md:hidden text-brand-green"
          >
            <Hand className="w-6 h-6" />
          </motion.div>

          <div className="hidden md:flex w-6 h-10 rounded-full border-2 border-brand-green justify-center pt-2">
            <motion.span
              animate={{ y: [0, 14, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2.5 rounded-full bg-brand-green"
            />
          </div>
        </motion.div>
      </section>

      {/* TRUST PILLARS */}
      <section className="relative z-10 pt-52 md:pt-60  pb-16 md:pb-24 px-4 md:px-6 bg-white scroll-mt-24 md:scroll-mt-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.1] pointer-events-none"
          style={{ backgroundImage: "url('/homebg.png')", backgroundSize: '420px', backgroundRepeat: 'repeat', backgroundAttachment: 'fixed', filter: 'invert(1)' }}
        />
        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12  lg:gap-16 items-center w-full">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.4 }} className="order-1 flex flex-col  items-center text-center lg:items-start lg:text-left">
            <h2 className="font-sora text-3xl md:text-4xl xl:text-5xl font-extrabold leading-tight">
              {[
                { t: 'Trusted', c: 'text-gray-900' },
                { t: 'by', c: 'text-gray-900' },
                { t: '250+', c: 'text-gray-400' },
                { t: 'Businesses', c: 'text-gray-400' },
                { t: 'across', c: 'text-gray-900' },
                { t: 'India', c: 'text-gray-900' },
              ].map((word, i) => (
                <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                  <motion.span
                    className={`inline-block ${word.c}`}
                    variants={{ hidden: { y: '100%' }, show: { y: 0 } }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
                  >
                    {word.t}
                  </motion.span>
                  {i < 5 && ' '}
                </span>
              ))}
            </h2>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 text-gray-600 max-w-md">
              Only we connect you directly to real-time visibility of your shipment - GPS-verified fleets, digital docs, and insured cargo, from pickup to delivery.
            </motion.p>

            <div className="flex items-center gap-3 mt-8">
              {[Truck, Package, Warehouse].map((Icon, i) => (
                <div key={i} className="w-11 h-11 rounded-full bg-brand-green text-white border-2 border-white shadow-md flex items-center justify-center -ml-3 first:ml-0">
                  <Icon className="w-5 h-5" />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 md:gap-10 mt-6">
              {[
                { value: '9,034+', label: 'Shipments Delivered' },
                { value: '250+', label: 'Happy Clients' },
                { value: '4.5/5', label: 'Positive Rating' },
              ].map((stat, i) => (
                <div key={i} className={i > 0 ? 'pl-6 md:pl-10 border-l border-gray-200' : ''}>
                  <CountUpStat value={stat.value} label={stat.label} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...staggerContainer(0.15)} className="order-2 lg:order-2 flex flex-wrap justify-center gap-2 lg:hidden">
            {trustPillars.map((pillar, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-brand-green text-xs font-semibold border border-brand-green bg-white/60"
              >
                <pillar.icon className="w-3.5 h-3.5" />
                {pillar.title}
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...staggerContainer(0.15)} className="order-3 lg:order-2 relative lg:pl-9 hidden lg:block">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'top' }}
              className="absolute left-[7px] top-3 bottom-3 w-px bg-gray-200"
            />
            <div className="flex flex-col gap-5">
              {trustPillars.map((pillar, i) => (
                <motion.div key={i} variants={staggerItem} className="relative">
                  <div className="absolute -left-9 top-6 w-4 h-4 rounded-full bg-brand-amber border-4 border-white shadow" />
                  <GlassCard as="div" className="flex items-start gap-4 p-5 md:p-6 group cursor-default">
                    <div className="w-11 h-11 rounded-2xl bg-brand-amber/15 text-brand-amberDark flex items-center justify-center flex-shrink-0">
                      <pillar.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-bold text-gray-900">{pillar.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{pillar.desc}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-green group-hover:border-brand-green group-hover:text-white text-gray-400 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeIn} className="order-3 lg:order-3 lg:col-span-2 w-full mt-6 lg:mt-24 pt-6 lg:pt-10 border-t border-gray-100">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Trusted By Leading Businesses</p>
            <MarqueeStrip items={partners} className="text-brand-green" />
          </motion.div>
        </div>
      </section>

      {/* TAILORED EXPERTISE */}
      <section ref={coreCapSectionRef} className="relative z-10 py-16 md:py-20 lg:py-10 px-4 md:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div ref={coreCapLeftRef} className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="Core Capabilities"
              title="Asset Management & Industry Expertise"
              subtitle="From end-to-end asset tracking to the highest demands of critical industries — dedicated infrastructure, built in."
              className="mb-0 max-w-none"
            />
          </div>

          <motion.div {...staggerContainer(0.15)} className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-6 lg:gap-10 lg:py-10">
            {specializedServices.map((service, i) => (
              <GlassCard key={i} as="div" variants={staggerItem} className="p-6 md:p-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-green text-white flex items-center justify-center mb-5">
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </section>
      </div>
      {/* end scroll-truck wrapper */}

      {/* WHY CHOOSE US */}
      <section ref={whyChooseSectionRef} className="relative py-16 bg-white md:py-24 px-4 md:px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.1] pointer-events-none"
          style={{ backgroundImage: "url('/homebg.png')", backgroundSize: '420px', backgroundRepeat: 'repeat', backgroundAttachment: 'fixed', filter: 'invert(1)' }}
        />
        <div className="relative max-w-5xl mx-auto">
          <SectionHeading
            eyebrow="Why Panchathan"
            title="Why Choose Us for Your Shipment"
            subtitle="A decade of moving India's cargo — real infrastructure, real accountability, and real people on the line, every time."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <GlassCard as="div" className="h-full p-6 text-center flex flex-col items-center">
                  <div className="w-11 h-11 rounded-xl bg-brand-green text-white flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1.5 text-base">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK SERVICE ACCESS */}
      <section className="py-16 md:py-20  px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeading eyebrow="Explore" title="Quick Service Access" />

          <motion.div {...staggerContainer(0.15)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceShortcuts.map((service, i) => (
              <GlassCard
                key={i}
                as="div"
                variants={staggerItem}
                className="p-6 md:p-8 cursor-pointer"
                onClick={() => {
                  navigate(service.link);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-2xl bg-brand-green text-white shadow-md">
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{service.title}</h3>
                <p className="text-sm leading-relaxed mb-4 text-gray-600">{service.desc}</p>
                <div className="text-sm font-semibold text-brand-amberDark">
                  View Service &rarr;
                </div>
              </GlassCard>
            ))}
          </motion.div>

          <div className="text-center mt-12 scroll-reveal">
            <GlassButton onClick={() => navigate("/services")} size="lg">
              <Compass className="w-5 h-5" />
              Discover All Logistics Solutions
            </GlassButton>
          </div>
        </div>
      </section>

      <BranchesSection />

      {/* GOOGLE REVIEWS */}
      <section className="relative z-10 py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeading eyebrow="Client Reviews" title="What Our Clients Say" subtitle="Real feedback from real clients, straight from Google." />
          <div className="elfsight-app-93fa4f00-4cbe-433a-89d1-82d27c88dc71" data-elfsight-app-lazy></div>
        </div>
      </section>

      <AnimatePresence>
        {resultModalOpen && (
          <motion.div
            key="result-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeResultModal}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              key="result-modal-card"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-white/90 backdrop-blur-2xl backdrop-saturate-150 border border-white shadow-[0_20px_60px_rgba(23,93,41,0.25),inset_0_1px_1px_rgba(255,255,255,0.8)] p-6"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent" />

              <button
                type="button"
                onClick={closeResultModal}
                aria-label="Close"
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-500 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {pincodeResult && pincodeResult.length > 0 && (
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-green text-white flex items-center justify-center mb-4 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-brand-green mb-1">Service Available!</h4>
                  <p className="text-sm text-gray-600">
                    We cover {pincodeResult[0].dly_name}, {pincodeResult[0].district_name}, {pincodeResult[0].state_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-3">Ready to book? Call our team and we'll arrange your pickup.</p>
                  <div className="flex gap-2 w-full mt-3">
                    <a
                      href="tel:+917339433590"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-brand-green text-white text-sm font-semibold hover:brightness-110 transition"
                    >
                      <Phone className="w-4 h-4" /> Call to Book
                    </a>
                    <button
                      onClick={closeResultModal}
                      className="flex-1 py-2.5 rounded-full bg-white border border-brand-green text-brand-green text-sm font-semibold hover:bg-gray-50 transition"
                    >
                      Got it
                    </button>
                  </div>
                </div>
              )}

              {pincodeResult && pincodeResult.length === 0 && (
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4 mx-auto">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Service Unavailable</h4>
                  <p className="text-sm text-gray-600">
                    We don't currently deliver to pincode <strong>{pincode}</strong>.
                  </p>

                  <div className="mt-5 w-full rounded-2xl bg-brand-green p-4 flex flex-col items-center text-center">
                    <p className="text-xs font-semibold text-white uppercase tracking-wide mb-2">Need help anyway?</p>
                    <p className="text-sm text-white/80 mb-3">Our customer care team can check for alternate delivery options or nearby coverage.</p>
                    <div className="flex gap-2 w-full justify-center">
                      <a href="tel:+917339433590" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full bg-brand-green text-white text-sm font-semibold hover:brightness-110 transition">
                        <Phone className="w-4 h-4" /> Call
                      </a>
                      <a href="https://wa.me/917339433590" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full bg-white border border-brand-green text-brand-green text-sm font-semibold hover:bg-gray-50 transition">
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {awbResult && awbResult.error && (
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-brand-amberDark flex items-center justify-center mb-4 mx-auto">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Tracking Error</h4>
                  <p className="text-sm text-gray-600">{awbResult.error}</p>

                  <div className="mt-5 w-full rounded-2xl bg-brand-green p-4 flex flex-col items-center text-center">
                    <p className="text-xs font-semibold text-white uppercase tracking-wide mb-2">Still can't find your shipment?</p>
                    <p className="text-sm text-white/80 mb-3">Reach out to our customer care team with your AWB number for help.</p>
                    <div className="flex gap-2 w-full justify-center">
                      <a href="tel:+917339433590" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full bg-brand-green text-white text-sm font-semibold hover:brightness-110 transition">
                        <Phone className="w-4 h-4" /> Call
                      </a>
                      <a href="https://wa.me/917339433590" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full bg-white border border-brand-green text-brand-green text-sm font-semibold hover:bg-gray-50 transition">
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Home;
