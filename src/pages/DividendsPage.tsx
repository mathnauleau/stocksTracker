import React, { useState } from 'react';
import { PlusCircle, Trash2, Gift, Calendar, TrendingUp } from 'lucide-react';

interface Dividend {
    id: number;
    symbol: string;
    amount: number;
    date: string;
    type: 'dividend' | 'special' | 'distribution';
}

interface NewDividend {
    symbol: string;
    amount: string;
    date: string;
    type: 'dividend' | 'special' | 'distribution';
}

interface DividendsPageProps {
    dividends: Dividend[];
    setDividends: React.Dispatch<React.SetStateAction<Dividend[]>>;
}

const DividendsPage: React.FC<DividendsPageProps> = ({
    dividends,
    setDividends
}) => {
    // Form state
    const [newDividend, setNewDividend] = useState<NewDividend>({
        symbol: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'dividend'
    });

    // Add dividend
    const addDividend = () => {
        if (!newDividend.symbol || !newDividend.amount) return;

        const dividend: Dividend = {
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

    return (
        <div className="space-y-6">
            {/* Add Dividend Form */}
            <div className="bg-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Dividend Payment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Stock Symbol"
                        value={newDividend.symbol}
                        onChange={(e) => setNewDividend({ ...newDividend, symbol: e.target.value.toUpperCase() })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="number"
                        placeholder="Dividend Amount (€)"
                        step="0.01"
                        value={newDividend.amount}
                        onChange={(e) => setNewDividend({ ...newDividend, amount: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="date"
                        value={newDividend.date}
                        onChange={(e) => setNewDividend({ ...newDividend, date: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                        value={newDividend.type}
                        onChange={(e) => setNewDividend({ ...newDividend, type: e.target.value as 'dividend' | 'special' | 'distribution' })}
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
                    <PlusCircle size={16} />
                    Add Dividend
                </button>
            </div>

            {/* Dividend Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl">
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

                <div className="bg-white p-6 rounded-xl">
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

                <div className="bg-white p-6 rounded-xl">
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
    );
};

export default DividendsPage;