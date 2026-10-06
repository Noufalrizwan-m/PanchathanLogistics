import { useEffect } from 'react';

// One gesture moves between the hero and the next section; the rest of the page scrolls normally.
export default function useHeroScroll(heroRef) {
  useEffect(() => {
    let frame;
    let locked = false;
    let lastWheel = null;
    let wheelStart = window.scrollY;
    let wheelDirection = 0;
    let touchY = 0;
    let touchScroll = 0;
    let touchHandled = false;
    let touchIgnored = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bounds = () => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return null;
      const top = rect.top + window.scrollY;
      // Clear the floating navigation when arriving at the next section.
      const next = Math.max(top, rect.bottom + window.scrollY - 96);
      return { top, next };
    };
    const isControl = target => target instanceof Element && Boolean(target.closest('input, textarea, select, button, a, [role="dialog"], [role="navigation"], [contenteditable="true"]'));
    const jump = target => {
      cancelAnimationFrame(frame);
      if (reducedMotion) { window.scrollTo({ top: target, behavior: 'instant' }); return; }
      locked = true;
      const started = performance.now();
      window.scrollTo({ top: target, behavior: 'smooth' });
      const finish = now => {
        if ((now - started > 120 && Math.abs(window.scrollY - target) < 2) || now - started > 1600) {
          locked = false;
        } else frame = requestAnimationFrame(finish);
      };
      frame = requestAnimationFrame(finish);
    };
    const destination = (direction, start) => {
      const range = bounds();
      if (!range) return null;
      if (direction > 0 && start >= range.top - 4 && start < range.next - 4) return range.next;
      if (direction < 0 && start > range.top + 4 && start <= range.next + 80) return range.top;
      return null;
    };
    const wheel = event => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY || isControl(event.target)) return;
      const now = performance.now();
      const direction = Math.sign(event.deltaY);
      if (lastWheel === null || now - lastWheel > 220 || direction !== wheelDirection) {
        wheelStart = window.scrollY;
      }
      lastWheel = now;
      wheelDirection = direction;
      // Downward input is released on arrival. An upward snap is allowed only
      // when this gesture began at section two, never while passing through it.
      const range = bounds();
      if (!range) return;
      if (event.deltaY > 0 && window.scrollY >= range.next - 4) return;
      if (locked) { event.preventDefault(); return; }
      const target = destination(event.deltaY, direction < 0 ? wheelStart : window.scrollY);
      if (target !== null) { event.preventDefault(); jump(target); }
    };
    const touchStart = event => {
      touchIgnored = event.touches.length !== 1 || isControl(event.target);
      if (touchIgnored) return;
      touchY = event.touches[0].clientY; touchScroll = window.scrollY; touchHandled = false;
    };
    const touchMove = event => {
      if (touchIgnored || event.touches.length !== 1 || isControl(event.target)) return;
      const delta = touchY - event.touches[0].clientY;
      const range = bounds();
      if (delta > 0 && range && window.scrollY >= range.next - 4 && !touchHandled) return;
      if (locked || touchHandled) { event.preventDefault(); return; }
      if (Math.abs(delta) < 30) return;
      const target = destination(delta, touchScroll);
      if (target !== null) { event.preventDefault(); touchHandled = true; jump(target); }
    };
    const keyDown = event => {
      if (isControl(event.target) || event.altKey || event.ctrlKey || event.metaKey) return;
      const direction = ['ArrowDown', 'PageDown'].includes(event.key) ? 1 : ['ArrowUp', 'PageUp'].includes(event.key) ? -1 : 0;
      if (!direction) return;
      const target = destination(direction, window.scrollY);
      if (locked || target !== null) { event.preventDefault(); if (!locked) jump(target); }
    };
    window.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('touchstart', touchStart, { passive: true });
    window.addEventListener('touchmove', touchMove, { passive: false });
    window.addEventListener('keydown', keyDown);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('wheel', wheel);
      window.removeEventListener('touchstart', touchStart);
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('keydown', keyDown);
    };
  }, [heroRef]);
}
