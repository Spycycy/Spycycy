import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
// Assuming alias @ is working, which is configured during create-next-app
import { Trade } from '@/types/trade';
import { calculatePnl } from '@/lib/calculations'; // Import the new P&L function

// Define the path to the data file
// process.cwd() should give /app in this environment
const dataDir = path.join(process.cwd(), 'my-next-app', 'data');
const dataFilePath = path.join(dataDir, 'trades.json');

// Helper function to ensure the data directory and file exist
async function ensureDataFile() {
  try {
    // Create the data directory if it doesn't exist
    await fs.mkdir(dataDir, { recursive: true });
    // Check if the file exists
    await fs.access(dataFilePath);
  } catch (error: any) {
    // If the file doesn't exist (fs.access throws an error)
    if (error.code === 'ENOENT') {
      await fs.writeFile(dataFilePath, JSON.stringify([]), 'utf-8');
    } else {
      // Other errors (e.g., permissions)
      throw error;
    }
  }
}

// Helper function to read trades
async function readTrades(): Promise<Trade[]> {
  await ensureDataFile(); // Ensure file exists before reading
  const fileContent = await fs.readFile(dataFilePath, 'utf-8');
  try {
    const trades = JSON.parse(fileContent);
    return Array.isArray(trades) ? trades : []; // Ensure it's an array
  } catch (e) {
    // If JSON is invalid (e.g. empty file was not properly initialized, or corrupted)
    console.error("Error parsing trades.json:", e);
    return []; // Return empty array in case of parsing error
  }
}

// Helper function to write trades
async function writeTrades(trades: Trade[]): Promise<void> {
  await ensureDataFile(); // Ensure directory exists before writing
  await fs.writeFile(dataFilePath, JSON.stringify(trades, null, 2), 'utf-8');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    const { entryDate, exitDate, symbol, direction, size, entryPrice, exitPrice, stopLoss, takeProfit } = body;

    if (!entryDate || !exitDate || !symbol || !direction || !size || !entryPrice || !exitPrice) {
      return NextResponse.json({ message: 'Error logging trade', error: 'Missing required fields' }, { status: 400 });
    }

    if (typeof symbol !== 'string' || symbol.trim() === '' || (direction !== 'buy' && direction !== 'sell')) {
      return NextResponse.json({ message: 'Error logging trade', error: 'Invalid symbol or direction' }, { status: 400 });
    }

    if (typeof size !== 'number' || size <= 0 || 
        typeof entryPrice !== 'number' || entryPrice <= 0 ||
        typeof exitPrice !== 'number' || exitPrice <= 0) {
      return NextResponse.json({ message: 'Error logging trade', error: 'Size, entry price, and exit price must be positive numbers' }, { status: 400 });
    }

    if ((stopLoss !== undefined && (typeof stopLoss !== 'number' || stopLoss <= 0)) ||
        (takeProfit !== undefined && (typeof takeProfit !== 'number' || takeProfit <= 0))) {
      return NextResponse.json({ message: 'Error logging trade', error: 'Stop loss and take profit must be positive numbers if provided' }, { status: 400 });
    }
    
    const newId = crypto.randomUUID();

    // Calculate P&L using the utility function
    const pnl = calculatePnl({ direction, size, entryPrice, exitPrice });

    const newTrade: Trade = {
      id: newId,
      entryDate,
      exitDate,
      symbol,
      direction,
      size,
      entryPrice,
      stopLoss,
      takeProfit,
      exitPrice,
      pnl, // Store calculated P&L
    };

    const trades = await readTrades();
    trades.push(newTrade);
    await writeTrades(trades);

    return NextResponse.json({ message: 'Trade logged successfully', trade: newTrade }, { status: 201 });

  } catch (error: any) {
    console.error('Failed to log trade (API Error):', error);
    if (error instanceof SyntaxError) { // JSON parsing error from req.json()
        return NextResponse.json({ message: 'Error logging trade', error: 'Invalid JSON payload' }, { status: 400 });
    }
    // Log file system errors or other unexpected errors
    return NextResponse.json({ message: 'Error logging trade', error: error.message || 'An server-side error occurred' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const trades = await readTrades(); // readTrades already handles file not found by returning []
    return NextResponse.json(trades, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch trades:', error);
    return NextResponse.json({ message: 'Error fetching trades', error: error.message || 'An unexpected server error occurred' }, { status: 500 });
  }
}
