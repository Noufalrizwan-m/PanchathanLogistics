const API_BASE = 'https://panchathanlogistics.com/billing_php/index.php';
export async function shipmentRequest(endpoint, payload, signal) {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal?.addEventListener('abort', cancel, { once: true });
  const timeout = setTimeout(cancel, 15000);
  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), signal: controller.signal,
    });
    if (!response.ok) throw new Error('The shipment service is temporarily unavailable. Please try again or contact our team.');
    const data = await response.json();
    if (!data || typeof data !== 'object') throw new Error('Invalid response');
    return data;
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error('We could not connect to the shipment service. Please try again or call +91 73394 33590.');
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', cancel);
  }
}
