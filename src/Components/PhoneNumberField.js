import React from 'react';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js/max';
import metadata from 'libphonenumber-js/metadata.max';
import SelectMenu from './SelectMenu';

const names = new Intl.DisplayNames(['en'], { type: 'region' });
const getMaxPhoneDigits = country => {
  const countryMetadata = metadata.countries[country];
  // Prefer mobile-number lengths. The general country metadata also contains
  // short service and landline formats (India, for example, can list 13),
  // but this form collects ordinary customer mobile numbers.
  const mobileLengths = countryMetadata?.[11]?.[1]?.[1];
  const possibleLengths = mobileLengths || countryMetadata?.[3] || [15];
  // The field accepts the usual national trunk prefix (for example, 0 in
  // the UK), while libphonenumber's possible lengths exclude that prefix.
  const trunkPrefixLength = country === 'IN' ? 0 : (countryMetadata?.[5] ? 1 : 0);
  return Math.max(...possibleLengths) + trunkPrefixLength;
};
const countries = getCountries().map(code => ({
  value: code, label: `${names.of(code)} (+${getCountryCallingCode(code)})`,
  flag: String.fromCodePoint(...[...code].map(letter => 127397 + letter.charCodeAt(0))),
})).sort((a, b) => a.label.localeCompare(b.label));

export default function PhoneNumberField({ value, country, onChange, disabled, inputClass }) {
  const changeNumber = event => {
    // The country selector supplies the international code, so this field only
    // needs the national number. Keep pasted and typed values numeric as well.
    onChange(event.target.value.replace(/\D/g, '').slice(0, getMaxPhoneDigits(country)), country);
  };
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor="inquiry-phone" className="text-sm font-bold uppercase tracking-wider text-gray-500">Phone Number *</label>
      <div className="flex min-w-0 overflow-hidden rounded border border-gray-300 bg-white focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/30">
      <SelectMenu label="Country calling code" value={country} options={countries}
        onChange={next => onChange(value.slice(0, getMaxPhoneDigits(next)), next)} disabled={disabled} compact searchable />
      <span aria-hidden="true" className="shrink-0 self-center pl-3 text-gray-800">+{getCountryCallingCode(country)}</span>
      <input id="inquiry-phone" name="phone" autoComplete="tel-national" type="tel" inputMode="numeric"
        pattern="[0-9]*"
        maxLength={getMaxPhoneDigits(country)} placeholder="Enter phone number" required disabled={disabled}
        value={value} onChange={changeNumber} aria-describedby="inquiry-phone-help"
        className="w-full min-w-0 border-0 bg-transparent px-3 py-3 text-base outline-none disabled:opacity-50" />
      </div>
      <p id="inquiry-phone-help" className="sr-only">Enter your number for the selected country.</p>
    </div>
  );
}
