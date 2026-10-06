import { render, cleanup } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import SEO from './SEO';

afterEach(cleanup);
test('route metadata replaces HTML fallbacks and stays unique on navigation', () => {
  const fallback = document.createElement('meta');
  fallback.name = 'description'; fallback.content = 'Old fallback'; fallback.dataset.staticSeo = 'true';
  document.head.appendChild(fallback);
  const { rerender } = render(<HelmetProvider><SEO path="/services" /></HelmetProvider>);
  expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1);
  expect(document.querySelector('meta[name="description"]').content).toMatch(/IT asset management/);
  expect(document.querySelector('link[rel="canonical"]').href).toBe('https://panchathanlogistics.com/services');
  const graph = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
  expect(graph['@graph'].some(node => node['@type'] === 'LocalBusiness' && node.address.addressLocality === 'Chennai')).toBe(true);
  expect(graph['@graph'].some(node => node['@type'] === 'Service' && /laptops/.test(node.description))).toBe(true);
  rerender(<HelmetProvider><SEO path="/about" /></HelmetProvider>);
  expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1);
  expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  expect(document.querySelector('link[rel="canonical"]').href).toBe('https://panchathanlogistics.com/about');
  rerender(<HelmetProvider><SEO path="/404" title="Page not found" description="Unavailable page" /></HelmetProvider>);
  expect(document.querySelector('meta[name="robots"]').content).toBe('noindex, follow');
});
