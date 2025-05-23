"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import LotSizeCalculator from '../components/LotSizeCalculator';
import { useTheme } from 'next-themes';
import ThemeToggle from '../components/ThemeToggle';

function Navbar() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <nav className="w-full bg-gradient-to-r from-blue-900 via-indigo-800 to-violet-700 px-8 py-3 flex items-center justify-between fixed top-0 left-0 z-50 shadow-lg">
      {/* Logo & Tagline */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-violet-500 flex items-center justify-center">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#6366F1" />
            <text x="12" y="16" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">ZJ</text>
          </svg>
        </div>
        <span className="text-xl font-extrabold text-white tracking-wide">ZeeJournal</span>
        <span className="hidden sm:inline text-xs text-indigo-200 ml-3 font-semibold">Master Your Trades, Maximize Your Profits</span>
      </div>
      {/* Navigation */}
      <div className="flex-1 flex items-center justify-center space-x-6">
        <Link href="/" className="text-white font-medium hover:text-blue-300 transition">Home</Link>
        <a href="#features" className="text-white font-medium hover:text-blue-300 transition">Features</a>
        <a href="#pricing" className="text-white font-medium hover:text-blue-300 transition">Pricing</a>
        <a href="#community" className="text-white font-medium hover:text-blue-300 transition">Community</a>
        <a href="#blog" className="text-white font-medium hover:text-blue-300 transition">Blog</a>
        <a href="#tools" className="text-white font-medium hover:text-blue-300 transition">Tools</a>
      </div>
      {/* CTAs & Theme */}
      <div className="flex items-center space-x-3">
        <Link href="/login" className="px-4 py-2 rounded bg-blue-800 text-white font-semibold hover:bg-blue-700 transition shadow">Login</Link>
        <Link href="/signup" className="px-4 py-2 rounded bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300 transition shadow">Sign Up</Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default function Home() {
  const [trades, setTrades] = useState<Trade[]>([]);

  function handleAddTrade(trade: Trade) {
    setTrades(prev => [trade, ...prev]);
  }

  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[80vh] pt-32 pb-12 bg-gradient-to-br from-blue-50 to-violet-100 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
          Track, Analyze, Succeed: Your Ultimate Trading Journal
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl">
          All-in-one platform to log trades, analyze performance, and optimize your trading strategy. No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link href="/signup" className="px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition">Start Journaling Free</Link>
          <a href="#tour" className="px-8 py-3 bg-white text-indigo-700 border border-indigo-600 text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-50 transition">Take a Tour</a>
        </div>
        {/* Placeholder for dashboard visual */}
        <div className="w-full max-w-3xl h-64 bg-gradient-to-tr from-indigo-200 to-violet-200 rounded-xl shadow-inner flex items-center justify-center text-indigo-400 text-2xl font-bold">
          [Dashboard Visual / Charts / Trade Replay GIF]
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Feature icon="📊" title="Advanced Analytics" desc="Track P&L, win/loss, expectancy, drawdowns, and more." />
          <Feature icon="🏷️" title="Trade Tagging" desc="Categorize trades by strategy, setup, emotion, and mistakes." />
          <Feature icon="⏱️" title="Trade Replay" desc="Visualize and review your trades step-by-step." />
          <Feature icon="🎯" title="Goal Tracking" desc="Set, track, and achieve your trading goals." />
          <Feature icon="🤝" title="Community" desc="Share trades, join leaderboards, and benchmark performance." />
          <Feature icon="🛠️" title="Tools" desc="Lot size calculator, risk management, and more." />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-violet-100">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">Why ZeeJournal?</h2>
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
          <Benefit
            stat="+25%"
            label="Improved Profitability"
            desc="Users report significant gains after consistent journaling and analysis."
          />
          <Benefit
            stat="3x"
            label="Pattern Recognition"
            desc="Spot winning setups and avoid costly mistakes with data-driven insights."
          />
          <Benefit
            stat="90%"
            label="Discipline Boost"
            desc="Stay accountable and stick to your trading plan with powerful reminders."
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">What Traders Say</h2>
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
          <Testimonial
            name="Alex P."
            avatar="https://randomuser.me/api/portraits/men/32.jpg"
            quote="ZeeJournal helped me turn my trading around. The analytics are next-level!"
          />
          <Testimonial
            name="Maria L."
            avatar="https://randomuser.me/api/portraits/women/44.jpg"
            quote="I love the trade replay and tagging features. My discipline has never been better."
          />
          <Testimonial
            name="Sam K."
            avatar="https://randomuser.me/api/portraits/men/65.jpg"
            quote="The community and leaderboards keep me motivated every day."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-violet-100">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">How It Works</h2>
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
          <Step number={1} title="Log Trades" desc="Quickly record every trade with details, tags, and screenshots." />
          <Step number={2} title="Analyze Performance" desc="Use advanced analytics to find strengths and weaknesses." />
          <Step number={3} title="Optimize Strategies" desc="Refine your approach and hit your trading goals." />
        </div>
      </section>

      {/* Community */}
      <section id="community" className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-10">Join the Community</h2>
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
          <CommunityHighlight
            title="Leaderboards"
            desc="See how you stack up against other traders."
          />
          <CommunityHighlight
            title="Shared Insights"
            desc="Learn from the best with shared trade ideas and analysis."
          />
          <CommunityHighlight
            title="Forum"
            desc="Ask questions, get feedback, and grow together."
          />
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="w-full max-w-2xl mx-auto mt-20 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">Tools</h2>
        <div>
          <h3 className="text-lg font-semibold mb-2">Lot Size Calculator</h3>
          <LotSizeCalculator />
        </div>
      </section>

      {/* Journal Section */}
      <section id="journal" className="w-full max-w-3xl mx-auto mt-20 mb-20">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">Trade Journal</h2>
        <TradeForm onAdd={handleAddTrade} />
        <TradeList trades={trades} />
      </section>

      {/* CTA Banner */}
      <section className="py-12 bg-gradient-to-r from-indigo-700 to-violet-700 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Master Your Trading?</h2>
        <Link href="/signup" className="inline-block px-8 py-3 bg-yellow-400 text-blue-900 text-lg font-bold rounded-lg shadow-md hover:bg-yellow-300 transition">Start Journaling Free</Link>
        <div className="mt-2 text-indigo-200">No credit card required. Cancel anytime.</div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-300">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="font-bold text-white">ZeeJournal</span>
            <span className="text-xs">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link href="/support" className="hover:text-white">Support</Link>
            <Link href="/faq" className="hover:text-white">FAQ</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Twitter</a>
            <a href="mailto:support@zeejournal.com" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}

// --- Helper Components ---

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center bg-indigo-50 rounded-lg p-6 shadow hover:shadow-lg transition">
      <div className="text-4xl mb-3">{icon}</div>
      <div className="font-bold text-lg text-indigo-800 mb-1">{title}</div>
      <div className="text-gray-600 text-center">{desc}</div>
    </div>
  );
}

