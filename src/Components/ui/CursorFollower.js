import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const HOVER_SELECTOR = 'a, button, [role="button"], input, select, textarea, [data-cursor-hover]';

// Walks up from the element under the pointer to find the nearest opaque
// background color, then checks its relative luminance — used to flip the
// cursor to white when it's over a dark section (e.g. the brand-green
// hero/CTA bands) instead of staying green-on-green and disappearing.
const isDarkBackgroundAt = (clientX, clientY) => {
  let el = document.elementFromPoint(clientX, clientY);
  let depth = 0;
  while (el && depth < 10) {
    const bg = getComputedStyle(el).backgroundColor;
    const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (match) {
      const [, r, g, b, a] = match;
      const alpha = a === undefined ? 1 : parseFloat(a);
      if (alpha > 0.5) {
        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        return luminance < 0.45;
      }
    }
    el = el.parentElement;
    depth += 1;
  }
  return false;
};

const CursorFollower = () => {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [onDark, setOnDark] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 400, damping: 40, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 400, damping: 40, mass: 0.5 });

  const rafRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setEnabled(mq.matches);
    const onChange = (e) => setEnabled(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    document.body.classList.add('cursor-none-active');

    const handleMove = (e) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        x.set(e.clientX);
        y.set(e.clientY);
        setVisible(true);
        setOnDark(isDarkBackgroundAt(e.clientX, e.clientY));
      });
    };

    const handleOver = (e) => {
      if (e.target.closest && e.target.closest(HOVER_SELECTOR)) setHovering(true);
    };
    const handleOut = (e) => {
      if (e.target.closest && e.target.closest(HOVER_SELECTOR)) setHovering(false);
    };
    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      document.body.classList.remove('cursor-none-active');
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
      document.removeEventListener('mouseleave', handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const dotColor = onDark ? 'bg-white' : 'bg-brand-green';
  const ringColor = onDark ? 'border-white' : 'border-brand-green';
  const ringFill = onDark ? 'rgba(255,255,255,0.1)' : 'rgba(23,93,41,0.08)';

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none" aria-hidden="true">
      <motion.div
        className={`absolute rounded-full ${dotColor}`}
        style={{ x, y, width: 8, height: 8, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className={`absolute rounded-full border ${ringColor}`}
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
          opacity: visible ? (hovering ? 0.9 : 0.5) : 0,
          backgroundColor: hovering ? ringFill : 'rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
};

export default CursorFollower;
