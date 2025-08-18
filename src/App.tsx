import React, { useState } from 'react';
import { PlusCircle, FileUp, FileDown, Trash2, TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, Gift } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, AreaChart, Area, Pie } from 'recharts';

import PortfolioPage from './pages/PortfolioPage';
import PerformancePage from './pages/PerformancePage';
import TransactionsPage from './pages/TransactionsPage';
import DividendsPage from './pages/DividendsPage';
import DcaPlannerPage from './pages/DcaPlanner.tsx';

import Button from './components/button.tsx';

import './App.css';

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

  // Export transactions data
  const exportData = () => {
    const data = {
      transactions
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `investment_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import transaction 
  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.transactions) setTransactions(data.transactions);
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
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


  return (
    <div className="min-h-screen bg-gray-50 p-6 borderRadius-lg">
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
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'primary' : 'secondary'}
                  onClick={() => setActiveTab(tab.id)}
                  icon={Icon}
                >
                  {tab.label}
                </Button>
              );
            })}
          </nav>
        </div>

        {activeTab === 'portfolio' && (
          <PortfolioPage
            performanceData={performanceData}
            portfolio={portfolio}
          />
        )}

        {activeTab === 'performance' && (
          <PerformancePage
            performanceData={performanceData}
            portfolio={portfolio}
            pieChartData={pieChartData}
            timelineData={timelineData}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsPage
            transactions={transactions}
            setTransactions={setTransactions}
          />
        )}

        {activeTab === 'dividends' && (
          <DividendsPage
            dividends={dividends}
            setDividends={setDividends}
          />
        )}

        {activeTab === 'dca' && (
          <DcaPlannerPage
            dcaPlans={dcaPlans}
            setDcaPlans={setDcaPlans}
            monthlyBudget={monthlyBudget}
            setMonthlyBudget={setMonthlyBudget}
            budgetAllocation={budgetAllocation}
          />
        )}

      </div>
    </div>
  );
};

export default InvestmentDashboard;