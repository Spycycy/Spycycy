import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Trade } from '@/types/trade'; // Assuming alias @ is working

// Define the path to the data file
const dataDir = path.join(process.cwd(), 'my-next-app', 'data');
const dataFilePath = path.join(dataDir, 'trades.json');

// Helper function to read trades (similar to the one in trades/route.ts)
async function readTrades(): Promise<Trade[]> {
  try {
    await fs.access(dataFilePath); // Check if file exists
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const trades = JSON.parse(fileContent);
    return Array.isArray(trades) ? trades : [];
  } catch (error: any) {
    // If file doesn't exist (ENOENT) or other errors (e.g. parsing, permissions)
    if (error.code === 'ENOENT') {
      console.log('trades.json not found, returning empty array for stats.');
      return []; // No trades, so empty array
    }
    // For other errors, log them and return empty array to avoid breaking stats
    console.error('Error reading trades.json for stats:', error);
    return []; 
  }
}

export async function GET() {
  try {
    const trades = await readTrades();

    let cumulativePnl = 0;
    const totalTrades = trades.length;

    for (const trade of trades) {
      if (typeof trade.pnl === 'number') {
        cumulativePnl += trade.pnl;
      }
    }

    // Round cumulativePnl to a sensible number of decimal places, e.g., 2
    cumulativePnl = parseFloat(cumulativePnl.toFixed(2));

    return NextResponse.json({
      totalTrades,
      cumulativePnl,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Failed to calculate trade statistics:', error);
    return NextResponse.json({ 
      message: 'Error calculating trade statistics', 
      error: error.message || 'An unexpected server error occurred' 
    }, { status: 500 });
  }
}
