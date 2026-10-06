import React, { useEffect, useLayoutEffect, useRef, useState, useId } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search } from 'lucide-react';

export default function SelectMenu({ id, labelId, label, value, options, onChange, disabled, placeholder, compact = false, searchable = false }) {
  const menuId = useId();
  const trigger = useRef(null);
  const menu = useRef(null);
  const search = useRef(null);
  const list = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState(null);
  const selected = options.find(option => option.value === value);
  const filtered = options.filter(option => option.label.toLowerCase().includes(query.toLowerCase()));
  const close = () => { setOpen(false); trigger.current?.focus({ preventScroll: true }); };
  const choose = option => { onChange(option.value); close(); };
  const selectExactCallingCode = () => {
    const normalized = query.trim().replace(/^\+/, '');
    if (!normalized || !/^\d+$/.test(normalized)) return;
    const exact = filtered.filter(option => option.label.match(new RegExp(`\\(\\+${normalized}\\)$`)));
    if (exact.length === 1) choose(exact[0]);
  };

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = trigger.current.getBoundingClientRect();
      const height = window.visualViewport?.height || window.innerHeight;
      const width = window.visualViewport?.width || window.innerWidth;
      const below = height - rect.bottom - 12;
      const above = rect.top - 12;
      const upwards = below < 240 && above > below;
      setPosition({
        left: Math.max(12, Math.min(rect.left, width - Math.min(compact ? 320 : rect.width, width - 24) - 12)),
        width: Math.min(compact ? 320 : rect.width, width - 24),
        maxHeight: Math.max(100, Math.min(320, upwards ? above - 8 : below - 8)),
        ...(upwards ? { bottom: height - rect.top + 8 } : { top: rect.bottom + 8 }),
      });
    };
    place();
    window.addEventListener('resize', place);
    window.visualViewport?.addEventListener('resize', place);
    return () => {
      window.removeEventListener('resize', place);
      window.visualViewport?.removeEventListener('resize', place);
    };
  }, [open, compact]);

  useEffect(() => {
    if (!open || !position) return;
    if (searchable) search.current?.focus({ preventScroll: true });
    else list.current?.focus({ preventScroll: true });
    const outside = event => {
      if (!menu.current?.contains(event.target) && !trigger.current?.contains(event.target)) setOpen(false);
    };
    const scroll = event => { if (!menu.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    window.addEventListener('scroll', scroll, true);
    return () => { document.removeEventListener('pointerdown', outside); window.removeEventListener('scroll', scroll, true); };
  }, [open, position, searchable]);

  useEffect(() => {
    if (open) document.getElementById(`${menuId}-${active}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [active, open, menuId, position]);

  const keyDown = event => {
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    else if (event.key === 'Tab') setOpen(false);
    else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setActive(previous => Math.max(0, Math.min(filtered.length - 1, previous + (event.key === 'ArrowDown' ? 1 : -1))));
    } else if (event.key === 'Enter' && filtered[active]) { event.preventDefault(); choose(filtered[active]); }
    else if (!searchable && (event.key === 'Home' || event.key === 'End')) {
      event.preventDefault(); setActive(event.key === 'Home' ? 0 : filtered.length - 1);
    }
  };
  const show = () => {
    setQuery(''); setActive(Math.max(0, options.findIndex(option => option.value === value))); setOpen(true);
  };
  return <>
    <button ref={trigger} id={id} type="button" role="combobox" aria-label={label}
      aria-labelledby={labelId} aria-expanded={open} aria-controls={open ? menuId : undefined}
      aria-haspopup="listbox" disabled={disabled} onClick={() => open ? close() : show()}
      onKeyDown={event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); show(); } }}
      className={compact
        ? 'flex shrink-0 items-center justify-center gap-1 border-r border-gray-200 bg-gray-50 px-3 py-3 rounded-l focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-green disabled:opacity-50'
        : 'flex w-full min-w-0 items-center justify-between gap-2 rounded border border-gray-300 bg-white px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green disabled:opacity-50'}>
      {compact ? <span aria-hidden="true" className="text-xl leading-none">{selected?.flag}</span>
        : <span className={`truncate ${selected ? 'text-gray-800' : 'text-gray-400'}`}>{selected?.label || placeholder}</span>}
      <ChevronDown aria-hidden="true" size={compact ? 14 : 18} className="shrink-0 text-gray-500" />
      {compact && <span className="sr-only">{selected?.label}</span>}
    </button>
    {open && position && createPortal(
      <div ref={menu} tabIndex={-1} onKeyDown={keyDown} style={position}
        className="fixed z-[100] flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl outline-none">
        {searchable && <div className="flex shrink-0 items-center gap-2 border-b border-gray-100 px-3 py-2">
          <Search size={16} aria-hidden="true" className="text-gray-400" />
          <input ref={search} aria-label="Search countries" role="combobox" aria-autocomplete="list"
            aria-controls={menuId} aria-expanded="true" aria-activedescendant={filtered[active] ? `${menuId}-${active}` : undefined}
            value={query} onChange={event => { setQuery(event.target.value); setActive(0); }}
            onBlur={selectExactCallingCode}
            placeholder="Search country or code" className="w-full min-w-0 py-2 text-base outline-none" />
        </div>}
        <div ref={list} id={menuId} role="listbox" aria-label={label} tabIndex={-1}
          aria-activedescendant={!searchable && filtered[active] ? `${menuId}-${active}` : undefined}
          className="min-h-0 overflow-y-auto overscroll-contain p-1 outline-none">
          {filtered.map((option, index) => <button key={option.value} id={`${menuId}-${index}`} type="button"
            role="option" aria-selected={value === option.value} tabIndex={-1} onClick={() => choose(option)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm ${index === active ? 'bg-green-50' : 'hover:bg-gray-50'} ${value === option.value ? 'font-semibold text-brand-green' : 'text-gray-700'}`}>
            {option.flag && <span aria-hidden="true" className="shrink-0 text-xl">{option.flag}</span>}
            <span className="min-w-0 flex-1">{option.label}</span>
            {value === option.value && <Check size={16} aria-hidden="true" className="shrink-0" />}
          </button>)}
          {!filtered.length && <p className="px-3 py-4 text-sm text-gray-500">No countries found.</p>}
        </div>
      </div>, document.body)}
  </>;
}
