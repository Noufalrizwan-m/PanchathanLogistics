import { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { emailError } from '../lib/emailFormat';

export default function EmailField({ value, onChange, disabled, inputClass }) {
  const [touched, setTouched] = useState(false);
  const input = useRef(null);
  const error = emailError(value);
  const showError = (touched || Boolean(value)) && Boolean(error);
  useEffect(() => { input.current?.setCustomValidity(error); }, [error]);
  useEffect(() => { if (disabled) setTouched(false); }, [disabled]);
  return <div className="flex min-w-0 flex-col gap-2">
    <label htmlFor="inquiry-email" className="text-sm font-bold uppercase tracking-wider text-gray-500">Work Email *</label>
    <input ref={input} id="inquiry-email" name="email" autoComplete="email" maxLength={254} type="email" inputMode="email" autoCapitalize="none" autoCorrect="off" spellCheck={false}
      placeholder="john@company.com" required disabled={disabled} value={value}
      onChange={event => onChange(event.target.value)} onBlur={() => { setTouched(true); if (value !== value.trim()) onChange(value.trim()); }} onInvalid={() => setTouched(true)}
      aria-invalid={showError} aria-describedby="inquiry-email-help"
      className={`${inputClass} ${showError ? 'border-red-300' : ''}`} />
    <p id="inquiry-email-help" aria-live="polite" className={`flex items-start gap-1.5 text-xs leading-relaxed ${showError ? 'text-red-700' : value && !error ? 'text-brand-green' : 'text-gray-500'}`}>
      {showError ? <AlertCircle size={14} className="shrink-0 mt-0.5" aria-hidden="true" /> : value && !error ? <CheckCircle2 size={14} className="shrink-0 mt-0.5" aria-hidden="true" /> : null}
      <span>{showError ? error : value && !error ? 'Email format looks correct.' : 'Enter the email address where we can reply.'}</span>
    </p>
  </div>;
}
