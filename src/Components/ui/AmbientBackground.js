import React from 'react';

const AmbientBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div
      className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full opacity-30 blur-3xl"
      style={{ background: 'radial-gradient(circle, rgba(23,93,41,0.55) 0%, rgba(23,93,41,0) 70%)' }}
    />
    <div
      className="absolute top-1/3 -right-40 w-[40rem] h-[40rem] rounded-full opacity-25 blur-3xl"
      style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.5) 0%, rgba(245,166,35,0) 70%)' }}
    />
    <div
      className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] rounded-full opacity-20 blur-3xl"
      style={{ background: 'radial-gradient(circle, rgba(23,93,41,0.4) 0%, rgba(23,93,41,0) 70%)' }}
    />
  </div>
);

export default AmbientBackground;
