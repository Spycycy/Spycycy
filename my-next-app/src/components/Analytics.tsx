"use client";
import React from "react";

export default function Analytics() {
  return (
    <section className="w-full max-w-4xl mx-auto mt-12 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 space-y-8">
      <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">Trade Performance Analytics</h2>
      
      {/* Trade Performance Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Metric label="Total P&L" value="$12,500" />
          <Metric label="Win/Loss Ratio" value="1.8" />
          <Metric label="Risk-Reward Ratio" value="2.3" />
          <Metric label="Expectancy" value="$45" />
          <Metric label="Max Drawdown" value="-$1,200" />
          <Metric label="R-Multiples" value="3.2" />
          <Metric label="Sharpe Ratio" value="1.4" />
          <Metric label="Sortino Ratio" value="1.7" />
        </div>
      </div>

      {/* Trade Tagging/Categorization */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Trade Tagging & Categorization</h3>
        <div className="flex flex-wrap gap-2">
          <Tag label="Breakout" />
          <Tag label="Reversal" />
          <Tag label="High Volatility" />
          <Tag label="FOMO" />
          <Tag label="Missed Setup" />
          {/* ... */}
        </div>
      </div>

      {/* Time-Based Analysis */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Time-Based Analysis</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Metric label="Best Hour" value="14:00" />
          <Metric label="Best Day" value="Wednesday" />
          <Metric label="Best Month" value="March" />
          <Metric label="Worst Day" value="Monday" />
        </div>
        {/* Placeholder for calendar or chart */}
        <div className="mt-2 text-gray-400 text-sm">[Calendar/Chart View Coming Soon]</div>
      </div>

      {/* Strategy/Setup Analysis */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Strategy & Setup Analysis</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Metric label="Breakout Success" value="68%" />
          <Metric label="Reversal Success" value="54%" />
          <Metric label="What-if Win Rate" value="61%" />
        </div>
      </div>

      {/* Risk Management Analytics */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Risk Management</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Metric label="Avg. Position Size" value="0.8 lots" />
          <Metric label="Stop-Loss Adherence" value="97%" />
          <Metric label="Risk Exposure" value="2.5%" />
        </div>
        <div className="mt-2 text-gray-400 text-sm">[Monte Carlo Simulation Coming Soon]</div>
      </div>

      {/* Behavioral/Psychological Insights */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Behavioral & Psychological Insights</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Metric label="Emotion Tracked" value="Calm" />
          <Metric label="Mistake Rate" value="8%" />
          <Metric label="Consistency Score" value="92%" />
        </div>
      </div>

      {/* Comparative Analysis */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Comparative Analysis</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Metric label="Long vs Short" value="60% / 40%" />
          <Metric label="Asset Class" value="FX" />
          <Metric label="Account" value="Main" />
        </div>
      </div>

      {/* Automated Insights/AI */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Automated Insights & AI</h3>
        <div className="text-gray-400 text-sm">[Pattern Recognition, AI Recommendations, and Alerts Coming Soon]</div>
      </div>

      {/* Community/Sharing */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Community & Sharing</h3>
        <div className="text-gray-400 text-sm">[Leaderboards, Trade Sharing, Benchmarking Coming Soon]</div>
      </div>

      {/* Customization & Goal Tracking */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Customization & Goal Tracking</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Metric label="Custom Metric" value="..." />
          <Metric label="Goal Progress" value="80%" />
          <Metric label="Milestones" value="3/5" />
        </div>
      </div>

      {/* Delivery/UX */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Delivery & UX</h3>
        <div className="text-gray-400 text-sm">[Real-time updates, exportable reports, interactive visuals coming soon]</div>
      </div>
    </section>
  );
}

// Simple metric card
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-indigo-50 dark:bg-indigo-900 rounded p-3 text-center">
      <div className="text-xs text-gray-500 dark:text-gray-300">{label}</div>
      <div className="text-lg font-bold text-indigo-700 dark:text-indigo-200">{value}</div>
    </div>
  );
}

// Simple tag badge
function Tag({ label }: { label: string }) {
  return (
    <span className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">{label}</span>
  );
}