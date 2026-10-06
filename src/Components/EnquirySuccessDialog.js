import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2 } from 'lucide-react';

export default function EnquirySuccessDialog({ onDone, onAnother }) {
  const dialog = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const node = dialog.current;
    node.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      node.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, []);
  return createPortal(
    <dialog ref={dialog} aria-labelledby="enquiry-success-title" aria-describedby="enquiry-success-description"
      onCancel={event => { event.preventDefault(); onAnother(); }}
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl backdrop:bg-black/30 backdrop:backdrop-blur-md">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10 text-brand-green"><CheckCircle2 className="h-9 w-9" /></div>
      <h2 id="enquiry-success-title" className="font-sora text-2xl font-bold text-brand-green">Enquiry sent</h2>
      <p id="enquiry-success-description" className="mt-3 text-sm leading-relaxed text-gray-600">Thanks for reaching out. Our team will respond using the contact details you provided.</p>
      <div className="mt-7 flex flex-col gap-3">
        <button autoFocus type="button" onClick={onDone} className="min-h-11 rounded-xl bg-brand-green px-5 py-3 font-semibold text-white hover:bg-brand-green/90">Done</button>
        <button type="button" onClick={onAnother} className="min-h-11 rounded-xl border border-brand-green/25 px-5 py-3 font-semibold text-brand-green hover:bg-brand-green/5">Send another enquiry</button>
      </div>
    </dialog>, document.body
  );
}
