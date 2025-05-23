'use client';

import { useState, FormEvent } from 'react';
// Assuming alias @ is working, which is configured during create-next-app
import { Trade } from '@/types/trade'; 

export default function NewTradePage() {
  const [entryDate, setEntryDate] = useState('');
  const [exitDate, setExitDate] = useState('');
  const [symbol, setSymbol] = useState('');
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy');
  const [size, setSize] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const tradeData = {
      entryDate,
      exitDate,
      symbol,
      direction,
      size: parseFloat(size),
      entryPrice: parseFloat(entryPrice),
      stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
      takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
      exitPrice: parseFloat(exitPrice),
    };

    try {
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tradeData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to log trade');
      }
      
      setMessage(`Success: ${result.message}`);
      // Reset form
      setEntryDate('');
      setExitDate('');
      setSymbol('');
      setDirection('buy');
      setSize('');
      setEntryPrice('');
      setStopLoss('');
      setTakeProfit('');
      setExitPrice('');

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while submitting the trade.');
    }
  };

  return (
    // Adjusted padding (p-0 or specific padding if Layout doesn't provide enough)
    // Max-width and mx-auto are good for centering the form.
    <div className="max-w-2xl mx-auto p-4 sm:p-0"> 
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800">Log New Trade</h1>
      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative mb-6" role="alert">{message}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-xl rounded-lg p-6 sm:p-8"> {/* Increased padding and shadow */}
        
        {/* Grouping related fields using divs for structure if needed, or just rely on space-y */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
          <div>
            <label htmlFor="entryDate" className="block text-sm font-medium text-gray-700">Entry Date:</label>
            <input type="datetime-local" id="entryDate" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="exitDate" className="block text-sm font-medium text-gray-700">Exit Date:</label>
            <input type="datetime-local" id="exitDate" value={exitDate} onChange={(e) => setExitDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">Symbol:</label>
            <input type="text" id="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} required placeholder="e.g., BTCUSD" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="direction" className="block text-sm font-medium text-gray-700">Direction:</label>
            <select id="direction" value={direction} onChange={(e) => setDirection(e.target.value as 'buy' | 'sell')} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">Size:</label>
            <input type="number" id="size" value={size} onChange={(e) => setSize(e.target.value)} required min="0.000001" step="any" placeholder="e.g., 0.1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-700">Entry Price:</label>
            <input type="number" id="entryPrice" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} required min="0.000001" step="any" placeholder="e.g., 50000" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
          <div>
            <label htmlFor="stopLoss" className="block text-sm font-medium text-gray-700">Stop Loss <span className="text-xs text-gray-500">(Optional)</span>:</label>
            <input type="number" id="stopLoss" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} min="0.000001" step="any" placeholder="e.g., 48000" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="takeProfit" className="block text-sm font-medium text-gray-700">Take Profit <span className="text-xs text-gray-500">(Optional)</span>:</label>
            <input type="number" id="takeProfit" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} min="0.000001" step="any" placeholder="e.g., 55000" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>
        
        <div> {/* Single column for Exit Price */}
          <label htmlFor="exitPrice" className="block text-sm font-medium text-gray-700">Exit Price:</label>
          <input type="number" id="exitPrice" value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} required min="0.000001" step="any" placeholder="e.g., 52000" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        
        <div className="pt-2"> {/* Added padding-top to separate button a bit */}
          <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
            Log Trade
          </button>
        </div>
      </form>
    </div>
  );
}
