let mockQuery = '';
jest.mock('react-router-dom', () => ({
  useSearchParams: () => [new URLSearchParams(mockQuery), jest.fn()],
}), { virtual: true });
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import Tracking from './tracking';
import axios from 'axios';

beforeAll(() => {
  window.scrollTo = jest.fn();
  window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
  global.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
});
beforeEach(() => {
  mockQuery = '';
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ status: 'failed', data: [] }) });
});
const mount = () => render(<HelmetProvider><Tracking /></HelmetProvider>);

test('the prefix is fixed and only remaining digits are entered', () => {
  mount();
  const input = screen.getByLabelText('AWB remaining number');
  expect(screen.getByText('PL786', { selector: 'label' })).toBeInTheDocument();
  expect(input).toHaveValue('');
  expect(input).toHaveAttribute('inputmode', 'numeric');
  expect(screen.getByRole('button', { name: 'Track shipment' })).toBeDisabled();
  fireEvent.change(input, { target: { value: '12345' } });
  expect(input).toHaveValue('12345');
  expect(screen.getByRole('button', { name: 'Track shipment' })).toBeEnabled();
  fireEvent.change(input, { target: { value: '' } });
  expect(screen.getByText('PL786', { selector: 'label' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Track shipment' })).toBeDisabled();
  expect(global.fetch).not.toHaveBeenCalled();
});

test('a pasted full AWB strips the prefix and submits the full normalized number', async () => {
  mount();
  const input = screen.getByLabelText('AWB remaining number');
  fireEvent.paste(input, { clipboardData: { getData: () => 'pl78612345' } });
  expect(input).toHaveValue('12345');
  fireEvent.click(screen.getByRole('button', { name: 'Track shipment' }));
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toEqual(['PL78612345']);
  expect(await screen.findByRole('alert')).toHaveTextContent('Check the number on your booking receipt');
});

test('a wrong pasted prefix is rejected before any tracking request', () => {
  mount();
  const input = screen.getByLabelText('AWB remaining number');
  fireEvent.change(input, { target: { value: '12345' } });
  fireEvent.paste(input, { clipboardData: { getData: () => 'WRONG12345' } });
  expect(input).toHaveValue('');
  expect(screen.getByText(/Enter only the remaining digits/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Track shipment' })).toBeDisabled();
  fireEvent.submit(input.closest('form'));
  expect(global.fetch).not.toHaveBeenCalled();
});

test('a wrong prefix supplied in the URL is blocked before any API request', () => {
  mockQuery = 'awb=WRONG12345';
  mount();
  expect(screen.getByText(/AWB numbers must start with PL786/)).toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});

test('proof of delivery loads once and releases its image when leaving tracking', async () => {
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({ status: 'success', data: [{
    invoice_no: 'PL78612345', Origin: 'Chennai', details: [{ wh_storage_location_name: 'Kolkata', total_carton: 1 }],
    summary: [{ opr_mode: 'DELIVERED', transit_date: '2026-10-12', transit_time: '10:00:00', dest_point: 'Kolkata' }],
  }] }) });
  const podRequest = jest.spyOn(axios, 'get').mockResolvedValue({ data: { status: 'success', data: 'data:image/png;base64,aGVsbG8=' } });
  const originalCreate = URL.createObjectURL, originalRevoke = URL.revokeObjectURL;
  URL.createObjectURL = jest.fn(() => 'blob:pod-test');
  URL.revokeObjectURL = jest.fn();
  try {
    const { unmount } = mount();
    fireEvent.change(screen.getByLabelText('AWB remaining number'), { target: { value: '12345' } });
    fireEvent.click(screen.getByRole('button', { name: 'Track shipment' }));
    expect(await screen.findByRole('button', { name: 'View POD' })).toBeInTheDocument();
    expect(podRequest).toHaveBeenCalledTimes(1);
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:pod-test');
    expect(podRequest.mock.calls[0][1].signal.aborted).toBe(true);
  } finally {
    podRequest.mockRestore();
    URL.createObjectURL = originalCreate; URL.revokeObjectURL = originalRevoke;
  }
});
