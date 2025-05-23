import { POST, GET as GET_TRADES } from './route'; // Assuming your handler is named POST
import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import { Trade } from '@/types/trade';

// Mock fs/promises
jest.mock('fs/promises', () => ({
  access: jest.fn(),
  readFile: jest.fn(),
  writeFile: jest.fn(),
  mkdir: jest.fn(), // Mock mkdir as it's used in ensureDataFile
}));

// Mock crypto.randomUUID
const mockRandomUUID = 'test-uuid-123';
global.crypto = {
  ...global.crypto,
  randomUUID: jest.fn(() => mockRandomUUID),
};

// Mock calculatePnl to isolate API logic if needed, or use the real one
// For now, we'll use the real one as it's already tested, but this is an option:
// jest.mock('@/lib/calculations', () => ({
//   calculatePnl: jest.fn(() => 100), // Always returns 100 for simplicity in this mock
// }));


describe('POST /api/trades', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (fs.access as jest.Mock).mockReset();
    (fs.readFile as jest.Mock).mockReset();
    (fs.writeFile as jest.Mock).mockReset();
    (fs.mkdir as jest.Mock).mockResolvedValue(undefined); // Default successful mkdir
    (global.crypto.randomUUID as jest.Mock).mockClear();
  });

  it('should log a new trade successfully with valid data', async () => {
    // Arrange
    const validTradePayload = {
      entryDate: '2024-01-01T10:00:00Z',
      exitDate: '2024-01-01T12:00:00Z',
      symbol: 'BTCUSD',
      direction: 'buy' as 'buy' | 'sell',
      size: 0.1,
      entryPrice: 50000,
      exitPrice: 51000,
      stopLoss: 49000,
      takeProfit: 52000,
    };
    const req = new NextRequest('http://localhost/api/trades', {
      method: 'POST',
      body: JSON.stringify(validTradePayload),
      headers: { 'Content-Type': 'application/json' },
    });

    // Mock file system interactions
    (fs.access as jest.Mock).mockRejectedValueOnce(new Error('ENOENT')); // File doesn't exist initially
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify([])); // Initial empty trades list
    (fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined); // Successful write

    // Act
    const response = await POST(req);
    const responseBody = await response.json();

    // Assert
    expect(response.status).toBe(201);
    expect(responseBody.message).toBe('Trade logged successfully');
    expect(responseBody.trade).toBeDefined();
    expect(responseBody.trade.id).toBe(mockRandomUUID);
    expect(responseBody.trade.symbol).toBe(validTradePayload.symbol);
    expect(responseBody.trade.pnl).toBe(100); // (51000 - 50000) * 0.1 = 100

    // Check if writeFile was called correctly
    expect(fs.writeFile).toHaveBeenCalledTimes(1); // Once for initial creation, once for new trade
    const expectedWriteArgs = JSON.stringify([responseBody.trade], null, 2);
    // fs.writeFile is called twice, first for ensureDataFile (empty array), then with the new trade
    // Check the arguments of the second call to fs.writeFile
     const secondCallArgs = (fs.writeFile as jest.Mock).mock.calls[0]; // This might be the first call (empty array if file didn't exist)
                                                                      // or the only call if file existed.
                                                                      // Let's check the last call to be sure.
    const lastWriteCallArgs = (fs.writeFile as jest.Mock).mock.calls.slice(-1)[0];
    expect(lastWriteCallArgs[1]).toBe(expectedWriteArgs); // Ensure the content is what we expect
  });

  it('should return 400 for missing required fields', async () => {
    const invalidPayload = { symbol: 'BTCUSD' }; // Missing many fields
    const req = new NextRequest('http://localhost/api/trades', {
      method: 'POST',
      body: JSON.stringify(invalidPayload),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(req);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.error).toBe('Missing required fields');
  });

  it('should return 400 for invalid numeric fields (e.g., size <= 0)', async () => {
    const invalidPayload = {
        entryDate: '2024-01-01T10:00:00Z',
        exitDate: '2024-01-01T12:00:00Z',
        symbol: 'BTCUSD',
        direction: 'buy' as 'buy' | 'sell',
        size: 0, // Invalid size
        entryPrice: 50000,
        exitPrice: 51000,
      };
    const req = new NextRequest('http://localhost/api/trades', {
      method: 'POST',
      body: JSON.stringify(invalidPayload),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(req);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.error).toBe('Size, entry price, and exit price must be positive numbers');
  });
  
  it('should return 400 for invalid direction', async () => {
    const invalidPayload = {
        entryDate: '2024-01-01T10:00:00Z',
        exitDate: '2024-01-01T12:00:00Z',
        symbol: 'BTCUSD',
        direction: 'sideways', // Invalid direction
        size: 0.1,
        entryPrice: 50000,
        exitPrice: 51000,
      };
    const req = new NextRequest('http://localhost/api/trades', {
      method: 'POST',
      body: JSON.stringify(invalidPayload),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(req);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.error).toBe('Invalid symbol or direction');
  });

  it('should handle JSON parsing error for invalid payload', async () => {
    const req = new NextRequest('http://localhost/api/trades', {
        method: 'POST',
        body: "{invalid json'}", // Malformed JSON
        headers: { 'Content-Type': 'application/json' },
      });
  
      const response = await POST(req);
      const responseBody = await response.json();
  
      expect(response.status).toBe(400);
      expect(responseBody.error).toBe('Invalid JSON payload');
  });

  it('should handle file system error during write', async () => {
    const validTradePayload = {
        entryDate: '2024-01-01T10:00:00Z',
        exitDate: '2024-01-01T12:00:00Z',
        symbol: 'BTCUSD',
        direction: 'buy' as 'buy' | 'sell',
        size: 0.1,
        entryPrice: 50000,
        exitPrice: 51000,
      };
    const req = new NextRequest('http://localhost/api/trades', {
      method: 'POST',
      body: JSON.stringify(validTradePayload),
      headers: { 'Content-Type': 'application/json' },
    });

    (fs.access as jest.Mock).mockResolvedValue(undefined); // File exists
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify([]));
    (fs.writeFile as jest.Mock).mockRejectedValueOnce(new Error('Disk full')); // Simulate write error

    const response = await POST(req);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.error).toBe('Disk full');
  });
});

