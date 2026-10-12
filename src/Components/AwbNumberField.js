import { useState } from 'react';

const PREFIX = 'PL786';

export default function AwbNumberField({ value, onChange, id, ...props }) {
  const [pasteError, setPasteError] = useState('');
  const suffix = value.startsWith(PREFIX) ? value.slice(PREFIX.length) : '';
  const update = raw => {
    const text = raw.trim().toUpperCase();
    const remaining = text.startsWith(PREFIX) ? text.slice(PREFIX.length) : text;
    if (!/^\d*$/.test(remaining)) {
      onChange(PREFIX);
      setPasteError('Enter only the remaining digits, or paste an AWB starting with PL786.');
      return;
    }
    setPasteError('');
    onChange(PREFIX + remaining.slice(0, 75));
  };
  return <div className="awb-number-field">
    <div className="awb-number-entry">
      <label htmlFor={id} className="awb-fixed-prefix">{PREFIX}</label>
      <input {...props} id={id} value={suffix} onChange={event => update(event.target.value)}
        onPaste={event => { event.preventDefault(); update(event.clipboardData.getData('text')); }}
        type="text" inputMode="numeric" pattern="[0-9]+" maxLength={75} placeholder="XXXXX"
        aria-invalid={Boolean(pasteError) || props['aria-invalid']}
        aria-describedby={[props['aria-describedby'], pasteError ? `${id}-paste-error` : ''].filter(Boolean).join(' ')} />
    </div>
    {pasteError && <span id={`${id}-paste-error`} className="awb-paste-error" role="status">{pasteError}</span>}
  </div>;
}
