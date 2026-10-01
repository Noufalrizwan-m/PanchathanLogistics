export const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.3 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: false, amount: 0.3 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

export const staggerContainer = (stagger = 0.12, delayChildren = 0) => ({
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: false, amount: 0.2 },
  variants: {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  },
});

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export const glassHover = {
  whileHover: { y: -6, scale: 1.01 },
  whileTap: { scale: 0.98 },
  transition: { type: 'spring', stiffness: 300, damping: 22 },
};

export const buttonTap = {
  whileHover: { scale: 1.04 },
  whileTap: { scale: 0.96 },
  transition: { type: 'spring', stiffness: 400, damping: 20 },
};
