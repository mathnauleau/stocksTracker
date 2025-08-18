import { useState, useEffect } from 'react';

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

interface DcaPlan {
  id: number;
  symbol: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly';
  nextDate: string;
}

interface Dividend {
  id: number;
  symbol: string;
  amount: number;
  date: string;
  type: 'dividend' | 'special' | 'distribution';
}

interface AppData {
  transactions: Transaction[];
  dcaPlans: DcaPlan[];
  dividends: Dividend[];
  monthlyBudget: number;
}

interface UseDataLoaderReturn {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  dcaPlans: DcaPlan[];
  setDcaPlans: React.Dispatch<React.SetStateAction<DcaPlan[]>>;
  dividends: Dividend[];
  setDividends: React.Dispatch<React.SetStateAction<Dividend[]>>;
  monthlyBudget: number;
  setMonthlyBudget: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  error: string | null;
}

const useDataLoader = (dataFilePath?: string): UseDataLoaderReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dcaPlans, setDcaPlans] = useState<DcaPlan[]>([]);
  const [dividends, setDividends] = useState<Dividend[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState(200);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (dataFilePath) {
          // Load from uploaded file
          const fileData = await window.fs.readFile(dataFilePath, { encoding: 'utf8' });
          const data: AppData = JSON.parse(fileData);
          
          if (data.transactions) setTransactions(data.transactions);
          if (data.dcaPlans) setDcaPlans(data.dcaPlans);
          if (data.dividends) setDividends(data.dividends);
          if (data.monthlyBudget) setMonthlyBudget(data.monthlyBudget);
        } else {
          // Try to load from public folder
          try {
            const response = await fetch('/data/investment-data.json');
            if (response.ok) {
              const data: AppData = await response.json();
              
              if (data.transactions) setTransactions(data.transactions);
              if (data.dcaPlans) setDcaPlans(data.dcaPlans);
              if (data.dividends) setDividends(data.dividends);
              if (data.monthlyBudget) setMonthlyBudget(data.monthlyBudget);
            } else {
              // Fall back to default example data if no file found
              setTransactions([
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

              setDcaPlans([
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

              setDividends([
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
            }
          } catch (fetchError) {
            // If fetch fails, use default data
            console.log('No data file found, using default data');
            // Set default data here (same as above)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dataFilePath]);

  return {
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
  };
};

export default useDataLoader;