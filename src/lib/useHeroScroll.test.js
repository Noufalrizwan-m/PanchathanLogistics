import { renderHook } from '@testing-library/react';
import useHeroScroll from './useHeroScroll';

test('continued downward input is released after reaching the second section', () => {
  const originalMatch = window.matchMedia;
  const originalScroll = window.scrollTo;
  window.matchMedia = jest.fn(() => ({ matches: false }));
  window.scrollTo = jest.fn();
  const raf = jest.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
  const cancel = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  const scrollDescriptor = Object.getOwnPropertyDescriptor(window, 'scrollY');
  let position = 0;
  Object.defineProperty(window, 'scrollY', { configurable: true, get: () => position });
  const heroRef = { current: { getBoundingClientRect: () => ({ top: -position, bottom: 1000 - position }) } };
  const { unmount } = renderHook(() => useHeroScroll(heroRef));
  try {
    const first = new WheelEvent('wheel', { deltaY: 30, bubbles: true, cancelable: true });
    document.body.dispatchEvent(first);
    expect(first.defaultPrevented).toBe(true);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 904, behavior: 'smooth' });
    // No quiet interval between events: emulate the tail of one trackpad gesture.
    position = 904;
    for (let index = 0; index < 5; index++) {
      const next = new WheelEvent('wheel', { deltaY: 30, bubbles: true, cancelable: true });
      document.body.dispatchEvent(next);
      expect(next.defaultPrevented).toBe(false);
      position += 30;
    }
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  } finally {
    unmount();
    window.matchMedia = originalMatch;
    window.scrollTo = originalScroll;
    Object.defineProperty(window, 'scrollY', scrollDescriptor);
    raf.mockRestore(); cancel.mockRestore();
  }
});

test('an upward gesture from a later section does not snap when passing section two', () => {
  const originalMatch = window.matchMedia;
  const originalScroll = window.scrollTo;
  const scrollDescriptor = Object.getOwnPropertyDescriptor(window, 'scrollY');
  window.matchMedia = jest.fn(() => ({ matches: false }));
  window.scrollTo = jest.fn();
  let position = 1500;
  Object.defineProperty(window, 'scrollY', { configurable: true, get: () => position });
  const heroRef = { current: { getBoundingClientRect: () => ({ top: -position, bottom: 1000 - position }) } };
  const { unmount } = renderHook(() => useHeroScroll(heroRef));
  try {
    const wheel = () => {
      const event = new WheelEvent('wheel', { deltaY: -30, bubbles: true, cancelable: true });
      document.body.dispatchEvent(event);
      return event;
    };
    expect(wheel().defaultPrevented).toBe(false);
    position = 950;
    expect(wheel().defaultPrevented).toBe(false);
    position = 904;
    expect(wheel().defaultPrevented).toBe(false);
    expect(window.scrollTo).not.toHaveBeenCalled();
  } finally {
    unmount(); window.matchMedia = originalMatch; window.scrollTo = originalScroll;
    Object.defineProperty(window, 'scrollY', scrollDescriptor);
  }
});
