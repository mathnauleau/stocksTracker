const express = require('express');
const { runQuery, getOne, getAll } = require('../../database/database');

const router = express.Router();

// GET /api/stocks - Get all stocks
router.get('/', async (req, res) => {
    try {
        const stocks = await getAll(`
            SELECT * FROM stocks 
            ORDER BY symbol
        `);
        
        res.json({
            success: true,
            data: stocks
        });
    } catch (error) {
        console.error('Error fetching stocks:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stocks'
        });
    }
});

// GET /api/stocks/:symbol - Get specific stock
router.get('/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        
        const stock = await getOne('SELECT * FROM stocks WHERE symbol = ?', [symbol.toUpperCase()]);
        
        if (!stock) {
            return res.status(404).json({
                success: false,
                error: 'Stock not found'
            });
        }
        
        res.json({
            success: true,
            data: stock
        });
    } catch (error) {
        console.error('Error fetching stock:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stock'
        });
    }
});

// POST /api/stocks - Add new stock
router.post('/', async (req, res) => {
    try {
        const { symbol, company_name, sector } = req.body;
        
        // Validate required fields
        if (!symbol || !company_name) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: symbol, company_name'
            });
        }

        // Check if stock already exists
        const existing = await getOne('SELECT symbol FROM stocks WHERE symbol = ?', [symbol.toUpperCase()]);
        if (existing) {
            return res.status(409).json({
                success: false,
                error: 'Stock with this symbol already exists'
            });
        }

        // Add stock
        const result = await runQuery(`
            INSERT INTO stocks (symbol, company_name, sector)
            VALUES (?, ?, ?)
        `, [symbol.toUpperCase(), company_name, sector]);

        // Fetch the created stock
        const newStock = await getOne('SELECT * FROM stocks WHERE id = ?', [result.id]);

        res.status(201).json({
            success: true,
            data: newStock
        });
    } catch (error) {
        console.error('Error adding stock:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add stock'
        });
    }
});

// PUT /api/stocks/:symbol - Update stock
router.put('/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { company_name, sector } = req.body;

        // Check if stock exists
        const existing = await getOne('SELECT symbol FROM stocks WHERE symbol = ?', [symbol.toUpperCase()]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                error: 'Stock not found'
            });
        }

        // Update stock
        await runQuery(`
            UPDATE stocks 
            SET company_name = COALESCE(?, company_name),
                sector = COALESCE(?, sector),
                updated_at = CURRENT_TIMESTAMP
            WHERE symbol = ?
        `, [company_name, sector, symbol.toUpperCase()]);

        // Fetch updated stock
        const updatedStock = await getOne('SELECT * FROM stocks WHERE symbol = ?', [symbol.toUpperCase()]);

        res.json({
            success: true,
            data: updatedStock
        });
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update stock'
        });
    }
});

// DELETE /api/stocks/:symbol - Delete stock
router.delete('/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;

        // Check if stock is used in portfolio
        const portfolioUsage = await getOne(
            'SELECT COUNT(*) as count FROM portfolio_holdings WHERE stock_symbol = ?', 
            [symbol.toUpperCase()]
        );

        if (portfolioUsage.count > 0) {
            return res.status(409).json({
                success: false,
                error: 'Cannot delete stock that is used in portfolio holdings'
            });
        }

        const result = await runQuery('DELETE FROM stocks WHERE symbol = ?', [symbol.toUpperCase()]);
        
        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                error: 'Stock not found'
            });
        }

        res.json({
            success: true,
            message: 'Stock deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting stock:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete stock'
        });
    }
});

module.exports = router;
