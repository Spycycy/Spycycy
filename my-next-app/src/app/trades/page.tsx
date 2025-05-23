'use client';

import { useState, useEffect, ChangeEvent, useMemo } from 'react';
import { Trade } from '@/types/trade';

interface Stats {
  totalTrades: number;
  cumulativePnl: number;
}

export default function TradesPage() {
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [symbolFilter, setSymbolFilter] = useState('');
  const [entryDateStartFilter, setEntryDateStartFilter] = useState('');
  const [entryDateEndFilter, setEntryDateEndFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tradesResponse, statsResponse] = await Promise.all([
          fetch('/api/trades'),
          fetch('/api/stats'),
        ]);

        if (!tradesResponse.ok) {
          const tradesError = await tradesResponse.json();
          throw new Error(tradesError.message || 'Failed to fetch trades');
        }
        const tradesData: Trade[] = await tradesResponse.json();
        setAllTrades(tradesData);
        setFilteredTrades(tradesData); // Initially, all trades are shown

        if (!statsResponse.ok) {
          const statsError = await statsResponse.json();
          throw new Error(statsError.message || 'Failed to fetch statistics');
        }
        const statsData: Stats = await statsResponse.json();
        setStats(statsData);

      } catch (err: any) {
        setError(err.message);
        setAllTrades([]);
        setFilteredTrades([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoized filtering logic
  useEffect(() => {
    let currentFilteredTrades = [...allTrades];

    if (symbolFilter) {
      currentFilteredTrades = currentFilteredTrades.filter(trade =>
        trade.symbol.toLowerCase().includes(symbolFilter.toLowerCase())
      );
    }

    if (entryDateStartFilter) {
      currentFilteredTrades = currentFilteredTrades.filter(trade =>
        new Date(trade.entryDate) >= new Date(entryDateStartFilter)
      );
    }

    if (entryDateEndFilter) {
      // Adjust end date to include the entire day
      const endDate = new Date(entryDateEndFilter);
      endDate.setHours(23, 59, 59, 999);
      currentFilteredTrades = currentFilteredTrades.filter(trade =>
        new Date(trade.entryDate) <= endDate
      );
    }
    setFilteredTrades(currentFilteredTrades);
  }, [symbolFilter, entryDateStartFilter, entryDateEndFilter, allTrades]);


  const handleSymbolChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSymbolFilter(e.target.value);
  };

  const handleEntryDateStartChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEntryDateStartFilter(e.target.value);
  };

  const handleEntryDateEndChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEntryDateEndFilter(e.target.value);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      // Attempt to show date and time if it's a full ISO string
      const date = new Date(dateString);
      if (dateString.includes('T')) {
        return date.toLocaleString();
      }
      // If it's just a date string (like from date input), show only date part
      return date.toLocaleDateString();
    } catch (e) {
      return dateString; // Fallback to original string if parsing fails
    }
  };


  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading trades...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    // Removed container and mx-auto as Layout provides it. Added specific padding if needed.
    <div className="p-0"> 
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800">Trade Journal</h1>

      {stats && (
        <div className="mb-8 p-6 bg-white shadow-xl rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6 text-center"> {/* Increased gap and shadow */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-1">Total Trades</h2> {/* Added margin-bottom */}
            <p className="text-3xl font-bold text-indigo-600">{stats.totalTrades}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-1">Cumulative P&L</h2> {/* Added margin-bottom */}
            <p className={`text-3xl font-bold ${stats.cumulativePnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.cumulativePnl.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
            </p>
          </div>
        </div>
      )}

      <div className="mb-8 p-6 bg-white shadow-xl rounded-lg"> {/* Increased padding, shadow, and bottom margin */}
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Filter Trades:</h3> {/* Increased font size and margin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4"> {/* Adjusted gap */}
          <div>
            <label htmlFor="symbolFilter" className="block text-sm font-medium text-gray-700">Symbol:</label> {/* Matched label style */}
            <input
              type="text"
              id="symbolFilter"
              value={symbolFilter}
              onChange={handleSymbolChange}
              placeholder="e.g., BTCUSD"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="entryDateStartFilter" className="block text-sm font-medium text-gray-700">Entry Date Start:</label> {/* Matched label style */}
            <input
              type="date"
              id="entryDateStartFilter"
              value={entryDateStartFilter}
              onChange={handleEntryDateStartChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="entryDateEndFilter" className="block text-sm font-medium text-gray-700">Entry Date End:</label> {/* Matched label style */}
            <input
              type="date"
              id="entryDateEndFilter"
              value={entryDateEndFilter}
              onChange={handleEntryDateEndChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {filteredTrades.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white shadow-xl rounded-lg"> {/* Added card styling */}
          <p className="text-lg">No trades found matching your criteria.</p>
          {allTrades.length === 0 && <p className="mt-2 text-sm">You haven't logged any trades yet. <a href="/trades/new" className="text-indigo-600 hover:underline">Log your first trade!</a></p>}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-xl rounded-lg"> {/* Increased shadow */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100"> {/* Slightly darker thead */}
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Entry Date</th> {/* Adjusted text color */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Exit Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Symbol</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Direction</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Size</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Entry Price</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Stop Loss</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Take Profit</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Exit Price</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">P&L</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-50 transition-colors duration-150"> {/* Added transition */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(trade.entryDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(trade.exitDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{trade.symbol}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${trade.direction === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                    {trade.direction.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">{trade.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">{trade.entryPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 5})}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">{trade.stopLoss?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 5}) || <span className="text-gray-400">N/A</span>}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">{trade.takeProfit?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 5}) || <span className="text-gray-400">N/A</span>}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">{trade.exitPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 5})}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${trade.pnl && trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trade.pnl?.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