describe('GET /api/trades', () => {
    beforeEach(() => {
      (fs.access as jest.Mock).mockReset();
      (fs.readFile as jest.Mock).mockReset();
      (fs.mkdir as jest.Mock).mockReset().mockResolvedValue(undefined);
    });
  
    it('should return an empty array if trades.json does not exist', async () => {
      (fs.access as jest.Mock).mockRejectedValueOnce({ code: 'ENOENT' }); // Simulate file not found
      // ensureDataFile in readTrades should create an empty file, so readFile will then be called.
      (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify([])); // readFile for the newly created empty file
  
      const req = new NextRequest('http://localhost/api/trades');
      const response = await GET_TRADES(req); // Using the imported GET_TRADES
      const responseBody = await response.json();
  
      expect(response.status).toBe(200);
      expect(responseBody).toEqual([]);
      expect(fs.mkdir).toHaveBeenCalled(); // ensureDataFile calls mkdir
      expect(fs.writeFile).toHaveBeenCalledWith(expect.any(String), JSON.stringify([]), 'utf-8'); // ensureDataFile writes []
    });
  
    it('should return trades if trades.json exists and has data', async () => {
      const mockTrades: Trade[] = [
        { id: '1', symbol: 'BTCUSD', direction: 'buy', entryPrice: 50000, exitPrice: 51000, size: 1, entryDate: 'd1', exitDate: 'd2', pnl: 1000 },
        { id: '2', symbol: 'ETHUSD', direction: 'sell', entryPrice: 3000, exitPrice: 2900, size: 10, entryDate: 'd3', exitDate: 'd4', pnl: 1000 },
      ];
      (fs.access as jest.Mock).mockResolvedValue(undefined); // File exists
      (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockTrades));
  
      const req = new NextRequest('http://localhost/api/trades');
      const response = await GET_TRADES(req);
      const responseBody = await response.json();
  
      expect(response.status).toBe(200);
      expect(responseBody).toEqual(mockTrades);
    });
  
    it('should return empty array if trades.json is empty', async () => {
        (fs.access as jest.Mock).mockResolvedValue(undefined); // File exists
        (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify([])); // Empty array in file
    
        const req = new NextRequest('http://localhost/api/trades');
        const response = await GET_TRADES(req);
        const responseBody = await response.json();
    
        expect(response.status).toBe(200);
        expect(responseBody).toEqual([]);
      });

    it('should return empty array and log error if trades.json content is invalid JSON', async () => {
        (fs.access as jest.Mock).mockResolvedValue(undefined); // File exists
        (fs.readFile as jest.Mock).mockResolvedValueOnce("{invalid json'"); // Malformed JSON
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
    
        const req = new NextRequest('http://localhost/api/trades');
        const response = await GET_TRADES(req); 
        const responseBody = await response.json();
    
        expect(response.status).toBe(200); // The readTrades helper in route.ts returns [] on JSON parse error
        expect(responseBody).toEqual([]);   // So the API should still return 200 with empty array
        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
      });

    it('should return 500 if readFile throws an unexpected error (not ENOENT or JSON parse)', async () => {
        (fs.access as jest.Mock).mockResolvedValue(undefined); // File exists
        (fs.readFile as jest.Mock).mockRejectedValueOnce(new Error('Some other FS error'));
    
        const req = new NextRequest('http://localhost/api/trades');
        const response = await GET_TRADES(req);
        const responseBody = await response.json();
    
        expect(response.status).toBe(500);
        expect(responseBody.message).toBe('Error fetching trades');
        expect(responseBody.error).toBe('Some other FS error');
      });
  });
