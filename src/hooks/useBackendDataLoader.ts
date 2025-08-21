import { useState, useEffect, useCallback } from 'react';

// Backend API configuration
const API_BASE_URL = 'http://localhost:3001/api';

// Types for your existing data structures
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

interface Dividend {
  id: number;
  symbol: string;
  amount: number;
  date: string;
  type: 'dividend' | 'special' | 'distribution';
}

interface DcaPlan {
  id: number;
  symbol: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly';
  nextDate: string;
}

// New backend tables data will be stored in a single user_data table as JSON
interface UserData {
  id?: number;
  data_type: 'transactions' | 'dividends' | 'dca_plans' | 'settings';
  data: any;
  created_at?: string;
  updated_at?: string;
}

// API helper function
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making API call to:', url);
    console.log('Options:', options);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    return data.data || data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Custom hook for backend data management
const useBackendDataLoader = () => {
  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dividends, setDividends] = useState<Dividend[]>([]);
  const [dcaPlans, setDcaPlans] = useState<DcaPlan[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(1000);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API functions for user data management
  const saveUserData = async (dataType: string, data: any) => {
    try {
      const payload = {
        data_type: dataType,
        data: JSON.stringify(data)
      };

      // Try to update existing or create new
      await apiCall('/user-data', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error(`Error saving ${dataType}:`, error);
      throw error;
    }
  };

  const loadUserData = async (dataType: string): Promise<any> => {
    try {
      const response = await apiCall<any>(`/user-data/${dataType}`);
      return response ? JSON.parse(response.data || '[]') : [];
    } catch (error) {
      console.warn(`No ${dataType} data found, using empty array`);
      return [];
    }
  };

  // Load all data from backend
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load all data types
      const [transactionsData, dividendsData, dcaPlansData, settingsData] = await Promise.all([
        loadUserData('transactions'),
        loadUserData('dividends'),
        loadUserData('dca_plans'),
        loadUserData('settings')
      ]);

      setTransactions(transactionsData || []);
      setDividends(dividendsData || []);
      setDcaPlans(dcaPlansData || []);
      setMonthlyBudget(settingsData?.monthlyBudget || 1000);

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data from backend. Using default data.');
      
      // Fallback to your original example data
      setTransactions([
        {
          id: 1,
          symbol: 'ALO',
          type: 'BUY',
          shares: 50,
          price: 3.85,
          date: '2024-01-15',
          fees: 0.50,
          total: 193.00
        },
        {
          id: 2,
          symbol: 'VWCG',
          type: 'BUY',
          shares: 10,
          price: 15.20,
          date: '2024-01-20',
          fees: 0.30,
          total: 152.30
        }
      ]);
      
      setDividends([
        {
          id: 1,
          symbol: 'ALO',
          amount: 12.50,
          date: '2024-03-15',
          type: 'dividend'
        }
      ]);
      
      setDcaPlans([
        {
          id: 1,
          symbol: 'VWCG',
          amount: 200,
          frequency: 'monthly',
          nextDate: '2024-04-01'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Transaction functions
  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = {
        ...transaction,
        id: Date.now(), // Temporary ID
      };
      
      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      await saveUserData('transactions', updatedTransactions);
      
      return true;
    } catch (error) {
      console.error('Error adding transaction:', error);
      return false;
    }
  }, [transactions]);

  const deleteTransaction = useCallback(async (id: number) => {
    try {
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      await saveUserData('transactions', updatedTransactions);
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
  }, [transactions]);

  const updateTransaction = useCallback(async (id: number, updates: Partial<Transaction>) => {
    try {
      const updatedTransactions = transactions.map(t => 
        t.id === id ? { ...t, ...updates } : t
      );
      setTransactions(updatedTransactions);
      await saveUserData('transactions', updatedTransactions);
      return true;
    } catch (error) {
      console.error('Error updating transaction:', error);
      return false;
    }
  }, [transactions]);

  // Dividend functions
  const addDividend = useCallback(async (dividend: Omit<Dividend, 'id'>) => {
    try {
      const newDividend = {
        ...dividend,
        id: Date.now(),
      };
      
      const updatedDividends = [...dividends, newDividend];
      setDividends(updatedDividends);
      await saveUserData('dividends', updatedDividends);
      
      return true;
    } catch (error) {
      console.error('Error adding dividend:', error);
      return false;
    }
  }, [dividends]);

  const deleteDividend = useCallback(async (id: number) => {
    try {
      const updatedDividends = dividends.filter(d => d.id !== id);
      setDividends(updatedDividends);
      await saveUserData('dividends', updatedDividends);
      return true;
    } catch (error) {
      console.error('Error deleting dividend:', error);
      return false;
    }
  }, [dividends]);

  // DCA Plan functions
  const addDcaPlan = useCallback(async (plan: Omit<DcaPlan, 'id'>) => {
    try {
      const newPlan = {
        ...plan,
        id: Date.now(),
      };
      
      const updatedPlans = [...dcaPlans, newPlan];
      setDcaPlans(updatedPlans);
      await saveUserData('dca_plans', updatedPlans);
      
      return true;
    } catch (error) {
      console.error('Error adding DCA plan:', error);
      return false;
    }
  }, [dcaPlans]);

  const deleteDcaPlan = useCallback(async (id: number) => {
    try {
      const updatedPlans = dcaPlans.filter(p => p.id !== id);
      setDcaPlans(updatedPlans);
      await saveUserData('dca_plans', updatedPlans);
      return true;
    } catch (error) {
      console.error('Error deleting DCA plan:', error);
      return false;
    }
  }, [dcaPlans]);

  // Settings functions
  const updateMonthlyBudget = useCallback(async (budget: number) => {
    try {
      setMonthlyBudget(budget);
      await saveUserData('settings', { monthlyBudget: budget });
      return true;
    } catch (error) {
      console.error('Error updating monthly budget:', error);
      return false;
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return {
    // Data
    transactions,
    dividends,
    dcaPlans,
    monthlyBudget,
    
    // State
    isLoading,
    error,
    
    // Setters (for backward compatibility with existing components)
    setTransactions,
    setDividends,
    setDcaPlans,
    setMonthlyBudget: updateMonthlyBudget,
    
    // New backend functions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addDividend,
    deleteDividend,
    addDcaPlan,
    deleteDcaPlan,
    refreshData: loadAllData,
  };
};

export default useBackendDataLoader;