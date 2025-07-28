import React, { useState } from 'react';
import {PlusCircle, Trash2, TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, PieChart, Gift} from 'lucide-react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, AreaChart, Area, Pie} from 'recharts';

import './App.css';
import './index.css';

const InvestmentDashboard = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [monthlyBudget, setMonthlyBudget] = useState(200);

  // Initialize with example data
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      symbol: 'ALO',
      type: 'BUY',
      shares: 30,
      price: 3.8,
      date: '2024-11-15',
      fees: 2.5,
      total: 30 * 3.8 + 2.5
    },
    {
      id: 2,
      symbol: 'VWCG',
      type: 'BUY',
      shares: 20,
      price: 14.8,
      date: '2024-11-20',
      fees: 1.5,
      total: 20 * 14.8 + 1.5
    },
    {
      id: 3,
      symbol: 'MWRD',
      type: 'BUY',
      shares: 25,
      price: 18.6,
      date: '2024-12-05',
      fees: 2.0,
      total: 25 * 18.6 + 2.0
    },
    {
      id: 4,
      symbol: 'SP500',
      type: 'BUY',
      shares: 10,
      price: 8.4,
      date: '2024-12-10',
      fees: 1.2,
      total: 10 * 8.4 + 1.2
    },
    {
      id: 5,
      symbol: 'AD.AS',
      type: 'BUY',
      shares: 2,
      price: 4.6,
      date: '2024-12-15',
      fees: 0.8,
      total: 2 * 4.6 + 0.8
    }
  ]);

  const [dcaPlans, setDcaPlans] = useState([
    {
      id: 1,
      symbol: 'VWCG',
      amount: 50,
      frequency: 'monthly',
      nextDate: '2025-02-01'
    },
    {
      id: 2,
      symbol: 'SP500',
      amount: 75,
      frequency: 'monthly',
      nextDate: '2025-02-01'
    },
    {
      id: 3,
      symbol: 'MWRD',
      amount: 50,
      frequency: 'monthly',
      nextDate: '2025-02-01'
    }
  ]);

  const [dividends, setDividends] = useState([
    {
      id: 1,
      symbol: 'ALO',
      amount: 12.50,
      date: '2025-01-15',
      type: 'dividend'
    },
    {
      id: 2,
      symbol: 'VWCG',
      amount: 8.30,
      date: '2025-01-10',
      type: 'dividend'
    }
  ]);

  // Current prices for performance calculation (simulated)
  const [currentPrices] = useState({
    'ALO': 4.2,
    'VWCG': 15.5,
    'MWRD': 19.1,
    'SP500': 9.1,
    'AD.AS': 4.9
  });

  // Form states
  const [newTransaction, setNewTransaction] = useState({
    symbol: '',
    type: 'BUY',
    shares: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    fees: ''
  });

  const [newDcaPlan, setNewDcaPlan] = useState({
    symbol: '',
    amount: '',
    frequency: 'monthly',
    nextDate: new Date().toISOString().split('T')[0]
  });

  const [newDividend, setNewDividend] = useState({
    symbol: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'dividend'
  });

  // Add transaction
  const addTransaction = () => {
    if (!newTransaction.symbol || !newTransaction.shares || !newTransaction.price) return;
    
    const transaction = {
      id: Date.now(),
      ...newTransaction,
      shares: parseFloat(newTransaction.shares),
      price: parseFloat(newTransaction.price),
      fees: parseFloat(newTransaction.fees) || 0,
      total: parseFloat(newTransaction.shares) * parseFloat(newTransaction.price) + (parseFloat(newTransaction.fees) || 0)
    };
    
    setTransactions([...transactions, transaction]);
    setNewTransaction({
      symbol: '',
      type: 'BUY',
      shares: '',
      price: '',
      date: new Date().toISOString().split('T')[0],
      fees: ''
    });
  };

  // Add DCA plan
  const addDcaPlan = () => {
    if (!newDcaPlan.symbol || !newDcaPlan.amount) return;
    
    const plan = {
      id: Date.now(),
      ...newDcaPlan,
      amount: parseFloat(newDcaPlan.amount)
    };
    
    setDcaPlans([...dcaPlans, plan]);
    setNewDcaPlan({
      symbol: '',
      amount: '',
      frequency: 'monthly',
      nextDate: new Date().toISOString().split('T')[0]
    });
  };

  // Add dividend
  const addDividend = () => {
    if (!newDividend.symbol || !newDividend.amount) return;
    
    const dividend = {
      id: Date.now(),
      ...newDividend,
      amount: parseFloat(newDividend.amount)
    };
    
    setDividends([...dividends, dividend]);
    setNewDividend({
      symbol: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      type: 'dividend'
    });
  };

  // Calculate portfolio summary with performance
  const getPortfolioSummary = () => {
    const positions = {};
    
    transactions.forEach(transaction => {
      if (!positions[transaction.symbol]) {
        positions[transaction.symbol] = {
          symbol: transaction.symbol,
          totalShares: 0,
          totalCost: 0,
          transactions: []
        };
      }
      
      const pos = positions[transaction.symbol];
      pos.transactions.push(transaction);
      
      if (transaction.type === 'BUY') {
        pos.totalShares += transaction.shares;
        pos.totalCost += transaction.total;
      } else {
        pos.totalShares -= transaction.shares;
        pos.totalCost -= (transaction.shares * (pos.totalCost / (pos.totalShares + transaction.shares)));
      }
    });
    
    return Object.values(positions).filter(pos => pos.totalShares > 0).map(pos => {
      const currentPrice = currentPrices[pos.symbol] || pos.totalCost / pos.totalShares;
      const currentValue = pos.totalShares * currentPrice;
      const gainLoss = currentValue - pos.totalCost;
      const gainLossPercent = (gainLoss / pos.totalCost) * 100;
      
      return {
        ...pos,
        avgCost: pos.totalCost / pos.totalShares,
        currentPrice,
        currentValue,
        gainLoss,
        gainLossPercent
      };
    });
  };

  // Calculate DCA budget allocation
  const getDcaBudgetAllocation = () => {
    const totalDcaAmount = dcaPlans.reduce((sum, plan) => sum + plan.amount, 0);
    const remainingBudget = monthlyBudget - totalDcaAmount;
    
    return {
      allocated: totalDcaAmount,
      remaining: remainingBudget,
      percentAllocated: (totalDcaAmount / monthlyBudget) * 100
    };
  };

  // Get portfolio performance data for charts
  const getPortfolioPerformanceData = () => {
    const portfolio = getPortfolioSummary();
    const totalInvested = portfolio.reduce((sum, pos) => sum + pos.totalCost, 0);
    const totalValue = portfolio.reduce((sum, pos) => sum + pos.currentValue, 0);
    const totalDividends = dividends.reduce((sum, div) => sum + div.amount, 0);
    
    return {
      totalInvested,
      totalValue,
      totalGainLoss: totalValue - totalInvested,
      totalGainLossPercent: totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0,
      totalDividends,
      totalReturn: totalValue + totalDividends - totalInvested,
      portfolio
    };
  };

  // Pie chart data for allocation
  const getPieChartData = () => {
    const portfolio = getPortfolioSummary();
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];
    
    return portfolio.map((pos, index) => ({
      name: pos.symbol,
      value: pos.currentValue,
      color: colors[index % colors.length]
    }));
  };

  // Performance timeline data
  const getPerformanceTimelineData = () => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let runningValue = 0;
    
    return sortedTransactions.map(transaction => {
      runningValue += transaction.total;
      return {
        date: transaction.date,
        invested: runningValue,
        value: runningValue * 1.08 // Simulated growth
      };
    });
  };

  const portfolio = getPortfolioSummary();
  const budgetAllocation = getDcaBudgetAllocation();
  const performanceData = getPortfolioPerformanceData();
  const pieChartData = getPieChartData();
  const timelineData = getPerformanceTimelineData();

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <BarChart3 className="text-blue-600" />
          Investment Dashboard
        </h1>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'portfolio', label: 'Portfolio', icon: TrendingUp },
              { id: 'performance', label: 'Performance', icon: BarChart3 },
              { id: 'transactions', label: 'Transactions', icon: DollarSign },
              { id: 'dividends', label: 'Dividends', icon: Gift },
              { id: 'dca', label: 'DCA Planner', icon: Calendar }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
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
                <h3 className="text-lg font-semibold text-gray-900">Current Positions</h3>
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
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Allocation Pie Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Allocation</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(1)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`€${value.toFixed(2)}`, 'Value']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Performance Timeline */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Timeline</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`€${value.toFixed(2)}`, '']} />
                    <Area type="monotone" dataKey="invested" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="value" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Total Return</h4>
                <p className={`text-2xl font-bold ${performanceData.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  €{performanceData.totalReturn.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Including dividends</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Best Performer</h4>
                {portfolio.length > 0 && (
                  <>
                    <p className="text-2xl font-bold text-green-600">
                      {portfolio.reduce((best, pos) => pos.gainLossPercent > best.gainLossPercent ? pos : best).symbol}
                    </p>
                    <p className="text-sm text-green-600">
                      +{portfolio.reduce((best, pos) => pos.gainLossPercent > best.gainLossPercent ? pos : best).gainLossPercent.toFixed(2)}%
                    </p>
                  </>
                )}
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Dividend Yield</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {performanceData.totalInvested > 0 ? ((performanceData.totalDividends / performanceData.totalInvested) * 100).toFixed(2) : 0}%
                </p>
                <p className="text-sm text-gray-500">Annualized estimate</p>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            {/* Add Transaction Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Transaction</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Stock Symbol (e.g., AAPL)"
                  value={newTransaction.symbol}
                  onChange={(e) => setNewTransaction({...newTransaction, symbol: e.target.value.toUpperCase()})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="BUY">Buy</option>
                  <option value="SELL">Sell</option>
                </select>
                <input
                  type="number"
                  placeholder="Shares"
                  step="0.0001"
                  value={newTransaction.shares}
                  onChange={(e) => setNewTransaction({...newTransaction, shares: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Price per share"
                  step="0.01"
                  value={newTransaction.price}
                  onChange={(e) => setNewTransaction({...newTransaction, price: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Fees (optional)"
                  step="0.01"
                  value={newTransaction.fees}
                  onChange={(e) => setNewTransaction({...newTransaction, fees: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={addTransaction}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle size={18} />
                Add Transaction
              </button>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shares</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fees</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.slice().reverse().map(transaction => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {transaction.symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            transaction.type === 'BUY' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {transaction.shares}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          €{transaction.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          €{transaction.fees.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          €{transaction.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setTransactions(transactions.filter(t => t.id !== transaction.id))}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Dividends Tab */}
        {activeTab === 'dividends' && (
          <div className="space-y-6">
            {/* Add Dividend Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Dividend Payment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Stock Symbol"
                  value={newDividend.symbol}
                  onChange={(e) => setNewDividend({...newDividend, symbol: e.target.value.toUpperCase()})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Dividend Amount (€)"
                  step="0.01"
                  value={newDividend.amount}
                  onChange={(e) => setNewDividend({...newDividend, amount: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={newDividend.date}
                  onChange={(e) => setNewDividend({...newDividend, date: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={newDividend.type}
                  onChange={(e) => setNewDividend({...newDividend, type: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="dividend">Regular Dividend</option>
                  <option value="special">Special Dividend</option>
                  <option value="distribution">Distribution</option>
                </select>
              </div>
              <button
                onClick={addDividend}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <PlusCircle size={18} />
                Add Dividend
              </button>
            </div>

            {/* Dividend Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Dividends</p>
                    <p className="text-2xl font-bold text-green-600">
                      €{dividends.reduce((sum, div) => sum + div.amount, 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Gift className="text-green-600" size={24} />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-blue-600">
                      €{dividends.filter(div => {
                        const divDate = new Date(div.date);
                        const now = new Date();
                        return divDate.getMonth() === now.getMonth() && divDate.getFullYear() === now.getFullYear();
                      }).reduce((sum, div) => sum + div.amount, 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Monthly</p>
                    <p className="text-2xl font-bold text-purple-600">
                      €{dividends.length > 0 ? (dividends.reduce((sum, div) => sum + div.amount, 0) / Math.max(1, new Set(dividends.map(d => d.date.substring(0, 7))).size)).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <TrendingUp className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Dividends List */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Dividend History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dividends.slice().reverse().map(dividend => (
                      <tr key={dividend.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {dividend.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {dividend.symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 capitalize">
                            {dividend.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600">
                          €{dividend.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setDividends(dividends.filter(d => d.id !== dividend.id))}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DCA Planner Tab */}
        {activeTab === 'dca' && (
          <div className="space-y-6">
            {/* Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Budget</label>
                <input
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Allocated</p>
                    <p className="text-2xl font-bold text-blue-600">
                      €{budgetAllocation.allocated.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{budgetAllocation.percentAllocated.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Remaining</p>
                    <p className={`text-2xl font-bold ${budgetAllocation.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      €{budgetAllocation.remaining.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add DCA Plan Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add DCA Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Stock Symbol (e.g., AAPL)"
                  value={newDcaPlan.symbol}
                  onChange={(e) => setNewDcaPlan({...newDcaPlan, symbol: e.target.value.toUpperCase()})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Monthly Amount (€)"
                  step="0.01"
                  value={newDcaPlan.amount}
                  onChange={(e) => setNewDcaPlan({...newDcaPlan, amount: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={newDcaPlan.frequency}
                  onChange={(e) => setNewDcaPlan({...newDcaPlan, frequency: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
                <input
                  type="date"
                  value={newDcaPlan.nextDate}
                  onChange={(e) => setNewDcaPlan({...newDcaPlan, nextDate: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={addDcaPlan}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle size={18} />
                Add DCA Plan
              </button>
            </div>

            {/* DCA Plans List */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Active DCA Plans</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Purchase</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dcaPlans.map(plan => (
                      <tr key={plan.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {plan.symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          €{plan.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 capitalize">
                          {plan.frequency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {plan.nextDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setDcaPlans(dcaPlans.filter(p => p.id !== plan.id))}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentDashboard;