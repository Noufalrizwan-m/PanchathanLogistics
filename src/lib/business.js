import { business } from './businessData.mjs';
export { business };
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
