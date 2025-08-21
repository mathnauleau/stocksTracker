// API service for connecting React frontend to backend

const API_BASE_URL = 'http://localhost:3001/api';

// Types
export interface Stock {
  id: number;
  symbol: string;
  company_name: string;
  sector?: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioHolding {
  id: number;
  stock_symbol: string;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
  notes?: string;
  company_name: string;
  sector?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Generic API call function
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Portfolio API functions
export const portfolioApi = {
  // Get all holdings
  getHoldings: (): Promise<ApiResponse<PortfolioHolding[]>> => 
    apiCall<PortfolioHolding[]>('/portfolio'),

  // Add new holding
  addHolding: (holding: Omit<PortfolioHolding, 'id' | 'company_name' | 'sector' | 'created_at' | 'updated_at'>): Promise<ApiResponse<PortfolioHolding>> =>
    apiCall<PortfolioHolding>('/portfolio', {
      method: 'POST',
      body: JSON.stringify(holding),
    }),

  // Update holding
  updateHolding: (id: number, updates: Partial<Pick<PortfolioHolding, 'quantity' | 'purchase_price' | 'purchase_date' | 'notes'>>): Promise<ApiResponse<PortfolioHolding>> =>
    apiCall<PortfolioHolding>(`/portfolio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // Delete holding
  deleteHolding: (id: number): Promise<ApiResponse<void>> =>
    apiCall<void>(`/portfolio/${id}`, {
      method: 'DELETE',
    }),

  // Get portfolio summary
  getSummary: (): Promise<ApiResponse<{
    summary: {
      total_holdings: number;
      unique_stocks: number;
      total_invested: number;
      avg_purchase_price: number;
    };
    sector_breakdown: Array<{
      sector: string;
      holdings_count: number;
      sector_value: number;
    }>;
  }>> => apiCall('/portfolio/summary'),
};

// Stocks API functions
export const stocksApi = {
  // Get all stocks
  getStocks: (): Promise<ApiResponse<Stock[]>> => 
    apiCall<Stock[]>('/stocks'),

  // Get specific stock
  getStock: (symbol: string): Promise<ApiResponse<Stock>> =>
    apiCall<Stock>(`/stocks/${symbol}`),

  // Add new stock
  addStock: (stock: Omit<Stock, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Stock>> =>
    apiCall<Stock>('/stocks', {
      method: 'POST',
      body: JSON.stringify(stock),
    }),

  // Update stock
  updateStock: (symbol: string, updates: Partial<Pick<Stock, 'company_name' | 'sector'>>): Promise<ApiResponse<Stock>> =>
    apiCall<Stock>(`/stocks/${symbol}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // Delete stock
  deleteStock: (symbol: string): Promise<ApiResponse<void>> =>
    apiCall<void>(`/stocks/${symbol}`, {
      method: 'DELETE',
    }),
};

// Health check
export const healthCheck = (): Promise<ApiResponse<{ message: string; timestamp: string }>> =>
  apiCall('/health');