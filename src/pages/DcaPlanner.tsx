import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

interface DcaPlan {
    id: number;
    symbol: string;
    amount: number;
    frequency: 'weekly' | 'monthly' | 'quarterly';
    nextDate: string;
}

interface NewDcaPlan {
    symbol: string;
    amount: string;
    frequency: 'weekly' | 'monthly' | 'quarterly';
    nextDate: string;
}

interface BudgetAllocation {
    allocated: number;
    remaining: number;
    percentAllocated: number;
}

interface DcaPlannerPageProps {
    dcaPlans: DcaPlan[];
    setDcaPlans: React.Dispatch<React.SetStateAction<DcaPlan[]>>;
    monthlyBudget: number;
    setMonthlyBudget: React.Dispatch<React.SetStateAction<number>>;
    budgetAllocation: BudgetAllocation;
}

const DcaPlannerPage: React.FC<DcaPlannerPageProps> = ({
    dcaPlans,
    setDcaPlans,
    monthlyBudget,
    setMonthlyBudget,
    budgetAllocation
}) => {
    // Form state
    const [newDcaPlan, setNewDcaPlan] = useState<NewDcaPlan>({
        symbol: '',
        amount: '',
        frequency: 'monthly',
        nextDate: new Date().toISOString().split('T')[0]
    });

    // Add DCA plan
    const addDcaPlan = () => {
        if (!newDcaPlan.symbol || !newDcaPlan.amount) return;

        const plan: DcaPlan = {
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

    return (
        <div className="space-y-6">
            {/* Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Budget</label>
                    <input
                        type="number"
                        value={monthlyBudget}
                        onChange={(e) => setMonthlyBudget(parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="bg-white p-6 rounded-xl">
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

                <div className="bg-white p-6 rounded-xl">
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
            <div className="bg-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add DCA Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Stock Symbol (e.g., AAPL)"
                        value={newDcaPlan.symbol}
                        onChange={(e) => setNewDcaPlan({ ...newDcaPlan, symbol: e.target.value.toUpperCase() })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="number"
                        placeholder="Monthly Amount (€)"
                        step="0.01"
                        value={newDcaPlan.amount}
                        onChange={(e) => setNewDcaPlan({ ...newDcaPlan, amount: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                        value={newDcaPlan.frequency}
                        onChange={(e) => setNewDcaPlan({ ...newDcaPlan, frequency: e.target.value as 'weekly' | 'monthly' | 'quarterly' })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                    </select>
                    <input
                        type="date"
                        value={newDcaPlan.nextDate}
                        onChange={(e) => setNewDcaPlan({ ...newDcaPlan, nextDate: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={addDcaPlan}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <PlusCircle size={16} />
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
    );
};

export default DcaPlannerPage;