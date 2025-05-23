import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NewTradePage from './page'; // Component to test
import '@testing-library/jest-dom';

// Mock fetch if your component uses it directly (e.g., in handleSubmit)
// For this test, we're primarily checking rendering, but if form submission
// was tested, fetch would need mocking.
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'Success' }),
  })
) as jest.Mock;


describe('NewTradePage (Log New Trade Form)', () => {
  beforeEach(() => {
    // Reset fetch mock before each test if needed
    (global.fetch as jest.Mock).mockClear();
  });

  it('should render the main heading', () => {
    render(<NewTradePage />);
    expect(screen.getByRole('heading', { name: /log new trade/i })).toBeInTheDocument();
  });

  it('should render entry date input field', () => {
    render(<NewTradePage />);
    expect(screen.getByLabelText(/entry date/i)).toBeInTheDocument();
  });

  it('should render exit date input field', () => {
    render(<NewTradePage />);
    expect(screen.getByLabelText(/exit date/i)).toBeInTheDocument();
  });

  it('should render symbol input field', () => {
    render(<NewTradePage />);
    expect(screen.getByLabelText(/symbol/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g., BTCUSD/i)).toBeInTheDocument();
  });

  it('should render direction select field', () => {
    render(<NewTradePage />);
    expect(screen.getByLabelText(/direction/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /direction/i })).toHaveValue('buy');
  });

  it('should render size input field', () => {
    render(<NewTradePage />);
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument();
  });

  it('should render entry price input field', () => {
    render(<NewTradePage />);
    expect(screen.getByLabelText(/entry price/i)).toBeInTheDocument();
  });

  it('should render stop loss input field', () => {
    render(<NewTradePage />);
    // Using a more flexible query for "Stop Loss" label because of "(Optional)" text
    expect(screen.getByText((content, element) => content.startsWith('Stop Loss') && element?.tagName.toLowerCase() === 'label')).toBeInTheDocument();
  });

  it('should render take profit input field', () => {
    render(<NewTradePage />);
    expect(screen.getByText((content, element) => content.startsWith('Take Profit') && element?.tagName.toLowerCase() === 'label')).toBeInTheDocument();
  });
  
  it('should render exit price input field', () => {
    render(<NewTradePage />);
    expect(screen.getByLabelText(/exit price/i)).toBeInTheDocument();
  });

  it('should render the "Log Trade" button', () => {
    render(<NewTradePage />);
    expect(screen.getByRole('button', { name: /log trade/i })).toBeInTheDocument();
  });

  // Basic interaction test (optional, but good to have)
  it('allows typing into the symbol field', () => {
    render(<NewTradePage />);
    const symbolInput = screen.getByLabelText(/symbol/i) as HTMLInputElement;
    fireEvent.change(symbolInput, { target: { value: 'ETHUSD' } });
    expect(symbolInput.value).toBe('ETHUSD');
  });
});
