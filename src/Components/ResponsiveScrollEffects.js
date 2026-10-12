import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Each effect owns plain inner content or CSS variables, leaving existing
// desktop/Framer transforms untouched. MatchMedia reverts on resize and route exit.
export default function ResponsiveScrollEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    const root = document.getElementById('main-content');
    if (!root) return;
    const media = gsap.matchMedia();
    media.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
      if (pathname !== '/') {
        root.querySelectorAll('h1').forEach(heading => {
          gsap.fromTo(heading, { clipPath: 'inset(0 100% 0 0)' }, {
            clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power3.inOut', clearProps: 'clipPath',
          });
        });
      }
      root.querySelectorAll('section h2').forEach(heading => {
        gsap.fromTo(heading, { clipPath: 'inset(0 0 100% 0)' }, {
          clipPath: 'inset(0 0 0% 0)', ease: 'none',
          scrollTrigger: { trigger: heading, start: 'top 96%', end: 'top 76%', scrub: 0.35 },
        });
      });
      root.querySelectorAll('[data-scroll-benefits]').forEach(grid => {
        gsap.fromTo(grid.children, { y: 12, scale: 0.97 }, {
          y: 0, scale: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out', clearProps: 'transform',
          scrollTrigger: { trigger: grid, start: 'top 92%', once: true },
        });
      });
      root.querySelectorAll('[data-scroll-service]').forEach((card, i) => {
        const content = card.querySelector('[data-scroll-content]');
        if (!content) return;
        const timeline = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 91%', once: true } });
        timeline.fromTo(content, { x: i % 2 ? 28 : -28 }, { x: 0, duration: 0.7, ease: 'power3.out', clearProps: 'transform' });
        const icon = content.querySelector('svg');
        if (icon) timeline.fromTo(icon, { scale: 0.65, rotation: -20 }, { scale: 1, rotation: 0, duration: 0.65, ease: 'back.out(1.5)', clearProps: 'transform' }, 0.1);
      });
      root.querySelectorAll('[data-scroll-line]').forEach(section => {
        gsap.fromTo(section, { '--section-progress': 0 }, {
          '--section-progress': 1, ease: 'none',
          scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 30%', scrub: 0.5 },
        });
      });
      root.querySelectorAll('[data-scroll-timeline]').forEach(item => {
        gsap.fromTo(item, { '--journey-fill': '0%' }, { '--journey-fill': '100%', ease: 'none', scrollTrigger: { trigger: item, start: 'top 80%', end: 'bottom 65%', scrub: 0.4 } });
        const year = item.querySelector('[data-scroll-year]');
        if (year) gsap.fromTo(year, { x: -16, scale: 0.9 }, { x: 0, scale: 1, duration: 0.6, clearProps: 'transform', scrollTrigger: { trigger: item, start: 'top 85%', once: true } });
      });
      root.querySelectorAll('[data-scroll-photo]').forEach(photo => {
        gsap.fromTo(photo, { yPercent: -5, scale: 1.08 }, { yPercent: 5, scale: 1.08, ease: 'none', scrollTrigger: { trigger: photo.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
      });
      root.querySelectorAll('[data-scroll-map]').forEach(map => {
        gsap.fromTo(map, { scale: 0.88, rotation: -3 }, { scale: 1, rotation: 0, ease: 'none', scrollTrigger: { trigger: map, start: 'top 95%', end: 'top 40%', scrub: 0.6 } });
      });
      root.querySelectorAll('[data-scroll-step]').forEach((step, i) => {
        gsap.fromTo(step, { clipPath: `inset(0 ${i % 2 ? 0 : 8}% 0 ${i % 2 ? 8 : 0}% round 24px)` }, {
          clipPath: 'inset(0 0% 0 0% round 24px)', duration: 0.85, ease: 'power2.out', clearProps: 'clipPath',
          scrollTrigger: { trigger: step, start: 'top 90%', once: true },
        });
      });
      root.querySelectorAll('[data-scroll-info] > div > div, [data-scroll-hub] > div').forEach((item, i) => {
        gsap.fromTo(item, { x: i % 2 ? 18 : -18 }, { x: 0, duration: 0.6, clearProps: 'transform', scrollTrigger: { trigger: item, start: 'top 92%', once: true } });
      });
    }, root);
    // Lazy images can change section geometry after the initial layout.
    let refreshFrame;
    const refresh = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const images = [...root.querySelectorAll('img')].filter(img => !img.complete);
    images.forEach(img => img.addEventListener('load', refresh, { once: true }));
    const frame = requestAnimationFrame(refresh);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(refreshFrame);
      images.forEach(img => img.removeEventListener('load', refresh));
      media.revert();
    };
  }, [pathname]);
  return null;
}
