jest.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { name: 'ScrollTrigger', register() {} } }));
jest.mock('react-router-dom', () => ({ useNavigate: () => jest.fn(), useLocation: () => ({ hash: '' }), Link: ({ children }) => children }), { virtual: true });
import { render, screen, fireEvent } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import Services from './services';

beforeAll(() => {
  window.matchMedia = query => ({ matches: query.includes('max-width') || query.includes('prefers-reduced-motion'), addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
  global.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
});

test('expanding mobile customs forms makes every download immediately visible', () => {
  render(<HelmetProvider><Services /></HelmetProvider>);
  const list = document.getElementById('customs-form-list');
  expect(list.querySelectorAll('a[download]')).toHaveLength(4);
  fireEvent.click(screen.getByRole('button', { name: 'View all 22 forms' }));
  expect(list.querySelectorAll('a[download]')).toHaveLength(22);
  for (const link of list.querySelectorAll('a[download]')) {
    expect(link).toBeVisible();
    expect(link.style.opacity).not.toBe('0');
  }
  const toggle = screen.getByRole('button', { name: 'Show fewer forms' });
  expect(toggle).toHaveAttribute('aria-controls', 'customs-form-list');
  expect(toggle.compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  fireEvent.click(toggle);
  expect(list.querySelectorAll('a[download]')).toHaveLength(4);
});
