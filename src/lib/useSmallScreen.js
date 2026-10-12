import { useEffect, useState } from 'react';

export default function useSmallScreen() {
  const [small, setSmall] = useState(() => typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 1023px)').matches);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(max-width: 1023px)');
    const update = () => setSmall(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return small;
}
