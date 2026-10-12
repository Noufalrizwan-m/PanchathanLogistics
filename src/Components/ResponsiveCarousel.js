import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Native horizontal scrolling keeps touch swipes independent of page scrolling.
export default function ResponsiveCarousel({ items, label, theme = 'light' }) {
  const track = useRef(null);
  const root = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [small, setSmall] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const update = () => setSmall(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!small || !track.current) return;
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), { threshold: 0.5 });
    observer.observe(track.current);
    return () => observer.disconnect();
  }, [small]);
  useEffect(() => {
    if (!small || !visible || paused || interacting || reduced) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      if (index === items.length - 1) { setPaused(true); return; }
      const next = index + 1;
      const card = track.current?.children[next];
      if (card) track.current.scrollTo({ left: card.offsetLeft - track.current.offsetLeft, behavior: 'smooth' });
    }, 5500);
    return () => window.clearInterval(timer);
  }, [small, visible, paused, interacting, reduced, index, items.length]);
  const move = next => {
    setPaused(true);
    const card = track.current?.children[(next + items.length) % items.length];
    if (card) track.current.scrollTo({ left: card.offsetLeft - track.current.offsetLeft, behavior: reduced ? 'auto' : 'smooth' });
  };
  useEffect(() => {
    if (!small || reduced || !root.current) return;
    const context = gsap.context(() => {
      const entrance = theme === 'green'
        ? { clipPath: 'inset(8% 8% 8% 8% round 40px)', scale: 0.94 }
        : { rotationX: 7, y: 24, scale: 0.97, transformPerspective: 900 };
      gsap.fromTo(track.current, entrance, {
        clipPath: 'inset(0% 0% 0% 0% round 24px)', scale: 1, rotationX: 0, y: 0,
        duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 92%', once: true },
        onComplete: () => gsap.set(track.current, { clearProps: 'transform,clipPath' }),
      });
    }, root.current);
    return () => context.revert();
  }, [small, reduced, theme]);
  useEffect(() => {
    if (!small || reduced || !track.current) return;
    const context = gsap.context(() => {
      const card = track.current.children[index];
      if (!card) return;
      gsap.fromTo(card.querySelector('.carousel-icon'), { rotate: -12, scale: 0.8 }, { rotate: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)' });
      gsap.fromTo(card.querySelectorAll('h3, p, .carousel-link'), { x: theme === 'green' ? -16 : 16, opacity: 0.3 }, { x: 0, opacity: 1, stagger: 0.07, duration: 0.45, ease: 'power2.out' });
    }, root.current);
    return () => context.revert();
  }, [index, small, reduced, theme]);
  if (!small) return null;
  return (
    <div ref={root} className={`responsive-carousel carousel-${theme}`} role="region" aria-roledescription="carousel" aria-label={label}
      onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
      <div ref={track} className="carousel-track" onPointerDown={() => setPaused(true)}
        onScroll={() => {
          const cards = [...track.current.children];
          const left = track.current.scrollLeft + track.current.offsetLeft;
          setIndex(cards.reduce((best, card, i) => Math.abs(card.offsetLeft - left) < Math.abs(cards[best].offsetLeft - left) ? i : best, 0));
        }}>
        {items.map((item, i) => (
          <article key={item.title} className="carousel-card" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`}>
            <div className="carousel-card-top"><span className="carousel-icon"><item.icon size={24} /></span><span className="carousel-number">{String(i + 1).padStart(2, '0')}</span></div>
            <h3>{item.title}</h3><p>{item.desc}</p>
            {item.link && <Link to={item.link} className="carousel-link">View service <ArrowRight size={16} /></Link>}
          </article>
        ))}
      </div>
      <div className="carousel-controls">
        <div className="carousel-dots">{items.map((item, i) => <button type="button" key={item.title} aria-label={`Show ${item.title}`} aria-current={i === index ? 'true' : undefined} onClick={() => move(i)}><span /></button>)}</div>
      </div>
    </div>
  );
}
