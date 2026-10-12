export function emailError(value) {
  const email = String(value || '').trim();
  if (!email) return 'Please enter your email address.';
  const parts = email.split('@');
  if (parts.length === 1 || (parts.length === 2 && (!parts[1] || !parts[1].includes('.') || parts[1].endsWith('.')))) {
    return 'Please finish your email address, e.g. name@company.com.';
  }
  const [local, domain] = parts;
  const validLocal = local && local.length <= 64 && /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local) && !local.startsWith('.') && !local.endsWith('.') && !local.includes('..');
  const validDomain = domain && domain.split('.').every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label)) && /^[a-z]{2,63}$/i.test(domain.split('.').pop());
  if (email.length > 254 || parts.length !== 2 || !validLocal || !validDomain) {
    return 'Please check your email address, e.g. name@company.com.';
  }
  return '';
}
