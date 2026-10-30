import { useEffect, useRef, useState } from 'react';

export default function GoogleReviews() {
  const frame = useRef(null);
  const [height, setHeight] = useState(420);

  useEffect(() => {
    const resize = event => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type !== 'panchathan-reviews-height') return;
      const nextHeight = Number(event.data.height);
      if (Number.isFinite(nextHeight) && nextHeight >= 100 && nextHeight <= 4000) {
        setHeight(Math.ceil(nextHeight));
      }
    };
    window.addEventListener('message', resize);
    return () => window.removeEventListener('message', resize);
  }, []);

  return <iframe ref={frame} className="client-reviews block w-full border-0" title="Google reviews of Panchathan Logistics"
    src="/reviews-widget.html" height={height} scrolling="no" />;
}
