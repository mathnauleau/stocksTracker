import React from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Cell,
    AreaChart,
    Area,
    Pie
} from 'recharts';

interface Position {
    symbol: string;
    totalShares: number;
    totalCost: number;
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

interface PieChartData {
    name: string;
    value: number;
    color: string;
}

interface TimelineData {
    date: string;
    invested: number;
    value: number;
}

interface PerformancePageProps {
    performanceData: PerformanceData;
    portfolio: Position[];
    pieChartData: PieChartData[];
    timelineData: TimelineData[];
}

const PerformancePage: React.FC<PerformancePageProps> = ({
    performanceData,
    portfolio,
    pieChartData,
    timelineData
}) => {
    return (
        <div className="space-y-6">
            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Portfolio Allocation Pie Chart */}
                <div className="bg-white p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">My Portfolio Allocation</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
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
                <div className="bg-white p-6 rounded-xl">
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
                <div className="bg-white p-6 rounded-xl">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Total Return</h4>
                    <p className={`text-2xl font-bold ${performanceData.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        €{performanceData.totalReturn.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">Including dividends</p>
                </div>

                <div className="bg-white p-6 rounded-xl">
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

                <div className="bg-white p-6 rounded-xl">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Dividend Yield</h4>
                    <p className="text-2xl font-bold text-blue-600">
                        {performanceData.totalInvested > 0 ? ((performanceData.totalDividends / performanceData.totalInvested) * 100).toFixed(2) : 0}%
                    </p>
                    <p className="text-sm text-gray-500">Annualized estimate</p>
                </div>
            </div>
        </div>
    );
};

export default PerformancePage;