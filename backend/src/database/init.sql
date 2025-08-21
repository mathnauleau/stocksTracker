-- Create tables for the stocks tracker

-- Table to store individual stock information
CREATE TABLE IF NOT EXISTS stocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT NOT NULL UNIQUE,
    company_name TEXT NOT NULL,
    sector TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table to store portfolio holdings
CREATE TABLE IF NOT EXISTS portfolio_holdings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stock_symbol TEXT NOT NULL,
    quantity REAL NOT NULL,
    purchase_price REAL NOT NULL,
    purchase_date DATE NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_symbol) REFERENCES stocks (symbol)
);

-- Table to store historical stock prices (optional, for tracking)
CREATE TABLE IF NOT EXISTS stock_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stock_symbol TEXT NOT NULL,
    price REAL NOT NULL,
    date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_symbol) REFERENCES stocks (symbol),
    UNIQUE(stock_symbol, date)
);

-- Table to store user application data (transactions, dividends, DCA plans, settings)
CREATE TABLE IF NOT EXISTS user_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data_type TEXT NOT NULL UNIQUE,
    data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT OR IGNORE INTO stocks (symbol, company_name, sector) VALUES 
('AAPL', 'Apple Inc.', 'Technology'),
('GOOGL', 'Alphabet Inc.', 'Technology'),
('TSLA', 'Tesla Inc.', 'Automotive'),
('MSFT', 'Microsoft Corporation', 'Technology'),
('AMZN', 'Amazon.com Inc.', 'E-commerce'),
('ALO', 'Alamo Group Inc.', 'Industrial'),
('VWCG', 'Vanguard', 'ETF'),
('MWRD', 'Millicom International', 'Telecom'),
('SP500', 'S&P 500 ETF', 'ETF'),
('AD.AS', 'Ahold Delhaize', 'Consumer');

INSERT OR IGNORE INTO portfolio_holdings (stock_symbol, quantity, purchase_price, purchase_date, notes) VALUES 
('AAPL', 10, 150.00, '2024-01-15', 'Initial purchase'),
('GOOGL', 5, 2800.00, '2024-02-01', 'Growth investment'),
('TSLA', 8, 200.00, '2024-01-30', 'Speculative buy');

-- Insert sample user data to match your existing app structure
INSERT OR IGNORE INTO user_data (data_type, data) VALUES 
('transactions', '[
    {
        "id": 1,
        "symbol": "ALO",
        "type": "BUY",
        "shares": 50,
        "price": 3.85,
        "date": "2024-01-15",
        "fees": 0.50,
        "total": 193.00
    },
    {
        "id": 2,
        "symbol": "VWCG",
        "type": "BUY",
        "shares": 10,
        "price": 15.20,
        "date": "2024-01-20",
        "fees": 0.30,
        "total": 152.30
    },
    {
        "id": 3,
        "symbol": "MWRD",
        "type": "BUY",
        "shares": 25,
        "price": 18.75,
        "date": "2024-02-05",
        "fees": 0.25,
        "total": 469.00
    }
]'),
('dividends', '[
    {
        "id": 1,
        "symbol": "ALO",
        "amount": 12.50,
        "date": "2024-03-15",
        "type": "dividend"
    },
    {
        "id": 2,
        "symbol": "VWCG",
        "amount": 8.30,
        "date": "2024-03-20",
        "type": "dividend"
    }
]'),
('dca_plans', '[
    {
        "id": 1,
        "symbol": "VWCG",
        "amount": 200,
        "frequency": "monthly",
        "nextDate": "2024-04-01"
    },
    {
        "id": 2,
        "symbol": "SP500",
        "amount": 300,
        "frequency": "monthly",
        "nextDate": "2024-04-01"
    }
]'),
('settings', '{"monthlyBudget": 1000}');