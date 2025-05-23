import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center p-4 sm:p-8"> {/* Adjusted min-height for nav/footer and padding */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-6">
        Welcome to Your Trading Journal
      </h1>
      <p className="text-md sm:text-lg text-gray-600 mb-10 sm:mb-12 max-w-xl sm:max-w-2xl">
        Track your trades, analyze your performance, and improve your strategy. 
        This application provides tools to log detailed trade information and view your trading history and statistics.
      </p>
      <div className="space-y-4 sm:space-y-0 sm:space-x-6 flex flex-col sm:flex-row">
        <Link 
          href="/trades/new" 
          className="px-6 py-3 sm:px-8 sm:py-3 bg-indigo-600 text-white text-base sm:text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1">
            Log a New Trade
        </Link>
        <Link 
          href="/trades" 
          className="px-6 py-3 sm:px-8 sm:py-3 bg-green-500 text-white text-base sm:text-lg font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1">
            View Trade History
        </Link>
      </div>
      <div className="mt-12 sm:mt-16 text-gray-500 text-sm sm:text-base">
        <p>
          Start by logging your first trade or viewing your existing journal entries.
        </p>
      </div>
    </div>
  );
}
