import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export default function ConnectionNotice() {
  const [offline, setOffline] = useState(() => !navigator.onLine);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    update();
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  if (!offline) return null;
  return (
    <div role="status" className="fixed bottom-4 left-4 right-4 z-[90] mx-auto flex max-w-lg items-start gap-3 rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-xl sm:bottom-6">
      <WifiOff aria-hidden="true" size={20} className="mt-0.5 shrink-0 text-amber-700" />
      <p><strong className="block text-gray-900">You’re offline</strong>Reconnect to use tracking and send enquiries.</p>
    </div>
  );
}
