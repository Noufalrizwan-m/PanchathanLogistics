import customForms from './customForms.mjs';

// Shared by the React pages and the production HTML generator.
const SITE_URL = 'https://panchathanlogistics.com';
const SITE_NAME = 'Panchathan Logistics';
const BUSINESS_ID = `${SITE_URL}/#business`;
const pages = {
  '/': {
    title: 'IT Asset Management & Logistics Chennai | Panchathan Logistics',
    description: 'IT asset management and laptop logistics in Chennai. Panchathan Logistics handles laptops, desktops, servers, courier and cargo shipments across India.',
  },
  '/services': {
    title: 'IT Asset Logistics & Customs Forms Chennai | Panchathan Logistics',
    description: 'IT asset management in Chennai and downloadable customs forms: commercial invoice, packing list, KYC, authorisation letter and export declarations.',
  },
  '/about': {
    title: 'Chennai Logistics & IT Asset Team | Panchathan Logistics',
    description: 'Founded in Chennai in 2019, Panchathan Logistics supports IT asset management, laptop logistics and cargo transport through seven branches across India.',
  },
  '/contact': {
    title: 'Contact Chennai Logistics Team | Panchathan Logistics',
    description: 'Contact Panchathan Logistics in Pammal, Chennai for IT asset management, laptop transport and courier or cargo quotes. Call +91 73394 33590.',
  },
  '/tracking': {
    title: 'Track Courier & Cargo Shipments | Panchathan Logistics',
    description: 'Track your Panchathan Logistics shipment using the AWB number on your booking receipt. Contact our Chennai team for courier and cargo tracking support.',
  },
  '/privacy': {
    title: 'Enquiry Privacy | Panchathan Logistics',
    description: 'How Panchathan Logistics uses the contact and shipment details submitted through its enquiry form.',
  },
};
const services = [
  { id: 'asset-management', name: 'IT Asset Management & Tracking', serviceType: 'IT asset management and equipment logistics', description: 'IT asset management and logistics in Chennai for laptops, desktops, servers and office equipment, with shipment tracking and coordinated business deliveries.' },
  { id: 'air-freight', name: 'Air Freight Forwarding', serviceType: 'Air freight forwarding', description: 'Air cargo coordination from Chennai for express, priority and consolidated business shipments.' },
  { id: 'customs-clearance', name: 'Customs & Compliance', serviceType: 'Customs clearance coordination', description: 'Import and export documentation and customs clearance support for freight shipments.' },
  { id: 'warehousing', name: 'Warehousing & Supply Chain', serviceType: 'Warehousing and distribution', description: 'Storage, pick-and-pack and distribution integrated with freight transport.' },
  { id: 'surface-transport', name: 'Surface Transport', serviceType: 'Road freight and cargo transport', description: 'Local Chennai, metro and interstate business cargo transport with shipment visibility.' },
];
const business = {
  '@type': 'LocalBusiness', '@id': BUSINESS_ID, name: SITE_NAME,
  url: `${SITE_URL}/`, image: `${SITE_URL}/logo-480.webp`, logo: `${SITE_URL}/logo-480.webp`,
  description: pages['/'].description, telephone: '+91-73394-33590', email: 'info@panchathanlogistics.com', foundingDate: '2019',
  address: { '@type': 'PostalAddress', streetAddress: 'Plot No. 65, Annai Therasa Street, V.O.C. Nagar, Pammal', addressLocality: 'Chennai', addressRegion: 'Tamil Nadu', postalCode: '600075', addressCountry: 'IN' },
  areaServed: [{ '@type': 'City', name: 'Chennai' }, { '@type': 'State', name: 'Tamil Nadu' }, { '@type': 'Country', name: 'India' }],
  openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '10:00', closes: '19:30' },
  sameAs: ['https://www.facebook.com/profile.php?id=100066693142443', 'https://www.instagram.com/panchathan_logistics/', 'https://www.linkedin.com/company/panchathan-logistics-pvt-ltd/'],
};
function canonical(path) { return `${SITE_URL}${path === '/' ? '/' : path}`; }
function graph(path) {
  const page = pages[path];
  if (!page) return null;
  const url = canonical(path);
  const nodes = [business, { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: SITE_NAME, publisher: { '@id': BUSINESS_ID } },
    { '@type': path === '/contact' ? 'ContactPage' : path === '/about' ? 'AboutPage' : 'WebPage', '@id': `${url}#webpage`, url, name: page.title, description: page.description, inLanguage: 'en-IN', isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': BUSINESS_ID } }];
  if (path !== '/') nodes.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` }, { '@type': 'ListItem', position: 2, name: { '/services': 'Services', '/about': 'About Us', '/contact': 'Contact Us', '/tracking': 'Tracking', '/privacy': 'Enquiry Privacy' }[path], item: url }] });
  if (path === '/services' || path === '/') {
    const offerings = services.map(service => ({ '@type': 'Service', '@id': `${SITE_URL}/services#${service.id}`, name: service.name, serviceType: service.serviceType, description: service.description, url: `${SITE_URL}/services#${service.id}`, provider: { '@id': BUSINESS_ID }, areaServed: business.areaServed }));
    nodes.push(...offerings);
    nodes[0] = { ...business, hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Logistics services from Chennai', itemListElement: offerings.map(service => ({ '@type': 'Offer', itemOffered: { '@id': service['@id'] } })) } };
  }
  if (path === '/services') nodes.push({
    '@type': 'ItemList', '@id': `${url}#customs-forms`, name: 'Download Customs Forms',
    url: `${url}#customs-forms`, numberOfItems: customForms.length,
    itemListElement: customForms.map((form, index) => ({ '@type': 'ListItem', position: index + 1,
      item: { '@type': 'DigitalDocument', name: form.name, url: `${SITE_URL}/doc/${encodeURIComponent(form.file)}`, encodingFormat: form.file.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/vnd.ms-excel' } })),
  });
  return { '@context': 'https://schema.org', '@graph': nodes };
}
const seoData = { SITE_URL, SITE_NAME, pages, services, business, canonical, graph };
export default seoData;
