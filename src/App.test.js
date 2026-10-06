const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  MemoryRouter: ({ children }) => children,
  Link: ({ to, children, ...props }) => require('react').createElement('a', { href: to, ...props }, children),
  useSearchParams: () => [new URLSearchParams()],
  useNavigate: () => mockNavigate,
}), { virtual: true });
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Contact from './Pages/contactus';
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
  global.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
});
const mount = () => render(<HelmetProvider><MemoryRouter><Contact /></MemoryRouter></HelmetProvider>);
function chooseService(name) {
  fireEvent.click(screen.getByLabelText(/Service of Interest/i));
  fireEvent.click(screen.getByRole('option',{name,exact:true}));
}
const countryNames = {IN:'India (+91)',AE:'United Arab Emirates (+971)',GB:'United Kingdom (+44)',US:'United States (+1)',SG:'Singapore (+65)'};
function chooseCountry(country) {
  fireEvent.click(screen.getByLabelText('Country calling code'));
  fireEvent.click(screen.getByRole('option',{name:countryNames[country],exact:true}));
}
function completeForm() {
  fireEvent.change(screen.getByLabelText(/Full Name/i),{target:{value:'Review Test'}});
  fireEvent.change(screen.getByLabelText(/Work Email/i),{target:{value:'review@example.com'}});
  fireEvent.change(screen.getByLabelText(/Phone Number/i),{target:{value:'+91 73394 33590'}});
  chooseService('Air Freight');
  fireEvent.change(screen.getByLabelText(/Message/i),{target:{value:'Please quote for a sample shipment.'}});
}
afterEach(()=>{jest.restoreAllMocks();mockNavigate.mockClear();});
test('contact inputs are labelled and failure preserves inquiry details',async()=>{
  global.fetch=jest.fn().mockResolvedValue({ok:false,json:async()=>({success:false,message:'Online inquiries are temporarily unavailable.'})});
  mount();completeForm();fireEvent.click(screen.getByRole('button',{name:/Submit Enquiry/i}));
  expect(await screen.findByRole('alert')).toHaveTextContent('temporarily unavailable');
  expect(screen.getByLabelText(/Full Name/i)).toHaveValue('Review Test');
  expect(screen.getByRole('link',{name:/Email our team/})).toHaveAttribute('href','mailto:info@panchathanlogistics.com');
});
test('success requires an accepted response and reference',async()=>{
  global.fetch=jest.fn().mockResolvedValue({ok:true,json:async()=>({success:true,reference:'email-test-123'})});
  mount();completeForm();fireEvent.click(screen.getByRole('button',{name:/Submit Enquiry/i}));
  expect(await screen.findByText('Enquiry sent')).toBeInTheDocument();
  expect(screen.queryByText(/email-test-123/)).not.toBeInTheDocument();
  expect(screen.getByRole('dialog',{name:'Enquiry sent'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Done',exact:true}));
  expect(mockNavigate).toHaveBeenCalledWith('/');
  await waitFor(()=>expect(global.fetch).toHaveBeenCalledTimes(1));
});

test('send another enquiry closes the popup and leaves a fresh form',async()=>{
  global.fetch=jest.fn().mockResolvedValue({ok:true,json:async()=>({success:true,reference:'email-test-456'})});
  mount();completeForm();fireEvent.click(screen.getByRole('button',{name:/Submit Enquiry/i}));
  expect(await screen.findByRole('dialog')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Send another enquiry'}));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByLabelText(/Full Name/i)).toHaveValue('');
  expect(screen.getByLabelText('Country calling code')).toHaveTextContent('India (+91)');
  expect(screen.getByLabelText(/Phone Number/i)).toHaveValue('');
  expect(mockNavigate).not.toHaveBeenCalled();
});

test('country selector defaults to India and pasted international numbers select their country',()=>{
  mount();
  expect(screen.getByLabelText('Country calling code')).toHaveTextContent('India (+91)');
  fireEvent.click(screen.getByLabelText('Country calling code'));
  expect(screen.getAllByRole('option').length).toBeGreaterThan(200);
  fireEvent.keyDown(screen.getByLabelText('Search countries'),{key:'Escape'});
  fireEvent.change(screen.getByLabelText(/Phone Number/i),{target:{value:'+44 20 7946 0018'}});
  expect(screen.getByLabelText('Country calling code')).toHaveTextContent('United Kingdom (+44)');
  expect(screen.getByLabelText(/Phone Number/i)).toHaveValue('2079460018');
});

test.each([
  ['IN','73394 33590','+917339433590'],
  ['AE','050 123 4567','+971501234567'],
  ['GB','020 7946 0018','+442079460018'],
  ['US','202 555 0123','+12025550123'],
  ['SG','8123 4567','+6581234567'],
])('valid %s numbers are sent with their international country code',async(country,number,expected)=>{
  global.fetch=jest.fn().mockResolvedValue({ok:false,json:async()=>({message:'Delivery unavailable'})});
  mount();completeForm();
  chooseCountry(country);
  fireEvent.change(screen.getByLabelText(/Phone Number/i),{target:{value:number}});
  fireEvent.click(screen.getByRole('button',{name:/Submit Enquiry/i}));
  await screen.findByRole('alert');
  expect(JSON.parse(global.fetch.mock.calls[0][1].body).phone).toBe(expected);
  expect(screen.getByLabelText('Country calling code')).toHaveTextContent(countryNames[country]);
  expect(screen.getByLabelText(/Phone Number/i)).toHaveValue(number);
});

test.each(['1234567','7339433590012345','Call me at 7339433590'])('invalid phone number %s never calls the enquiry service',async number=>{
  global.fetch=jest.fn();mount();completeForm();
  fireEvent.change(screen.getByLabelText(/Phone Number/i),{target:{value:number}});
  fireEvent.click(screen.getByRole('button',{name:/Submit Enquiry/i}));
  expect(await screen.findByRole('alert')).toHaveTextContent('valid phone number');
  expect(global.fetch).not.toHaveBeenCalled();
});


test('country search supports calling codes, keyboard selection and escape',()=>{
  mount();
  const trigger=screen.getByLabelText('Country calling code');
  fireEvent.click(trigger);
  const search=screen.getByLabelText('Search countries');
  fireEvent.change(search,{target:{value:'+971'}});
  expect(screen.getAllByRole('option')).toHaveLength(1);
  fireEvent.keyDown(search,{key:'Enter'});
  expect(trigger).toHaveTextContent('United Arab Emirates (+971)');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  fireEvent.click(trigger);
  fireEvent.keyDown(screen.getByLabelText('Search countries'),{key:'Escape'});
  expect(trigger).toHaveAttribute('aria-expanded','false');
});

test('service is required before sending and can be selected using the keyboard',async()=>{
  global.fetch=jest.fn();mount();
  fireEvent.change(screen.getByLabelText(/Full Name/i),{target:{value:'Review Test'}});
  fireEvent.change(screen.getByLabelText(/Work Email/i),{target:{value:'review@example.com'}});
  fireEvent.change(screen.getByLabelText(/Phone Number/i),{target:{value:'7339433590'}});
  fireEvent.change(screen.getByLabelText(/Message/i),{target:{value:'Please quote for a sample shipment.'}});
  fireEvent.click(screen.getByRole('button',{name:/Submit Enquiry/i}));
  expect(await screen.findByRole('alert')).toHaveTextContent('choose a service');
  expect(global.fetch).not.toHaveBeenCalled();
  fireEvent.click(screen.getByLabelText(/Service of Interest/i));
  fireEvent.keyDown(screen.getByRole('listbox'),{key:'ArrowDown'});
  fireEvent.keyDown(screen.getByRole('listbox'),{key:'Enter'});
  expect(screen.getByLabelText(/Service of Interest/i)).toHaveTextContent('Air Freight');
});

test('privacy popup closes with OK without navigating or clearing the enquiry',async()=>{
  mount();completeForm();
  const trigger=screen.getByRole('button',{name:'How we use your details'});
  trigger.focus();fireEvent.click(trigger);
  expect(await screen.findByRole('dialog',{name:'Enquiry privacy'})).toBeInTheDocument();
  expect(document.body.style.overflow).toBe('hidden');
  fireEvent.click(screen.getByRole('button',{name:'OK',exact:true}));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByLabelText(/Full Name/i)).toHaveValue('Review Test');
  expect(trigger).toHaveFocus();expect(mockNavigate).not.toHaveBeenCalled();
  expect(document.body.style.overflow).not.toBe('hidden');
});

test('an enquiry can be submitted without a message',async()=>{
  global.fetch=jest.fn().mockResolvedValue({ok:true,json:async()=>({success:true,reference:'optional-test'})});
  mount();completeForm();
  const message=screen.getByLabelText(/Message/i);
  expect(message).not.toBeRequired();
  fireEvent.change(message,{target:{value:''}});
  fireEvent.click(screen.getByRole('button',{name:/Submit Enquiry/i}));
  expect(await screen.findByRole('dialog',{name:'Enquiry sent'})).toBeInTheDocument();
  expect(JSON.parse(global.fetch.mock.calls[0][1].body).message).toBe('');
});
