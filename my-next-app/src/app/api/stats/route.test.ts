import { GET } from './route'; // Assuming your handler is named GET
import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import { Trade } from '@/types/trade';

// Mock fs/promises
jest.mock('fs/promises', () => ({
  access: jest.fn(),
  readFile: jest.fn(),
  writeFile: jest.fn(), // Though not used by GET /stats, good to have if ensureDataFile was more complex
  mkdir: jest.fn(),    // Mock mkdir as it might be part of a shared ensureDataFile pattern
}));

describe('GET /api/stats', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (fs.access as jest.Mock).mockReset();
    (fs.readFile as jest.Mock).mockReset();
    (fs.mkdir as jest.Mock).mockReset().mockResolvedValue(undefined); // Default successful mkdir
  });

  it('should return correct stats when trades.json has data', async () => {
    const mockTrades: Trade[] = [
      { id: '1', symbol: 'BTCUSD', direction: 'buy', entryPrice: 50000, exitPrice: 51000, size: 1, entryDate: 'd1', exitDate: 'd2', pnl: 1000 },
      { id: '2', symbol: 'ETHUSD', direction: 'sell', entryPrice: 3000, exitPrice: 2900, size: 10, entryDate: 'd3', exitDate: 'd4', pnl: 1000 },
      { id: '3', symbol: 'SOLUSD', direction: 'buy', entryPrice: 100, exitPrice: 90, size: 5, entryDate: 'd5', exitDate: 'd6', pnl: -50 },
      { id: '4', symbol: 'ADAUSD', direction: 'buy', entryPrice: 1, exitPrice: 1, size: 1000, entryDate: 'd7', exitDate: 'd8', pnl: 0 },
      { id: '5', symbol: 'DOTUSD', direction: 'buy', entryPrice: 10, exitPrice: 10.5, size: 20, entryDate: 'd9', exitDate: 'd10', pnl: 10 }, // 0.5 * 20 = 10
    ];
    (fs.access as jest.Mock).mockResolvedValue(undefined); // File exists
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockTrades));

    const req = new NextRequest('http://localhost/api/stats');
    const response = await GET(req);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.totalTrades).toBe(5);
    expect(responseBody.cumulativePnl).toBe(2000 - 50 + 10); // 1000 + 1000 - 50 + 0 + 10 = 1960
  });

  it('should return zero stats when trades.json is empty', async () => {
    (fs.access as jest.Mock).mockResolvedValue(undefined); // File exists
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify([])); // Empty array in file

    const req = new NextRequest('http://localhost/api/stats');
    const response = await GET(req);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.totalTrades).toBe(0);
    expect(responseBody.cumulativePnl).toBe(0);
  });

  it('should return zero stats if trades.json does not exist', async () => {
    (fs.access as jest.Mock).mockRejectedValueOnce({ code: 'ENOENT' }); // Simulate file not found

    // The readTrades in stats/route.ts is specifically designed to return [] on ENOENT
    // and not attempt to create the file.

    const req = new NextRequest('http://localhost/api/stats');
    const response = await GET(req);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.totalTrades).toBe(0);
    expect(responseBody.cumulativePnl).toBe(0);
    expect(fs.readFile).not.toHaveBeenCalled(); // readFile shouldn't be called if access fails and it's ENOENT
  });

  it('should return zero stats and log error if trades.json content is invalid JSON', async () => {
    (fs.access as jest.Mock).mockResolvedValue(undefined); // File exists
    (fs.readFile as jest.Mock).mockResolvedValueOnce("{invalid json'"); // Malformed JSON
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error

    const req = new NextRequest('http://localhost/api/stats');
    const response = await GET(req);
    const responseBody = await response.json();

    expect(response.status).toBe(200); // API returns 0 stats for bad JSON
    expect(responseBody.totalTrades).toBe(0);
    expect(responseBody.cumulativePnl).toBe(0);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error reading trades.json for stats:', expect.any(SyntaxError));
    consoleErrorSpy.mockRestore();
  });

  it('should return 500 if readFile throws an unexpected error (not ENOENT or JSON parse)', async () => {
    (fs.access as jest.Mock).mockResolvedValue(undefined); // File exists
    (fs.readFile as jest.Mock).mockRejectedValueOnce(new Error('Some other FS error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error for the main handler

    const req = new NextRequest('http://localhost/api/stats');
    const response = await GET(req);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.message).toBe('Error calculating trade statistics');
    expect(responseBody.error).toBe('Some other FS error');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to calculate trade statistics:', new Error('Some other FS error'));
    consoleErrorSpy.mockRestore();
  });

  it('should correctly sum P&L values, including negatives and non-integers', async () => {
    const mockTrades: Partial<Trade>[] = [ // Using Partial as other fields are not relevant for this test
      { pnl: 100.50 },
      { pnl: -25.25 },
      { pnl: 10 },
      { pnl: undefined }, // Should be skipped
      { pnl: 0 },
      { pnl: 0.75 },
    ];
    (fs.access as jest.Mock).mockResolvedValue(undefined);
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockTrades));

    const req = new NextRequest('http://localhost/api/stats');
    const response = await GET(req);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.totalTrades).toBe(mockTrades.length);
    // 100.50 - 25.25 + 10 + 0 + 0.75 = 86.00
    expect(responseBody.cumulativePnl).toBe(86.00); 
  });
});
