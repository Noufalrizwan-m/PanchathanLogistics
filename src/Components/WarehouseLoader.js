import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './WarehouseLoader.css';

// Mounted once per document visit, so internal navigation never repeats the intro.
export default function WarehouseLoader({ onComplete }) {
  const root = useRef(null);
  const counter = useRef(null);
  const progress = useRef(null);
  const finish = useRef(() => {});
  const finishVideo = useRef(() => {});
  const start = useRef(() => {});
  const [settings] = useState(() => ({
    portrait: window.matchMedia('(max-width: 767px)').matches,
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }));

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let complete = false;
    let started = false;
    let pageReady = false;
    let videoFinished = settings.reduced;
    let frame;
    const imageCleanups = [];
    const value = { percent: 1 };
    const paint = () => {
      if (counter.current) counter.current.textContent = String(Math.floor(value.percent)).padStart(2, '0');
      if (progress.current) progress.current.style.transform = `scaleX(${value.percent / 100})`;
    };
    const context = gsap.context(() => {}, root);
    const done = () => {
      if (complete) return;
      complete = true;
      context.add(() => {
        gsap.killTweensOf(value);
        gsap.timeline({ onComplete })
          .to(value, { percent: 100, duration: settings.reduced ? 0 : .18, onUpdate: paint })
          .to(root.current, { opacity: 0, duration: settings.reduced ? 0 : .35, ease: 'power2.inOut' });
      });
    };
    finish.current = done;
    const finishWhenReady = () => {
      if (pageReady && videoFinished) done();
    };
    finishVideo.current = () => {
      videoFinished = true;
      finishWhenReady();
    };
    start.current = duration => {
      if (started || complete) return;
      started = true;
      context.add(() => gsap.to(value, {
        percent: 92, duration: Number.isFinite(duration) && duration > 0 ? duration : 3,
        ease: 'none', onUpdate: paint,
      }));
    };
    // Let React finish layout, then wait for visible eager images and fonts.
    // Below-the-fold lazy assets and third-party widgets do not block the intro.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const images = [...document.querySelectorAll('header img, main img')].filter(image => {
          const rect = image.getBoundingClientRect();
          return image.loading !== 'lazy' && rect.bottom > 0 && rect.top < window.innerHeight;
        });
        const imagePromises = images.map(image => new Promise(resolve => {
          if (image.complete) { resolve(); return; }
          const settled = () => { image.removeEventListener('load', settled); image.removeEventListener('error', settled); resolve(); };
          image.addEventListener('load', settled, { once: true });
          image.addEventListener('error', settled, { once: true });
          imageCleanups.push(settled);
          if (image.complete) settled();
        }));
        Promise.all([...imagePromises, document.fonts?.ready?.catch(() => {}) || Promise.resolve()]).then(() => {
          if (complete) return;
          pageReady = true;
          finishWhenReady();
        });
      });
    });
    // Failed downloads, autoplay restrictions or stalled playback must not block the site.
    const maximum = window.setTimeout(done, settings.reduced ? 3000 : 6000);
    return () => {
      complete = true;
      clearTimeout(maximum);
      cancelAnimationFrame(frame);
      imageCleanups.forEach(cleanup => cleanup());
      context.revert();
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete, settings]);

  return <div ref={root} className="warehouse-loader" role="dialog" aria-modal="true" aria-label="Loading Panchathan Logistics">
    <div className="dispatch-brand"><img src="/logo-480.webp" width="480" height="124" alt="Panchathan Logistics" /></div>
    <button className="dispatch-skip" onClick={() => finish.current()}>Skip intro <span aria-hidden="true">↗</span></button>
    <div className="dispatch-viewport" aria-hidden="true">
      {!settings.reduced && <div className={`dispatch-video-crop ${settings.portrait ? 'is-portrait' : 'is-landscape'}`}>
        <video
          className="dispatch-video"
          src={settings.portrait ? '/asset-packing-portrait.mp4' : '/asset-packing-landscape.mp4'}
          autoPlay muted playsInline preload="auto" controls={false}
          controlsList="nodownload noremoteplayback noplaybackrate"
          disablePictureInPicture disableRemotePlayback
          onPlaying={event => start.current(event.currentTarget.duration)}
          onEnded={() => finishVideo.current()}
          onError={() => finishVideo.current()}
        />
      </div>}
    </div>
    <div className="dispatch-bottom"><div className="dispatch-message"><span>TRUSTED NATIONWIDE LOGISTICS PARTNER</span><p>Delivering confidence.<br />Across every border.</p></div><div className="dispatch-count" aria-hidden="true"><span ref={counter}>01</span><sup>%</sup></div></div>
    <div className="dispatch-progress"><div ref={progress} /></div>
    <span className="sr-only" role="status">Preparing the website…</span>
  </div>;
}
