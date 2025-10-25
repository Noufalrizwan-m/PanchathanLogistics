import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Search, Hash, MapPin, Plane, Truck, Anchor, Phone, Package, Factory, Wrench, Globe, Thermometer, UserCheck, Shield, Zap, TrendingUp, Compass } from "lucide-react"; // Added Compass
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import BranchesSection from '../Components/branchsection';
gsap.registerPlugin(ScrollTrigger, TextPlugin);

function splitText(target) {
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

// Define the core color palette
const COLORS = {
  primary: "#175d29", // Panchathan Green (Deep and Trustworthy)
  secondary: "#f9a825", // Accent Gold/Yellow (Energy and Speed)
  lightBg: "#f0f8f4", // Very light mint/green tint for sections
  white: "#ffffff",
};

// New Service Shortcut Data (Used in the new section)
const serviceShortcuts = [
  { title: "Air Freight", icon: Plane, desc: "Global reach for time-critical cargo.", link: "/services" },
  { title: "Custom Forms and Clearance", icon: Anchor, desc: "Essential Custom Forms (Downloads)", link: "/services" },
  { title: "Ground Logistics", icon: Truck, desc: "LTL, FTL, and last-mile delivery.", link: "/services" },
];


function Home() {
  const navigate = useNavigate();
  const heroHeadingRef = useRef(null);
  const serviceTitleRef = useRef(null);
  const searchBoxRef = useRef(null);
  const stickyCtaRef = useRef(null);

  // State variables
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
      title: "High-Value/Technology Logistics",
      icon: Package,
      desc: "Secure, anti-static, and climate-controlled transport for sensitive system hardware, electronics, and prototypes.",
    },
    {
      title: "Automotive Supply Chain Solutions",
      icon: Wrench,
      desc: "Specialized Just-In-Time (JIT) parts delivery, efficient after-market distribution, and management of assembly kits.",
    },
    {
      title: "Project & Heavy Cargo",
      icon: Factory,
      desc: "Handling oversized, complex, and specialized industrial shipments with dedicated planning."
    },
  ];



  const trustPillars = [
    { icon: Shield, title: "24/7 Monitoring", desc: "Real-time visibility and security for every shipment." },
    { icon: Zap, title: "Seamless Digital Docs", desc: "Paperless operations for speed and customs ease." },
    { icon: UserCheck, title: "IATA Certified", desc: "Operate in partnership with an IATA Certified organization." },
  ];

  const stats = [
    { number: 45000, label: "SHIPMENTS DELI. SAFELY" }, // Changed to number
    { number: 18450, label: "WORLDWIDE SHIPMENTS" },     // Changed to number
    { number: 250, label: "HAPPY CLIENTS" },     // Changed to number
    { number: 6, label: "YEARS IN LOGISTICS" },     // Changed to number
  ];

  const statRefs = useRef([]);
  useEffect(() => {
    if (heroHeadingRef.current) {
      splitText(heroHeadingRef.current);
      gsap.from(heroHeadingRef.current.querySelectorAll(".char-split"), {
        y: "100%",
        opacity: 0,
        stagger: 0.03,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      });
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

    gsap.utils.toArray(".scroll-reveal").forEach((el, i) => {
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

    ScrollTrigger.create({
      trigger: document.body,
      start: "top-=200",
      end: "max",
      onUpdate: (self) => {
        if (stickyCtaRef.current) {
          if (self.direction === 1 && self.progress > 0.05) {
            gsap.to(stickyCtaRef.current, { y: 0, duration: 0.4, ease: "power2.out" });
          } else if (self.direction === -1 || self.progress < 0.05) {
            gsap.to(stickyCtaRef.current, { y: "100%", duration: 0.4, ease: "power2.out" });
          }
        }
      },
    });

  }, []);

  // Statistics Counter Animation (Revised for Flowing Count)
  useEffect(() => {
    const triggers = [];

    statRefs.current.forEach((el, i) => {
      if (!el) return;

      const stat = stats[i];
      if (!stat || typeof stat.number !== "number") return;

      const numericPart = stat.number;
      const isBigNumber = numericPart >= 1000;

      el.innerText = "0";

      const tween = gsap.to({ val: 0 }, {
        val: numericPart,
        duration: 2.5,
        ease: "power1.out",
        onUpdate: function () {
          const currentVal = Math.floor(this.targets()[0].val);

          const formatted = isBigNumber
            ? `${currentVal.toLocaleString("en-IN")}${i < 2 ? "+" : ""}`
            : `${currentVal}+`;

          el.innerText = formatted;
        },
        onComplete: function () {
          const finalFormatted = isBigNumber
            ? `${numericPart.toLocaleString("en-IN")}${i < 2 ? "+" : ""}`
            : `${numericPart}+`;

          el.innerText = finalFormatted;
        },
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true, // ✅ this works correctly inside ScrollTrigger
        },
      });

      triggers.push(tween.scrollTrigger);
    });

    return () => {
      // ✅ clean up triggers when component unmounts
      triggers.forEach((t) => t && t.kill());
    };
  }, []);



  useEffect(() => {
    gsap.utils.toArray(".gsap-fade-in-branches").forEach((el) => {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % greetings.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [greetings.length]);

  // AWB & Pincode Search Logic (Unchanged)
  const handleAwbSearch = async (trackingAwb) => {
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

      if (responseData.status === "failed") {
        const errorMessage =
          responseData.data || `Tracking failed for AWB: ${trackingAwb}`;
        setAwbResult({ error: errorMessage });
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
      setAwbResult({
        error:
          error.message ||
          "Failed to fetch tracking details due to network or parsing error.",
      });
    } finally {
      setLoading(false);
    }
  };


  const handlePincodeCheck = async (checkPincode) => {
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

      if (responseData.status === "failed") {
        setPincodeResult([]);
        console.error("Pincode API Error:", responseData.data);
        return;
      }

      setPincodeResult(responseData?.data || []);

    } catch (error) {
      console.error("Pincode fetch error:", error);
      setPincodeResult([]);
    } finally {
      setLoading(false);
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

  return (
    <>
      {/* --- HERO SECTION (UNCHANGED) --- */}
      <section className={`relative flex flex-col justify-center items-center py-20 md:py-32 px-4 md:px-8 overflow-hidden bg-gradient-to-br from-white to-[${COLORS.lightBg}]`}>
        {/* ... Hero Content ... */}
        <h1
          ref={heroHeadingRef}
          style={{ color: COLORS.primary }}
          className={`text-5xl md:text-[8vw] lg:text-[7vw] font-extrabold leading-tight text-center tracking-tight uppercase [line-height:1.1]`}
        >
          Elevate Your Business with Reliable Logistics
        </h1>
        <p className="scroll-reveal mt-4 md:mt-6 text-lg md:text-2xl text-gray-700 font-light max-w-3xl text-center" >
          Delivering Confidence, Across Every Border
        </p>

        {/* --- Search Box (UNCHANGED) --- */}
        <motion.div
          ref={searchBoxRef}
          className="flex flex-col md:flex-row justify-center items-center gap-3 mt-8 p-4 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl z-10 w-full max-w-4xl border-2 border-gray-100"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          {/* AWB Input */}
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 w-full md:flex-grow border-2 border-transparent focus-within:border-gray-300 transition-all">
            <Hash className={`text-[${COLORS.primary}] mr-2 w-5 h-5`} />
            <input type="text" value={awb} onChange={(e) => setAwb(e.target.value)} placeholder="Enter AWB number to track" className="bg-transparent outline-none flex-1 text-base text-gray-700 placeholder-gray-500" />
          </div>

          <span className="text-gray-500 font-bold uppercase text-xs md:hidden">OR</span>
          <span className="text-gray-500 font-bold uppercase text-xs hidden md:block">|</span>

          {/* Pincode Input */}
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 w-full md:flex-grow border-2 border-transparent focus-within:border-gray-300 transition-all">
            <MapPin className={`text-[${COLORS.primary}] mr-2 w-5 h-5`} />
            <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} placeholder="Enter Pincode for service check" maxLength={6} className="bg-transparent outline-none flex-1 text-base text-gray-700 placeholder-gray-500" />
          </div>

          {/* Combined Search Button */}
          <motion.button
            onClick={handleSearch}
            disabled={!awb.trim() && !pincode.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-3 px-6 rounded-full text-white transition duration-300 w-full md:w-auto md:flex-shrink-0 shadow-md ${(!awb.trim() && !pincode.trim()) ? 'bg-gray-400 cursor-not-allowed' : `bg-[${COLORS.primary}] hover:bg-green-800`}`}
          >
            <Search className="inline w-5 h-5 mr-2 md:mr-0 md:hidden" />
            <span className="md:hidden">Search / Check</span>
            <Search className="hidden md:block w-5 h-5" />
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading && <motion.p key="loading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`mt-4 text-[${COLORS.primary}] font-medium text-sm`}>Checking availability...</motion.p>}

          {pincodeResult && pincodeResult.length > 0 && !loading && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`mt-4 bg-white shadow-xl rounded-xl p-3 text-[${COLORS.primary}] w-full max-w-md border-l-4 border-[${COLORS.secondary}] text-sm`}>
              <h4 className="font-bold mb-1">Service Available!</h4>
              <div>We cover {pincodeResult[0].dly_name}, {pincodeResult[0].district_name}, {pincodeResult[0].state_name}</div>
            </motion.div>
          )}
          {pincodeResult && pincodeResult.length === 0 && !loading && (
            <motion.p key="fail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-4 text-red-600 bg-red-50 p-3 rounded-lg border border-red-300 text-sm w-full max-w-md">Service currently **Unavailable** for pincode: **{pincode}**.</motion.p>
          )}

          {awbResult && awbResult.error && !loading && (
            <motion.p key="awb_fail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-4 text-red-600 bg-red-50 p-3 rounded-lg border border-red-300 text-sm w-full max-w-md">Tracking Error: **{awbResult.error}**</motion.p>
          )}
        </AnimatePresence>

        <div className="absolute bottom-4 right-4 flex items-end backdrop-blur-sm p-2 md:p-3 rounded-tl-lg rounded-br-lg shadow-lg ">
          <span className={`text-[${COLORS.primary}] font-semibold text-xs md:text-xl flex items-center`}>
            <span className="mr-1 md:mr-2">#HelloIndia </span>
            <span className="italic relative inline-block min-w-[80px] md:min-w-[140px] h-4 mb-1 md:h-6 overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={greetings[currentIndex]}
                  initial={{ opacity: 0, y: "100%" }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: "-100%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute left-0 whitespace-nowrap"
                >
                  {greetings[currentIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
        </div>
      </section>

      {/* --- TRUST PILLARS SECTION (UNCHANGED) --- */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6">
          {trustPillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              viewport={{ once: true, amount: 0.5 }}
              className="flex items-start p-4 bg-gray-50 rounded-lg shadow-sm border-l-4 border-l-gray-200 hover:border-l-[${COLORS.secondary}] transition-all duration-300"
            >
              <pillar.icon className={`w-6 h-6 mr-3 text-[${COLORS.secondary}] flex-shrink-0 mt-1`} />
              <div>
                <h3 className="text-lg font-bold text-gray-800">{pillar.title}</h3>
                <p className="text-sm text-gray-600">{pillar.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className={`scroll-reveal text-3xl md:text-5xl font-bold text-center mb-4 text-[${COLORS.primary}]`}>
            Tailored Industry Expertise
          </h2>
          <p className="scroll-reveal text-center text-base md:text-lg text-gray-600 mb-10 md:mb-12 max-w-3xl mx-auto">
            Meeting the highest demands of critical industries with dedicated expertise and infrastructure.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {specializedServices.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true, amount: 0.4 }}
                className={`p-6 md:p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-b-4 border-b-[${COLORS.primary}] hover:border-b-[${COLORS.secondary}]`}
              >
                <service.icon className={`w-7 h-7 md:w-8 md:h-8 mb-4 text-[${COLORS.secondary}]`} />
                <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{service.desc}</p>
                {/* <button
                  onClick={() => navigate('/services')}
                  className={`text-sm font-bold text-[${COLORS.secondary}] hover:text-yellow-700 transition`}
                >
                  Discover More &rarr;
                </button> */}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className={`bg-[${COLORS.lightBg}] py-16 md:py-20`}>
        <h1 className={`scroll-reveal text-4xl md:text-5xl font-bold text-center text-[${COLORS.primary}] mb-10 md:mb-18`}>
          We're growing rapidly, and it's all thanks to you!       </h1>

        {/* --- Stats Counter Grid --- */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center px-4 md:px-6">
          {stats.map((stat, i) => (
            <div key={i} className="scroll-reveal">
              <h2
                ref={(el) => (statRefs.current[i] = el)}
                data-value={stat.number}
                className={`text-4xl md:text-5xl font-extrabold text-[${COLORS.secondary}]`}
              >
                0
              </h2>
              <p className="mt-1 md:mt-2 text-base md:text-md text-gray-800 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* --- About Snippet & CTA --- */}
        <section className="flex mt-16 md:mt-20 justify-center">
          <div className="relative max-w-6xl mx-auto rounded-3xl  md:p-8 flex flex-col md:flex-row items-center  md:gap-10 shadow-2xl  md: bg-white">

            {/* Left: Image */}
            <div className="w-full md:w-1/2 rounded-xl md:rounded-2xl overflow-hidden mt-[-144px] flex items-center justify-center">
              <img
                src="/truck1.png"
                alt="Panchathan Logistics Cargo Truck"
                className="h-auto object-cover"
              />
            </div>

            {/* Right: Content */}
            <div className="w-full md:w-1/2 m-4 flex flex-col gap-4 md:gap-6 scroll-reveal">
              <h2 className="text-2xl m-2 md:text-4xl font-bold">
                More Than Moving Goods: We Move Commitments.
              </h2>
              <p className="text-gray-700 mr-2 ml-2 text-sm md:text-base leading-relaxed">
                For over a decade, Panchathan Logistics has been dedicated to building
                India's most reliable and secure supply chain network. Our commitment to
                <strong> integrity, 24/7 support, and on-time delivery </strong> defines our legacy.
                We are partnered with IATA certified and always compliant.
              </p>
              <div className="flex gap-4">
                <button
                  className={`px-5 py-2 m-2 md:px-6 md:py-3 bg-[${COLORS.primary}] text-white rounded-full text-sm md:text-base font-semibold hover:bg-green-800 transition shadow-lg hover:shadow-xl`}
                  onClick={() => navigate('/about')}
                >
                  Read Our Full Story
                </button>
              </div>
            </div>

          </div>
        </section>

      </section>
      <section className={`py-16 md:py-20 bg-[${COLORS.lightBg}] overflow-hidden`}>
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center text-black mb-12 uppercase"
        >
          Quick Service Access
        </motion.h1>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {/* Service Shortcut Cards */}
          {serviceShortcuts.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
              className={`p-6 md:p-8 rounded-xl shadow-xl border transition-all duration-300 hover:shadow-2xl cursor-pointer bg-white text-gray-800 border-gray-100 hover:border-[${COLORS.secondary}]`}
              onClick={() => {
                navigate(service.link);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <div className={`mb-4 w-12 h-12 flex items-center justify-center rounded-xl bg-[${COLORS.primary}] text-white shadow-md`}>
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
              <p className="text-sm leading-relaxed mb-4 text-gray-600">{service.desc}</p>
              <div className={`text-sm font-semibold transition-colors duration-300 text-[${COLORS.secondary}] hover:text-yellow-700`}>
                View Service &rarr;
              </div>
            </motion.div>
          ))}
        </div>

        {/* 'More Services' Call to Action */}
        <div className="text-center mt-12 scroll-reveal">
          <motion.button
            onClick={() => navigate("/services")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-3 px-8 rounded-full text-white transition duration-300 bg-[${COLORS.primary}] hover:bg-green-800 shadow-lg font-bold text-base md:text-lg`}
          >
            <Compass className="inline w-5 h-5 mr-2" />
            Discover All Logistics Solutions
          </motion.button>
        </div>

      </section>

      {/* Branches Section (Assuming component exists) */}
      <BranchesSection />

      {/* ---------------------------------------------------- */}
      {/* 6. Sticky Footer CTA (UNCHANGED) */}
      {/* ---------------------------------------------------- */}
      {/* <motion.div
        ref={stickyCtaRef}
        initial={{ y: "100%" }}
        className={`fixed bottom-0 left-0 right-0 z-[100] bg-[${COLORS.primary}] shadow-2xl transform translate-y-full`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row justify-between items-center">
          <h3 className="text-base md:text-xl font-bold text-white mb-2 md:mb-0 flex items-center">
            <TrendingUp className={`w-5 h-5 mr-2 text-[${COLORS.secondary}]`} />
            Need a customized logistics plan? Let's connect.
          </h3>
          <button
            onClick={() => navigate('/contact')}
            className={`px-5 py-2 w-full md:w-auto bg-[${COLORS.secondary}] text-gray-900 rounded-full font-extrabold text-sm md:text-base hover:bg-yellow-600 transition shadow-lg`}
          >
            <Phone className="inline w-4 h-4 mr-2" />
            Get a Quote Now
          </button>
        </div>
      </motion.div> */}

    </>
  );
}

export default Home;