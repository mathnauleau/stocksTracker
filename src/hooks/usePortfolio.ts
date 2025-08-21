import { useState, useEffect, useCallback, useMemo } from 'react';
import { portfolioApi, PortfolioHolding } from '../services/api';

interface UsePortfolioReturn {
  holdings: PortfolioHolding[];
  loading: boolean;
  error: string | null;
  addHolding: (holding: Omit<PortfolioHolding, 'id' | 'company_name' | 'sector' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateHolding: (id: number, updates: Partial<Pick<PortfolioHolding, 'quantity' | 'purchase_price' | 'purchase_date' | 'notes'>>) => Promise<boolean>;
  deleteHolding: (id: number) => Promise<boolean>;
  refreshHoldings: () => Promise<void>;
  summary: {
    totalValue: number;
    totalHoldings: number;
    uniqueStocks: number;
  };
}

export const usePortfolio = (): UsePortfolioReturn => {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch holdings from backend
  const refreshHoldings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await portfolioApi.getHoldings();
      
      if (response.success && response.data) {
        setHoldings(response.data);
      } else {
        setError(response.error || 'Failed to fetch holdings');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching holdings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new holding
  const addHolding = useCallback(async (
    holding: Omit<PortfolioHolding, 'id' | 'company_name' | 'sector' | 'created_at' | 'updated_at'>
  ): Promise<boolean> => {
    try {
      const response = await portfolioApi.addHolding(holding);
      
      if (response.success && response.data) {
        setHoldings(prev => [...prev, response.data!]);
        return true;
      } else {
        setError(response.error || 'Failed to add holding');
        return false;
      }
    } catch (err) {
      setError('Failed to add holding');
      console.error('Error adding holding:', err);
      return false;
    }
  }, []);

  // Update existing holding
  const updateHolding = useCallback(async (
    id: number,
    updates: Partial<Pick<PortfolioHolding, 'quantity' | 'purchase_price' | 'purchase_date' | 'notes'>>
  ): Promise<boolean> => {
    try {
      const response = await portfolioApi.updateHolding(id, updates);
      
      if (response.success && response.data) {
        setHoldings(prev => 
          prev.map(holding => 
            holding.id === id ? response.data! : holding
          )
        );
        return true;
      } else {
        setError(response.error || 'Failed to update holding');
        return false;
      }
    } catch (err) {
      setError('Failed to update holding');
      console.error('Error updating holding:', err);
      return false;
    }
  }, []);

  // Delete holding
  const deleteHolding = useCallback(async (id: number): Promise<boolean> => {
    try {
      const response = await portfolioApi.deleteHolding(id);
      
      if (response.success) {
        setHoldings(prev => prev.filter(holding => holding.id !== id));
        return true;
      } else {
        setError(response.error || 'Failed to delete holding');
        return false;
      }
    } catch (err) {
      setError('Failed to delete holding');
      console.error('Error deleting holding:', err);
      return false;
    }
  }, []);

  // Calculate summary
  const summary = useMemo(() => {
    const totalValue = holdings.reduce((sum, holding) => 
      sum + (holding.quantity * holding.purchase_price), 0
    );
    
    const uniqueStocks = new Set(holdings.map(h => h.stock_symbol)).size;
    
    return {
      totalValue,
      totalHoldings: holdings.length,
      uniqueStocks
    };
  }, [holdings]);

  // Load holdings on mount
  useEffect(() => {
    refreshHoldings();
  }, [refreshHoldings]);

  return {
    holdings,
    loading,
    error,
    addHolding,
    updateHolding,
    deleteHolding,
    refreshHoldings,
    summary
  };
};