import React from 'react';
import { motion } from 'framer-motion';
import StocksHeader from './StocksHeader';

interface StocksAppProps {
  onClose: () => void;
}

const StocksApp: React.FC<StocksAppProps> = ({ onClose }) => {
  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '$150.25', change: '+2.45', percent: '+1.66%', trend: 'up' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$2,850.75', change: '-15.30', percent: '-0.53%', trend: 'down' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$310.50', change: '+5.20', percent: '+1.70%', trend: 'up' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '$750.80', change: '+12.45', percent: '+1.69%', trend: 'up' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: '$3,200.00', change: '-25.50', percent: '-0.79%', trend: 'down' }
  ];

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full bg-black flex flex-col"
    >
      <StocksHeader onClose={onClose} />
      
      <div className="flex-1 bg-white">
        {/* Market Summary */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Market Summary</h2>
          <div className="text-sm text-gray-600">S&P 500: 4,250.75 (+0.85%)</div>
        </div>

        {/* Stocks List */}
        <div className="flex-1 overflow-y-auto">
          {stocks.map((stock) => (
            <motion.div
              key={stock.symbol}
              whileHover={{ backgroundColor: '#f8f9fa' }}
              className="contact-row flex items-center justify-between px-4 cursor-pointer"
            >
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{stock.symbol}</div>
                <div className="text-sm text-gray-500">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-800">{stock.price}</div>
                <div className={`text-sm ${stock.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change} ({stock.percent})
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <div className="text-4xl mb-2">📈</div>
            <div className="text-sm text-gray-600">Interactive Chart</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StocksApp; 