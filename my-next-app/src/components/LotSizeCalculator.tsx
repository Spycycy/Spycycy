"use client";
import React, { useState } from "react";

// Example exchange rates for pip value conversion (in real use, fetch live rates)
const EXCHANGE_RATES: Record<string, number> = {
  "USDJPY": 155.00,
  "EURUSD": 1.08,
  "GBPUSD": 1.27,
  "USDCHF": 0.91,
  "USDCAD": 1.36,
  "AUDUSD": 0.66,
  "EURJPY": 167.40,
  "GBPJPY": 197.00,
  // Add more as needed
};

const PAIRS = [
  { value: "EURUSD", label: "EUR/USD" },
  { value: "USDJPY", label: "USD/JPY" },
  { value: "GBPUSD", label: "GBP/USD" },
  { value: "USDCHF", label: "USD/CHF" },
  { value: "USDCAD", label: "USD/CAD" },
  { value: "AUDUSD", label: "AUD/USD" },
  { value: "EURJPY", label: "EUR/JPY" },
  { value: "GBPJPY", label: "GBP/JPY" },
];

const ACCOUNT_CURRENCIES = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "JPY", label: "JPY" },
];

function getPipValue(pair: string, lotSize: number, accountCurrency: string): number {
  // 1 pip in decimal
  let pip = 0.0001;
  if (pair.endsWith("JPY")) pip = 0.01;

  // Get exchange rate for the pair
  const rate = EXCHANGE_RATES[pair] || 1;

  // Major pairs where USD is quote currency (e.g., EUR/USD)
  if (pair.endsWith("USD")) {
    if (accountCurrency === "USD") {
      return lotSize * pip;
    } else if (accountCurrency === "EUR" && pair === "EURUSD") {
      // Convert pip value to EUR
      return (lotSize * pip) / rate;
    } else if (accountCurrency === "JPY" && pair === "USDJPY") {
      // Convert pip value to JPY
      return (lotSize * pip) * rate;
    }
  }

  // USD as base (e.g., USD/JPY)
  if (pair.startsWith("USD")) {
    if (accountCurrency === "USD") {
      return (lotSize * pip) / rate;
    } else if (accountCurrency === "JPY") {
      return lotSize * pip;
    }
  }

  // Crosses (e.g., EUR/JPY)
  if (pair.endsWith("JPY")) {
    if (accountCurrency === "JPY") {
      return lotSize * pip;
    } else if (accountCurrency === "USD") {
      // Convert pip value to USD
      return (lotSize * pip) / rate;
    }
  }

  // Default fallback
  return lotSize * pip;
}

export default function LotSizeCalculator() {
  const [accountBalance, setAccountBalance] = useState("");
  const [riskPercent, setRiskPercent] = useState("");
  const [stopLossPips, setStopLossPips] = useState("");
  const [pair, setPair] = useState("EURUSD");
  const [accountCurrency, setAccountCurrency] = useState("USD");
  const [result, setResult] = useState<null | { lotSize: number; dollarRisk: number; pipValue: number }>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const balance = parseFloat(accountBalance);
    const risk = parseFloat(riskPercent);
    const stopLoss = parseFloat(stopLossPips);

    if (isNaN(balance) || isNaN(risk) || isNaN(stopLoss) || stopLoss === 0) {
      setResult(null);
      return;
    }

    // Step 1: Dollar risk
    const dollarRisk = balance * (risk / 100);

    // Step 2: Pip value per standard lot (100,000 units)
    const pipValuePerLot = getPipValue(pair, 100000, accountCurrency);

    // Step 3: Lot size
    const lotSize = dollarRisk / (stopLoss * pipValuePerLot);

    setResult({
      lotSize: Number(lotSize.toFixed(2)),
      dollarRisk: Number(dollarRisk.toFixed(2)),
      pipValue: Number(pipValuePerLot.toFixed(2)),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="number"
          min="0"
          step="any"
          placeholder="Account Balance"
          value={accountBalance}
          onChange={e => setAccountBalance(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
          required
        />
        <select
          value={accountCurrency}
          onChange={e => setAccountCurrency(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        >
          {ACCOUNT_CURRENCIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="number"
          min="0"
          max="100"
          step="any"
          placeholder="Risk %"
          value={riskPercent}
          onChange={e => setRiskPercent(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
          required
        />
        <input
          type="number"
          min="0"
          step="any"
          placeholder="Stop Loss (pips)"
          value={stopLossPips}
          onChange={e => setStopLossPips(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
          required
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={pair}
          onChange={e => setPair(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        >
          {PAIRS.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold hover:bg-indigo-700 transition"
      >
        Calculate
      </button>
      {result && (
        <div className="mt-4 text-green-700 font-bold space-y-2">
          <div>Lot Size: {result.lotSize}</div>
          <div>Dollar Risk: {result.dollarRisk} {accountCurrency}</div>
          <div>Pip Value per Standard Lot: {result.pipValue} {accountCurrency}</div>
        </div>
      )}
    </form>
  );
}