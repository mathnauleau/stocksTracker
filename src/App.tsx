import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, BarChart3, Gift } from 'lucide-react';

import Button from './components/button.tsx';
import useDataLoader from './hooks/useDataLoader';

// Import your page components
import PortfolioPage from './pages/PortfolioPage';
import PerformancePage from './pages/PerformancePage';
import TransactionsPage from './pages/TransactionsPage';
import DividendsPage from './pages/DividendsPage';
import DcaPlannerPage from './pages/DcaPlannerPage';

import './App.css';

const InvestmentDashboard = () => {
  const [activeTab, setActiveTab] = useState('portfolio');

  // Use the data loader hook instead of hardcoded state
  const {
    transactions,
    setTransactions,
    dcaPlans,
    setDcaPlans,
    dividends,
    setDividends,
    monthlyBudget,
    setMonthlyBudget,
    isLoading,
    error
  } = useDataLoader();

  // Current prices for performance calculation (simulated)
  const [currentPrices] = useState({
    'ALO': 4.2,
    'VWCG': 15.5,
    'MWRD': 19.1,
    'SP500': 9.1,
    'AD.AS': 4.9
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading investment data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading data: {error}</p>
          <p className="text-gray-600">Using default example data instead.</p>
        </div>
      </div>
    );
  }

  // Rest of your existing functions remain the same...
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

  const getDcaBudgetAllocation = () => {
    const totalDcaAmount = dcaPlans.reduce((sum, plan) => sum + plan.amount, 0);
    const remainingBudget = monthlyBudget - totalDcaAmount;

    return {
      allocated: totalDcaAmount,
      remaining: remainingBudget,
      percentAllocated: (totalDcaAmount / monthlyBudget) * 100
    };
  };

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

  const getPieChartData = () => {
    const portfolio = getPortfolioSummary();
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];

    return portfolio.map((pos, index) => ({
      name: pos.symbol,
      value: pos.currentValue,
      color: colors[index % colors.length]
    }));
  };

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

        {/* Render Pages */}
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