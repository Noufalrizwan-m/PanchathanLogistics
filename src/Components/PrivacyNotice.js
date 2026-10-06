import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export function PrivacyDetails() {
  return <p className="text-sm leading-relaxed text-gray-600">We use the contact and shipment details you provide to respond to your enquiry and arrange requested logistics services. Your enquiry is sent to our business inboxes. Please do not include payment details, passwords, or identity documents. For questions about your enquiry or a request to remove it, email <a className="break-all underline text-brand-green" href="mailto:info@panchathanlogistics.com">info@panchathanlogistics.com</a>.</p>;
}

function PrivacyDialog({ onClose, returnFocusTo }) {
  const dialog = useRef(null);
  useEffect(() => {
    const previousFocus = returnFocusTo;
    const previousOverflow = document.body.style.overflow;
    const node = dialog.current;
    node.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      node.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, [returnFocusTo]);
  return createPortal(
    <dialog ref={dialog} aria-labelledby="privacy-notice-title"
      onCancel={event => { event.preventDefault(); onClose(); }}
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 text-left shadow-2xl backdrop:bg-black/30 backdrop:backdrop-blur-md">
      <h2 id="privacy-notice-title" className="mb-4 text-2xl font-bold text-brand-green">Enquiry privacy</h2>
      <PrivacyDetails />
      <button autoFocus type="button" onClick={onClose} className="mt-6 min-h-11 w-full rounded-xl bg-brand-green px-5 py-3 font-semibold text-white hover:bg-brand-green/90">OK</button>
    </dialog>, document.body
  );
}

export default function PrivacyNotice({ children, className }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  return <>
    <button ref={trigger} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className={className}>{children}</button>
    {open && <PrivacyDialog onClose={() => setOpen(false)} returnFocusTo={trigger.current} />}
  </>;
}
