import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, CheckCircle2, ArrowDown } from 'lucide-react';
import { gsap } from 'gsap';

export default function CompactServices({ services, onForms }) {
  const { hash } = useLocation();
  const [open, setOpen] = useState(hash.slice(1) || services[0].id);
  const root = useRef(null);
  const clicked = useRef(null);
  const toggle = (event, id) => {
    clicked.current = { button: event.currentTarget, top: event.currentTarget.getBoundingClientRect().top };
    setOpen(open === id ? null : id);
  };
  useLayoutEffect(() => {
    if (!clicked.current) return;
    const { button, top } = clicked.current;
    const shift = button.getBoundingClientRect().top - top;
    if (Math.abs(shift) > 1) window.scrollBy({ top: shift, behavior: 'instant' });
    clicked.current = null;
  }, [open]);
  useEffect(() => { if (services.some(service => service.id === hash.slice(1))) setOpen(hash.slice(1)); }, [hash, services]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = gsap.context(() => {
      const content = root.current.querySelector('[data-open-content]');
      if (content) gsap.fromTo(content, { x: 12, opacity: 0.5 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out', clearProps: 'transform,opacity' });
    }, root.current);
    return () => context.revert();
  }, [open]);
  return <div ref={root} className="compact-services">
    {services.map((service) => <div key={service.id} id={service.id} className={`compact-service ${open === service.id ? 'is-open' : ''}`}>
      <h3><button type="button" aria-expanded={open === service.id} aria-controls={`service-panel-${service.id}`} onClick={event => toggle(event, service.id)}>
        <service.icon size={22} aria-hidden="true" /><span>{service.name}</span><ChevronDown size={18} aria-hidden="true" />
      </button></h3>
      <div id={`service-panel-${service.id}`} hidden={open !== service.id}>
        {open === service.id && <div data-open-content className="compact-service-content">
          <p>{service.desc}</p>
          {service.bullets && <ul>{service.bullets.map(bullet => <li key={bullet}><CheckCircle2 size={15} aria-hidden="true" />{bullet}</li>)}</ul>}
          {service.formsLink && <button type="button" onClick={onForms}>Browse customs forms <ArrowDown size={16} /></button>}
        </div>}
      </div>
    </div>)}
  </div>;
}
