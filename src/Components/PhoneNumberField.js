import React from 'react';
import { getCountries, getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js/max';
import SelectMenu from './SelectMenu';

const names = new Intl.DisplayNames(['en'], { type: 'region' });
const countries = getCountries().map(code => ({
  value: code, label: `${names.of(code)} (+${getCountryCallingCode(code)})`,
  flag: String.fromCodePoint(...[...code].map(letter => 127397 + letter.charCodeAt(0))),
})).sort((a, b) => a.label.localeCompare(b.label));

export default function PhoneNumberField({ value, country, onChange, disabled, inputClass }) {
  const changeNumber = event => {
    const next = event.target.value;
    // Pasted international numbers select their country without duplicating the prefix.
    const parsed = next.trim().startsWith('+')
      ? parsePhoneNumberFromString(next, { defaultCountry: country, extract: false }) : null;
    if (parsed?.country && parsed.isValid() && !parsed.ext) {
      onChange(parsed.nationalNumber, parsed.country);
    } else {
      onChange(next, country);
    }
  };
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor="inquiry-phone" className="text-sm font-bold uppercase tracking-wider text-gray-500">Phone Number *</label>
      <div className="flex min-w-0 overflow-hidden rounded border border-gray-300 bg-white focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/30">
      <SelectMenu label="Country calling code" value={country} options={countries}
        onChange={next => onChange(value, next)} disabled={disabled} compact searchable />
      <span aria-hidden="true" className="shrink-0 self-center pl-3 text-gray-800">+{getCountryCallingCode(country)}</span>
      <input id="inquiry-phone" name="phone" autoComplete="tel-national" type="tel" inputMode="tel"
        maxLength={25} placeholder="Enter phone number" required disabled={disabled}
        value={value} onChange={changeNumber} aria-describedby="inquiry-phone-help"
        className="w-full min-w-0 border-0 bg-transparent px-3 py-3 text-base outline-none disabled:opacity-50" />
      </div>
      <p id="inquiry-phone-help" className="sr-only">Enter your number for the selected country.</p>
    </div>
  );
}
