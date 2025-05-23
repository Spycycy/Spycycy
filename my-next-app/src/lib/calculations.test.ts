import { calculatePnl } from './calculations';
import { Trade } from '@/types/trade';

describe('calculatePnl', () => {
  // Test cases for 'buy' direction
  describe('buy trades', () => {
    it('should calculate profit correctly for a buy trade', () => {
      const tradeData: Pick<Trade, 'direction' | 'size' | 'entryPrice' | 'exitPrice'> = {
        direction: 'buy',
        size: 10,
        entryPrice: 100,
        exitPrice: 110,
      };
      expect(calculatePnl(tradeData)).toBe(100); // (110 - 100) * 10 = 100
    });

    it('should calculate loss correctly for a buy trade', () => {
      const tradeData: Pick<Trade, 'direction' | 'size' | 'entryPrice' | 'exitPrice'> = {
        direction: 'buy',
        size: 5,
        entryPrice: 200,
        exitPrice: 190,
      };
      expect(calculatePnl(tradeData)).toBe(-50); // (190 - 200) * 5 = -50
    });

    it('should calculate break-even correctly for a buy trade', () => {
      const tradeData: Pick<Trade, 'direction' | 'size' | 'entryPrice' | 'exitPrice'> = {
        direction: 'buy',
        size: 20,
        entryPrice: 50,
        exitPrice: 50,
      };
      expect(calculatePnl(tradeData)).toBe(0); // (50 - 50) * 20 = 0
    });
  });

  // Test cases for 'sell' direction
  describe('sell trades', () => {
    it('should calculate profit correctly for a sell trade', () => {
      const tradeData: Pick<Trade, 'direction' | 'size' | 'entryPrice' | 'exitPrice'> = {
        direction: 'sell',
        size: 10,
        entryPrice: 100,
        exitPrice: 90,
      };
      expect(calculatePnl(tradeData)).toBe(100); // (100 - 90) * 10 = 100
    });

    it('should calculate loss correctly for a sell trade', () => {
      const tradeData: Pick<Trade, 'direction' | 'size' | 'entryPrice' | 'exitPrice'> = {
        direction: 'sell',
        size: 5,
        entryPrice: 200,
        exitPrice: 210,
      };
      expect(calculatePnl(tradeData)).toBe(-50); // (200 - 210) * 5 = -50
    });

    it('should calculate break-even correctly for a sell trade', () => {
      const tradeData: Pick<Trade, 'direction' | 'size' | 'entryPrice' | 'exitPrice'> = {
        direction: 'sell',
        size: 20,
        entryPrice: 50,
        exitPrice: 50,
      };
      expect(calculatePnl(tradeData)).toBe(0); // (50 - 50) * 20 = 0
    });
  });

  // Test cases for edge cases and invalid inputs
  describe('edge cases and invalid inputs', () => {
    it('should return 0 if size is zero', () => {
      const tradeData: Pick<Trade, 'direction' | 'size' | 'entryPrice' | 'exitPrice'> = {
        direction: 'buy',
        size: 0,
        entryPrice: 100,
        exitPrice: 110,
      };
      expect(calculatePnl(tradeData)).toBe(0);
    });

    it('should return 0 if size is negative', () => {
      const tradeData: Pick<Trade, 'direction' | 'size' | 'entryPrice' | 'exitPrice'> = {
        direction: 'buy',
        size: -10,
        entryPrice: 100,
        exitPrice: 110,
      };
      expect(calculatePnl(tradeData)).toBe(0);
    });

    it('should return 0 if entryPrice is zero or negative', () => {
      const tradeData1: Pick<Trade, 'direction' | 'size' | 'entryPrice' | 'exitPrice'> = {
        direction: 'buy', size: 10, entryPrice: 0, exitPrice: 10
      };
      const tradeData2: Pick<Trade, 'direction' | 'size' | 'entryPrice' | 'exitPrice'> = {
        direction: 'buy', size: 10, entryPrice: -100, exitPrice: 10
      };
      expect(calculatePnl(tradeData1)).toBe(0);
      expect(calculatePnl(tradeData2)).toBe(0);
    });
    
    it('should return 0 if exitPrice is zero or negative', () => {
        const tradeData1: Pick<Trade, 'direction' | 'size' | 'entryPrice' | 'exitPrice'> = {
          direction: 'buy', size: 10, entryPrice: 10, exitPrice: 0
        };
        const tradeData2: Pick<Trade, 'direction' | 'size' | 'entryPrice' | 'exitPrice'> = {
          direction: 'buy', size: 10, entryPrice: 10, exitPrice: -100
        };
        expect(calculatePnl(tradeData1)).toBe(0);
        expect(calculatePnl(tradeData2)).toBe(0);
      });

    it('should handle floating point calculations with precision (toFixed(2))', () => {
      const tradeData: Pick<Trade, 'direction' | 'size' | 'entryPrice' | 'exitPrice'> = {
        direction: 'buy',
        size: 0.1,
        entryPrice: 0.2,
        exitPrice: 0.3,
      };
      // (0.3 - 0.2) * 0.1 = 0.01
      expect(calculatePnl(tradeData)).toBe(0.01);

      const tradeData2: Pick<Trade, 'direction' | 'size' | 'entryPrice' | 'exitPrice'> = {
        direction: 'sell',
        size: 1/3, // Approx 0.333...
        entryPrice: 100.123,
        exitPrice: 90.456,
      };
      // (100.123 - 90.456) * (1/3) = 9.667 * (1/3) = 3.222333...
      // Expected to be rounded to 2 decimal places -> 3.22
      expect(calculatePnl(tradeData2)).toBe(3.22); 
    });
  });
});
