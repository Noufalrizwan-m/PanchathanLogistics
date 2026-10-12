const AWB_PREFIX = 'PL786';

export function inspectAwb(value) {
  const normalized = String(value || '').trim().toUpperCase();
  const complete = /^PL786[0-9]+$/.test(normalized);
  const wrongPrefix = normalized && !AWB_PREFIX.startsWith(normalized) && !normalized.startsWith(AWB_PREFIX);
  const error = wrongPrefix
    ? 'AWB numbers must start with PL786. Check the number on your booking receipt.'
    : normalized === AWB_PREFIX ? 'Enter the remaining part of your AWB number after PL786.'
    : normalized.startsWith(AWB_PREFIX) && !complete ? 'Enter only the digits after PL786.' : null;
  return { normalized, complete, error };
}
