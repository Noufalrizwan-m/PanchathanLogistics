export const business = {
  name: 'Panchathan Logistics',
  email: 'info@panchathanlogistics.com',
  salesEmail: 'sales.panchathanlogistics@gmail.com',
  phone: '+91 73394 33590',
  phoneHref: 'tel:+917339433590',
  address: '#1, Pallavan St, VOC Nagar, Pammal, Chennai, Tamil Nadu 600075',
  officeMapUrl: 'https://maps.app.goo.gl/Z8RDckhSS3xroAAZ7',
  officeMapEmbedUrl: 'https://www.google.com/maps?q=12.9703268,80.1311901&z=17&output=embed',
};
export const branches = [
  { city: 'Chennai', hq: true, address: business.address },
  { city: 'Kochi', address: 'New/63/3289, MBA Residency, Brother Mayooras Road, Kochi 682016' },
  { city: 'Bangalore', address: 'No. 29, 6th Main, 10th Cross, Sampangi Ram Nagar, Bangalore 560027' },
  { city: 'Hyderabad', address: '1-8-506/B/1, Prakash Nagar, Begumpet, Hyderabad 500016' },
  { city: 'Mumbai', address: 'Shop 03A/1B, Shanti Nagar, Opp. Marol MIDC Bus Depot, Andheri East, Mumbai 400093' },
  { city: 'Kolkata', address: '#193A/17 Picnic Garden Road, Kolkata 700039' },
  { city: 'Delhi', address: 'Plot No. A-50, Near Grand Shoba Hotel, Road No. 6, Mahipalpur, New Delhi 110037' },
];
export const directionsUrl = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
