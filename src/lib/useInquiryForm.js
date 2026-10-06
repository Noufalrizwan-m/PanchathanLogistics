import { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';

const services = ['Asset Management', 'Air Freight', 'Domestic Surface', 'Warehousing', 'International Export', 'General Inquiry'];
const emptyForm = { name: '', email: '', phone: '', phoneCountry: 'IN', service: '', origin: '', destination: '', weight: '', pickupDate: '', message: '', website: '' };
export default function useInquiryForm() {
  const [params] = useSearchParams();
  const [form, setForm] = useState(() => ({ ...emptyForm, service: services.includes(params.get('service')) ? params.get('service') : '', destination: params.get('destination') || '' }));
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const inFlight = useRef(false);
  const submission = useRef(null);
  const result = useRef(null);
  const update = event => {
    const value = event.target.name === 'email'
      ? event.target.value.toLowerCase()
      : event.target.value;
    setForm(previous => ({ ...previous, [event.target.name]: value }));
    submission.current = null;
    if (status === 'error') setStatus('idle');
  };
  const submit = async event => {
    event.preventDefault();
    if (inFlight.current) return;
    if (!services.includes(form.service)) {
      setError('Please choose a service.'); setStatus('error'); return;
    }
    const phone = parsePhoneNumberFromString(form.phone, { defaultCountry: form.phoneCountry, extract: false });
    const repeatedDigit = phone?.nationalNumber && /^(\d)\1+$/.test(phone.nationalNumber);
    if (!phone?.isValid() || phone.ext || repeatedDigit || !/^\d+$/.test(form.phone)) {
      setError('Enter a valid phone number for the selected country.');
      setStatus('error'); return;
    }
    inFlight.current = true;
    if (!submission.current) submission.current = window.crypto?.randomUUID?.() || `inquiry-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setStatus('loading'); setError('');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(process.env.REACT_APP_INQUIRY_ENDPOINT || '/api/inquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, phone: phone.number, submissionId: submission.current }), signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok || !data.success || !data.reference) throw new Error(data.message || 'Your enquiry could not be sent. Please try again or contact our team directly.');
      setReference(data.reference); setStatus('success'); setForm({ ...emptyForm }); submission.current = null;
      requestAnimationFrame(() => result.current?.focus());
    } catch (err) {
      setError(err.name === 'AbortError' ? 'The request took longer than expected. Please retry with the same details or contact us directly.' : err.message === 'Failed to fetch' || err instanceof SyntaxError ? 'We could not connect to our enquiry service. Please try again or email our team directly.' : err.message);
      setStatus('error');
    } finally { clearTimeout(timeout); inFlight.current = false; }
  };
  return { form, status, error, reference, result, update, submit, setStatus };
}
