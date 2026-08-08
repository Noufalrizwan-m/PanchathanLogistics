import React from 'react';

const MarqueeStrip = ({ items, className = '' }) => {
  const track = (keyPrefix) => (
    <div className="flex items-center shrink-0">
      {items.map((item, i) => (
        <React.Fragment key={`${keyPrefix}-${i}`}>
          <span className="px-6 text-sm md:text-base font-bold uppercase tracking-widest whitespace-nowrap">
            {item}
          </span>
          <span className="text-brand-amber text-base">◆</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="flex w-max hover:[animation-play-state:paused] group">
        <div className="flex shrink-0 [animation:marquee_28s_linear_infinite] group-hover:[animation-play-state:paused]">
          {track('a')}
          {track('b')}
        </div>
      </div>
    </div>
  );
};

export default MarqueeStrip;
