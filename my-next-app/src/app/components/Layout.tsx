import Link from 'next/link';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <nav className="bg-indigo-700 text-white shadow-md">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold hover:text-indigo-300">
              Trading Journal
            </Link>
            <div className="space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Home
              </Link>
              <Link href="/trades/new" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Log New Trade
              </Link>
              <Link href="/trades" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                View Trades
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; {new Date().getFullYear()} Trading Journal. All rights reserved.</p>
      </footer>
    </div>
  );
}
