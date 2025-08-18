import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Gift } from 'lucide-react';

interface Transaction {
  id: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  date: string;
  fees: number;
  total: number;
}

interface Position {
  symbol: string;
  totalShares: number;
  totalCost: number;
  transactions: Transaction[];
  avgCost: number;
  currentPrice: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

interface PerformanceData {
  totalInvested: number;
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  totalDividends: number;
  totalReturn: number;
  portfolio: Position[];
}

interface PortfolioPageProps {
  performanceData: PerformanceData;
  portfolio: Position[];
}

const PortfolioPage: React.FC<PortfolioPageProps> = ({ performanceData, portfolio }) => {
  return (
    <div className="space-y-6">
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">
                €{performanceData.totalInvested.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Value</p>
              <p className="text-2xl font-bold text-gray-900">
                €{performanceData.totalValue.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Gain/Loss</p>
              <p className={`text-2xl font-bold ${performanceData.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                €{performanceData.totalGainLoss.toFixed(2)}
              </p>
              <p className={`text-sm ${performanceData.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {performanceData.totalGainLossPercent.toFixed(2)}%
              </p>
            </div>
            <div className={`p-3 rounded-full ${performanceData.totalGainLoss >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {performanceData.totalGainLoss >= 0 ? 
                <TrendingUp className="text-green-600" size={24} /> : 
                <TrendingDown className="text-red-600" size={24} />
              }
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dividends</p>
              <p className="text-2xl font-bold text-green-600">
                €{performanceData.totalDividends.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Gift className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">My Current Positions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shares</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gain/Loss</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {portfolio.map(position => (
                <tr key={position.symbol} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {position.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {position.totalShares.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    €{position.avgCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    €{position.currentPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    €{position.totalCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    €{position.currentValue.toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap font-medium ${
                    position.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    €{position.gainLoss.toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap font-medium ${
                    position.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {position.gainLossPercent.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;