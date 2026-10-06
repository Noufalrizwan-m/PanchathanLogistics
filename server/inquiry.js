const { createHash } = require('node:crypto');
const nodemailer = require('nodemailer');
const { parsePhoneNumberFromString } = require('libphonenumber-js/max');
const RECIPIENTS = ['info@panchathanlogistics.com', 'sales.panchathanlogistics@gmail.com'];
const SERVICES = new Set(['Air Freight', 'Domestic Surface', 'Warehousing', 'Asset Management', 'International Export', 'General Inquiry']);
const LIMIT = 5;
function validateInquiry(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Please complete the enquiry form.');
  const limits = { name:120, email:254, phone:25, service:80, origin:120, destination:120, weight:120, pickupDate:10, message:5000, website:200, submissionId:100 };
  const clean = {};
  for (const [key, max] of Object.entries(limits)) {
    const value = input[key] ?? '';
    if (typeof value !== 'string' || value.length > max) throw new Error('Please check the length of your enquiry details.');
    clean[key] = value.trim();
  }
  if (clean.website) throw new Error('Your enquiry could not be accepted. Please contact our team directly.');
  if (clean.name.length < 2 || /[\r\n]/.test(clean.name)) throw new Error('Please enter your full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email) || /[\r\n]/.test(clean.email)) throw new Error('Please enter a valid email address.');
  const phone = parsePhoneNumberFromString(clean.phone, { defaultCountry: 'IN', extract: false });
  if (!phone?.isValid() || phone.ext || /^(\d)\1+$/.test(phone.nationalNumber) || !/^[+\d\s().-]+$/.test(clean.phone)) throw new Error('Please enter a valid phone number, including the country code.');
  clean.phone = phone.number;
  if (!SERVICES.has(clean.service)) throw new Error('Please choose a service.');
  if (!/^[\w-]{10,100}$/.test(clean.submissionId)) throw new Error('Please refresh the page and try again.');
  if (clean.pickupDate && (!/^\d{4}-\d{2}-\d{2}$/.test(clean.pickupDate) || !Number.isFinite(Date.parse(clean.pickupDate)))) throw new Error('Please check your pickup date.');
  return clean;
}
function emailPayload(data, from) {
  const lines = [
    'New website enquiry: Panchathan Logistics', '',
    `Name: ${data.name}`, `Email: ${data.email}`, `Phone: ${data.phone}`, `Service: ${data.service === 'General Inquiry' ? 'General Enquiry' : data.service}`,
    `Pickup: ${data.origin || 'Not specified'}`, `Delivery: ${data.destination || 'Not specified'}`,
    `Weight / volume: ${data.weight || 'Not specified'}`, `Preferred pickup: ${data.pickupDate || 'Not specified'}`,
    '', 'Message:', data.message || 'Not provided',
  ];
  return { from, to: RECIPIENTS, replyTo: data.email, subject: `Website enquiry: ${data.service === 'General Inquiry' ? 'General Enquiry' : data.service}`, text: lines.join('\n') };
}
function createInquiryHandler({ env = process.env, transport, now = Date.now } = {}) {
  const attempts = new Map();
  const deliveries = new Map();
  let mailer = transport;
  const getMailer = () => mailer || (mailer = nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD.replace(/\s/g, '') },
    connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 15000,
  }));
  const send = (res, status, data) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(JSON.stringify(data));
  };
  return async function inquiry(req, res) {
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(res,405,{success:false,message:'Use the enquiry form to send your request.'}); }
    const allowed = new Set((env.INQUIRY_ALLOWED_ORIGINS || 'https://panchathanlogistics.com,https://www.panchathanlogistics.com,http://localhost:3000,http://localhost:3002').split(',').map(v=>v.trim()));
    if (req.headers.origin && !allowed.has(req.headers.origin)) return send(res,403,{success:false,message:'Please send your enquiry from our website.'});
    if (!String(req.headers['content-type'] || '').startsWith('application/json')) return send(res,415,{success:false,message:'Please use the website enquiry form.'});
    const time = now();
    for (const [key,value] of attempts) if (time - value.start >= 600000) attempts.delete(key);
    const ip = req.socket?.remoteAddress || 'unknown';
    const key = createHash('sha256').update(ip).digest('hex');
    const usage = attempts.get(key) || {start:time,count:0};
    if (usage.count >= LIMIT) { res.setHeader('Retry-After','600'); return send(res,429,{success:false,message:'Please wait a few minutes before trying again, or email our team directly.'}); }
    usage.count++; attempts.set(key,usage);
    let body;
    try {
      if (req.body !== undefined) {
        const size = Buffer.byteLength(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
        if (size > 20000) throw new Error('Request too large');
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      } else {
        let raw = ''; let bytes = 0;
        for await (const chunk of req) { bytes += Buffer.byteLength(chunk); if (bytes > 20000) throw new Error('Request too large'); raw += chunk; }
        body = JSON.parse(raw);
      }
    } catch { return send(res,400,{success:false,message:'Please check your enquiry and try again.'}); }
    let data;
    try { data = validateInquiry(body); } catch (error) { return send(res,400,{success:false,message:error.message}); }
    if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD) return send(res,503,{success:false,message:'Online enquiries are temporarily unavailable. Please email or call our team directly.'});
    const fingerprint = createHash('sha256').update(JSON.stringify(data)).digest('hex');
    for (const [id, delivery] of deliveries) if (time - delivery.created >= 86400000) deliveries.delete(id);
    try {
      let delivery = deliveries.get(fingerprint);
      if (!delivery) {
        const promise = getMailer().sendMail(emailPayload(data, { name: 'Panchathan Logistics', address: env.GMAIL_USER })).then(result => {
          const accepted = (result.accepted || []).map(address => String(address).toLowerCase());
          if (!result.messageId || !RECIPIENTS.every(address => accepted.includes(address))) throw new Error('Email was not accepted for both recipients');
          return result.messageId;
        });
        delivery = { created: time, promise };
        deliveries.set(fingerprint, delivery);
        promise.catch(() => deliveries.delete(fingerprint));
      }
      const reference = await delivery.promise;
      return send(res,200,{success:true,reference});
    } catch {
      // Never log customer details, credentials, or provider response bodies.
      console.error('Inquiry delivery failed');
      return send(res,502,{success:false,message:'We could not send your enquiry. Please retry or email our team directly.'});
    }
  };
}
module.exports = { createInquiryHandler, validateInquiry, emailPayload, RECIPIENTS };