function Benefit({ stat, label, desc }: { stat: string; label: string; desc: string }) {
  return (
    <div className="flex-1 flex flex-col items-center bg-white rounded-lg p-6 shadow">
      <div className="text-3xl font-extrabold text-indigo-700 mb-2">{stat}</div>
      <div className="font-bold text-lg text-indigo-800 mb-1">{label}</div>
      <div className="text-gray-600 text-center">{desc}</div>
    </div>
  );
}

function Testimonial({ name, avatar, quote }: { name: string; avatar: string; quote: string }) {
  return (
    <div className="flex-1 flex flex-col items-center bg-indigo-50 rounded-lg p-6 shadow">
      <img src={avatar} alt={name} className="w-16 h-16 rounded-full mb-3" />
      <div className="italic text-gray-700 mb-2">"{quote}"</div>
      <div className="font-bold text-indigo-800">{name}</div>
    </div>
  );
}

function Step({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="flex-1 flex flex-col items-center bg-white rounded-lg p-6 shadow">
      <div className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full text-xl font-bold mb-3">{number}</div>
      <div className="font-bold text-lg text-indigo-800 mb-1">{title}</div>
      <div className="text-gray-600 text-center">{desc}</div>
    </div>
  );
}

function CommunityHighlight({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex-1 flex flex-col items-center bg-indigo-50 rounded-lg p-6 shadow">
      <div className="font-bold text-lg text-indigo-800 mb-1">{title}</div>
      <div className="text-gray-600 text-center">{desc}</div>
    </div>
  );
}

// Trade Form Component
function TradeForm({ onAdd }: { onAdd: (trade: Trade) => void }) {
  const [symbol, setSymbol] = useState('');
  const [date, setDate] = useState('');
  const [side, setSide] = useState('Buy');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [result, setResult] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!symbol || !date || !size || !price || !result) return;
    onAdd({
      id: Date.now(),
      symbol,
      date,
      side,
      size: parseFloat(size),
      price: parseFloat(price),
      result: parseFloat(result),
    });
    setSymbol('');
    setDate('');
    setSide('Buy');
    setSize('');
    setPrice('');
    setResult('');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-indigo-50 rounded-lg p-6 shadow mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Symbol (e.g. EURUSD)"
          value={symbol}
          onChange={e => setSymbol(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2 flex-1"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
        <select
          className="border rounded px-3 py-2 flex-1"
          value={side}
          onChange={e => setSide(e.target.value)}
        >
          <option>Buy</option>
          <option>Sell</option>
        </select>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          className="border rounded px-3 py-2 flex-1"
          type="number"
          min="0"
          step="any"
          placeholder="Size (lots)"
          value={size}
          onChange={e => setSize(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2 flex-1"
          type="number"
          min="0"
          step="any"
          placeholder="Entry Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2 flex-1"
          type="number"
          step="any"
          placeholder="Result ($)"
          value={result}
          onChange={e => setResult(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold hover:bg-indigo-700 transition"
      >
        Log Trade
      </button>
    </form>
  );
}

// Trade List Component
type Trade = {
  id: number;
  symbol: string;
  date: string;
  side: string;
  size: number;
  price: number;
  result: number;
};

function TradeList({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) {
    return <div className="text-gray-500 text-center">No trades logged yet.</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead className="bg-indigo-100">
          <tr>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Symbol</th>
            <th className="px-4 py-2 text-left">Side</th>
            <th className="px-4 py-2 text-left">Size</th>
            <th className="px-4 py-2 text-left">Entry Price</th>
            <th className="px-4 py-2 text-left">Result ($)</th>
          </tr>
        </thead>
        <tbody>
          {trades.map(trade => (
            <tr key={trade.id} className="border-b">
              <td className="px-4 py-2">{trade.date}</td>
              <td className="px-4 py-2">{trade.symbol}</td>
              <td className="px-4 py-2">{trade.side}</td>
              <td className="px-4 py-2">{trade.size}</td>
              <td className="px-4 py-2">{trade.price}</td>
              <td className={`px-4 py-2 font-bold ${trade.result >= 0 ? 'text-green-600' : 'text-red-600'}`}>{trade.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
