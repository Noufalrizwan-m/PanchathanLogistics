jest.mock('react-router-dom', () => ({
  useSearchParams: () => [new URLSearchParams('awb=PL78652031'), jest.fn()],
}), { virtual: true });
jest.mock('../lib/shipmentApi', () => ({ shipmentRequest: jest.fn() }));
import { render, screen, within } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import Tracking from './tracking';
import { shipmentRequest } from '../lib/shipmentApi';

beforeAll(() => {
  window.scrollTo = jest.fn();
  global.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
});

const shipment = {
  invoice_no: 'PL78652031', current_status: 'IN_TRANSIT', transit_type_name: 'SURFACE',
  Origin: 'CHENNAI-HO', dest_point: 'KARUR COLLECTORATE', total_carton: 1, total_weight: 4,
  summary: [
    { opr_mode: 'BOOKED', dest_point: 'CHENNAI-HO', transit_date: '28-04-2026', transit_time: '12:26:06' },
    { opr_mode: 'IN_TRANSIT', dest_point: 'KARUR-HO', transit_date: '28-04-2026', transit_time: '14:21:27' },
  ],
};

test('reference layout preserves shipment details and orders the latest history first', async () => {
  shipmentRequest.mockResolvedValue({ status: 'success', data: [shipment] });
  render(<HelmetProvider><Tracking /></HelmetProvider>);
  const result = await screen.findByRole('region', { name: 'Shipment tracking result' });
  expect(within(result).getByRole('heading', { name: 'PL78652031' })).toBeInTheDocument();
  expect(within(result).getByText('KARUR COLLECTORATE')).toBeInTheDocument();
  expect(within(result).getByText('4 kg')).toBeInTheDocument();
  const steps = within(within(result).getByRole('list', { name: 'Shipment progress' })).getAllByRole('listitem');
  expect(steps).toHaveLength(5);
  expect(steps[1]).toHaveAttribute('aria-current', 'step');
  expect(within(result).getByText('KARUR-HO').compareDocumentPosition(within(result).getByText('CHENNAI-HO', { selector: 'p.text-sm' })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test('a pickup event is still represented in shipment progress', async () => {
  shipmentRequest.mockResolvedValue({ status: 'success', data: [{ ...shipment,
    summary: [shipment.summary[0], { ...shipment.summary[1], opr_mode: 'PICKED_UP' }],
  }] });
  render(<HelmetProvider><Tracking /></HelmetProvider>);
  const progress = await screen.findByRole('list', { name: 'Shipment progress' });
  expect(within(progress).getAllByRole('listitem')).toHaveLength(6);
  expect(within(progress).getByText('Picked Up').closest('li')).toHaveAttribute('aria-current', 'step');
});

test('nested API details and event descriptions supply the correct destination and history', async () => {
  shipmentRequest.mockResolvedValue({ status: 'success', data: [{
    details: [{ invoice_no: 'PL78652031', Origin: 'CHENNAI-HO', wh_storage_location_name: 'KARUR COLLECTORATE', transit_type_name: 'SURFACE', total_weight: '4.00', total_carton: '1' }],
    summary: [
      { ...shipment.summary[1], opr_mode: 'FWD', curr_status: 'PROCESSED & FORWARDED TO DESTINATION' },
      { ...shipment.summary[0], opr_mode: 'FWD', curr_status: 'SHIPMENT BOOKED', src_point: 'BRANCH' },
    ],
  }] });
  render(<HelmetProvider><Tracking /></HelmetProvider>);
  const result = await screen.findByRole('region', { name: 'Shipment tracking result' });
  expect(within(result).getByText('KARUR COLLECTORATE')).toBeInTheDocument();
  expect(within(result).getByText('4.00 kg')).toBeInTheDocument();
  expect(within(result).getAllByText('Booked')).toHaveLength(2);
  const current = within(result).getByText('KARUR-HO');
  const booked = within(result).getByText('CHENNAI-HO', { selector: 'p.text-sm' });
  expect(current.compareDocumentPosition(booked) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
