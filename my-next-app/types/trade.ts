export interface Trade {
  id: string;
  entryDate: string;
  exitDate: string;
  symbol: string;
  direction: 'buy' | 'sell';
  size: number;
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  exitPrice: number;
  pnl?: number;
}
