import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TradesPage from './page'; // Component to test
import '@testing-library/jest-dom';
import { Trade } from '@/types/trade';

// Mock fetch
const mockTrades: Trade[] = [
  { id: '1', entryDate: '2024-01-01T10:00:00Z', exitDate: '2024-01-01T12:00:00Z', symbol: 'BTCUSD', direction: 'buy', size: 0.1, entryPrice: 50000, exitPrice: 51000, pnl: 100, stopLoss: 49000, takeProfit: 52000 },
  { id: '2', entryDate: '2024-01-02T10:00:00Z', exitDate: '2024-01-02T12:00:00Z', symbol: 'ETHUSD', direction: 'sell', size: 1, entryPrice: 3000, exitPrice: 2900, pnl: 100, stopLoss: 3100, takeProfit: 2800 },
];
const mockStats = {
  totalTrades: 2,
  cumulativePnl: 200,
};

global.fetch = jest.fn((url) => {
  if (url === '/api/trades') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockTrades),
    });
  }
  if (url === '/api/stats') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockStats),
    });
  }
  return Promise.reject(new Error(`Unhandled request: ${url}`));
}) as jest.Mock;


describe('TradesPage (Trade Journal)', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should render the main heading', async () => {
    render(<TradesPage />);
    // Wait for loading to complete if necessary
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /trade journal/i })).toBeInTheDocument();
    });
  });

  it('should display loading state initially', () => {
    render(<TradesPage />);
    expect(screen.getByText(/loading trades.../i)).toBeInTheDocument();
  });
  
  it('should display statistics once loaded', async () => {
    render(<TradesPage />);
    await waitFor(() => {
      expect(screen.getByText(/total trades/i)).toBeInTheDocument();
      expect(screen.getByText(mockStats.totalTrades.toString())).toBeInTheDocument();
      expect(screen.getByText(/cumulative p&l/i)).toBeInTheDocument();
      // P&L formatting might include currency symbols, so check for the number part
      expect(screen.getByText(mockStats.cumulativePnl.toLocaleString(undefined, { style: 'currency', currency: 'USD' }))).toBeInTheDocument();
    });
  });

  it('should display the filter section', async () => {
    render(<TradesPage />);
    await waitFor(() => {
        expect(screen.getByRole('heading', {name: /filter trades/i})).toBeInTheDocument();
        expect(screen.getByLabelText(/symbol/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/entry date start/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/entry date end/i)).toBeInTheDocument();
    });
  });

  it('should display the trades table with fetched data', async () => {
    render(<TradesPage />);
    await waitFor(() => {
      // Check for table headers
      expect(screen.getByRole('columnheader', { name: /symbol/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /p&l/i })).toBeInTheDocument();
      
      // Check for trade data (e.g., symbols from mockTrades)
      expect(screen.getByRole('cell', { name: /btcusd/i })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: /ethusd/i })).toBeInTheDocument();
    });
  });

  it('should display "no trades" message if API returns empty trades array', async () => {
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/api/trades') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) }); // Empty trades
      }
      if (url === '/api/stats') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ totalTrades: 0, cumulativePnl: 0 }) });
      }
      return Promise.reject(new Error(`Unhandled request: ${url}`));
    });

    render(<TradesPage />);
    await waitFor(() => {
      expect(screen.getByText(/no trades found matching your criteria/i)).toBeInTheDocument();
    });
  });

  it('should display error message if fetching trades fails', async () => {
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/api/trades') {
        return Promise.resolve({ ok: false, json: () => Promise.resolve({ message: 'Trades fetch failed' }) });
      }
      // Stats can still succeed or fail, this test focuses on trades failure
      if (url === '/api/stats') { 
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockStats) });
      }
      return Promise.reject(new Error(`Unhandled request: ${url}`));
    });
    render(<TradesPage />);
    await waitFor(() => {
      expect(screen.getByText(/error: trades fetch failed/i)).toBeInTheDocument();
    });
  });

  it('should display error message if fetching stats fails', async () => {
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/api/trades') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockTrades) });
      }
      if (url === '/api/stats') {
        return Promise.resolve({ ok: false, json: () => Promise.resolve({ message: 'Stats fetch failed' }) });
      }
      return Promise.reject(new Error(`Unhandled request: ${url}`));
    });
    render(<TradesPage />);
    await waitFor(() => {
      expect(screen.getByText(/error: stats fetch failed/i)).toBeInTheDocument();
    });
  });

});
