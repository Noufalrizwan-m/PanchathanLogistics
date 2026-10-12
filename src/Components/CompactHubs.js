import { useState } from 'react';
import { MapPin, Phone, Navigation } from 'lucide-react';
import { business, directionsUrl } from '../lib/business';

export default function CompactHubs({ branches }) {
  const [selected, setSelected] = useState(0);
  const branch = branches[selected];
  const select = (index, focus = false) => {
    setSelected(index);
    if (focus) document.getElementById(`hub-tab-${index}`)?.focus();
  };
  return <div className="compact-hubs">
    <div className="hub-tabs" role="tablist" aria-label="Regional hubs">
      {branches.map((item, index) => <button key={item.city} id={`hub-tab-${index}`} type="button" role="tab" aria-selected={selected === index} aria-controls="hub-panel" tabIndex={selected === index ? 0 : -1}
        onClick={() => select(index)} onKeyDown={event => {
          const next = event.key === 'ArrowRight' ? (index + 1) % branches.length : event.key === 'ArrowLeft' ? (index - 1 + branches.length) % branches.length : event.key === 'Home' ? 0 : event.key === 'End' ? branches.length - 1 : null;
          if (next !== null) { event.preventDefault(); select(next, true); }
        }}>{item.city}</button>)}
    </div>
    <div id="hub-panel" className="hub-panel" role="tabpanel" aria-labelledby={`hub-tab-${selected}`} tabIndex={0}>
      <div className="hub-title"><h3>{branch.city}</h3>{branch.hq && <span>Head Office</span>}</div>
      <address className="hub-address"><MapPin size={18} aria-hidden="true" /><span>{(branch.addressLines || [branch.address]).map(line => <span className="hub-address-line" key={line}>{line}</span>)}</span></address>
      <div className="hub-actions"><a href={business.phoneHref}><Phone size={16} aria-hidden="true" />Call branch</a><a href={branch.hq ? business.officeMapUrl : directionsUrl(branch.address)} target="_blank" rel="noopener noreferrer"><Navigation size={16} aria-hidden="true" />Directions</a></div>
    </div>
  </div>;
}
