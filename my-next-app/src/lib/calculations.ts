import { Trade } from '@/types/trade';

// Input type can be a partial trade, specifically the parts needed for P&L
type PnlInput = Pick<Trade, 'direction' | 'size' | 'entryPrice' | 'exitPrice'>;

/**
 * Calculates the Profit and Loss (P&L) for a trade.
 * @param tradeData - An object containing direction, size, entryPrice, and exitPrice.
 * @returns The calculated P&L. Returns 0 if inputs are invalid (e.g., size is not positive).
 */
export function calculatePnl(tradeData: PnlInput): number {
  const { direction, size, entryPrice, exitPrice } = tradeData;

  // Basic validation for calculation logic, though API route should also validate
  if (typeof size !== 'number' || size <= 0 ||
      typeof entryPrice !== 'number' || entryPrice <= 0 ||
      typeof exitPrice !== 'number' || exitPrice <= 0) {
    // Or throw an error, but returning 0 might be safer if called from various places
    return 0; 
  }

  let pnl = 0;
  if (direction === 'buy') {
    pnl = (exitPrice - entryPrice) * size;
  } else if (direction === 'sell') {
    pnl = (entryPrice - exitPrice) * size;
  }
  
  // Round to a sensible number of decimal places, e.g., 2 for currency
  return parseFloat(pnl.toFixed(2));
}
