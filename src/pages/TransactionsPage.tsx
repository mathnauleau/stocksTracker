import React, { useState } from 'react';
import { PlusCircle, FileUp, FileDown, Trash2 } from 'lucide-react';

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

interface NewTransaction {
    symbol: string;
    type: 'BUY' | 'SELL';
    shares: string;
    price: string;
    date: string;
    fees: string;
}

interface TransactionsPageProps {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({
    transactions,
    setTransactions
}) => {
    // Form state
    const [newTransaction, setNewTransaction] = useState<NewTransaction>({
        symbol: '',
        type: 'BUY',
        shares: '',
        price: '',
        date: new Date().toISOString().split('T')[0],
        fees: ''
    });

    // Add transaction
    const addTransaction = () => {
        if (!newTransaction.symbol || !newTransaction.shares || !newTransaction.price) return;

        const transaction: Transaction = {
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
            transactions,
            exportDate: new Date().toISOString()
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

    return (
        <div className="space-y-6">
            {/* Add Transaction Form */}
            <div className="bg-white p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Transaction</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Stock Symbol (e.g., AAPL)"
                        value={newTransaction.symbol}
                        onChange={(e) => setNewTransaction({ ...newTransaction, symbol: e.target.value.toUpperCase() })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                        value={newTransaction.type}
                        onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'BUY' | 'SELL' })}
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
                        onChange={(e) => setNewTransaction({ ...newTransaction, shares: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="number"
                        placeholder="Price per share"
                        step="0.01"
                        value={newTransaction.price}
                        onChange={(e) => setNewTransaction({ ...newTransaction, price: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="date"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="number"
                        placeholder="Fees (optional)"
                        step="0.01"
                        value={newTransaction.fees}
                        onChange={(e) => setNewTransaction({ ...newTransaction, fees: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={addTransaction}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <PlusCircle size={16} />
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-left">
                                        {transaction.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 text-left">
                                        {transaction.symbol}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${transaction.type === 'BUY'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-left">
                                        {transaction.shares}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-left">
                                        €{transaction.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-left">
                                        €{transaction.fees.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 text-left">
                                        €{transaction.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left">
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

            {/* Export/Import Buttons */}
            <div className='mt-6 flex justify-end gap-4'>
                <button
                    onClick={exportData}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <FileUp size={16} />
                    Export Transactions
                </button>

                <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                    <FileDown size={16} />
                    Import Transactions
                    <input
                        type="file"
                        accept=".json"
                        onChange={importData}
                        className="hidden"
                    />
                </label>
            </div>
        </div>
    );
};

export default TransactionsPage;