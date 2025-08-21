const express = require('express');
const { runQuery, getOne, getAll } = require('../database/database');

const router = express.Router();

// GET /api/user-data/:dataType - Get user data by type
router.get('/:dataType', async (req, res) => {
    try {
        const { dataType } = req.params;
        
        const userData = await getOne(
            'SELECT * FROM user_data WHERE data_type = ? ORDER BY updated_at DESC LIMIT 1',
            [dataType]
        );
        
        res.json({
            success: true,
            data: userData
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user data'
        });
    }
});

// GET /api/user-data - Get all user data
router.get('/', async (req, res) => {
    try {
        const userData = await getAll(
            'SELECT * FROM user_data ORDER BY data_type, updated_at DESC'
        );
        
        res.json({
            success: true,
            data: userData
        });
    } catch (error) {
        console.error('Error fetching all user data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user data'
        });
    }
});

// POST /api/user-data - Save user data
router.post('/', async (req, res) => {
    try {
        const { data_type, data } = req.body;
        
        // Validate required fields
        if (!data_type || !data) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: data_type, data'
            });
        }

        // Check if data already exists for this type
        const existing = await getOne(
            'SELECT id FROM user_data WHERE data_type = ?',
            [data_type]
        );

        let result;
        if (existing) {
            // Update existing data
            result = await runQuery(
                'UPDATE user_data SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE data_type = ?',
                [data, data_type]
            );
        } else {
            // Insert new data
            result = await runQuery(
                'INSERT INTO user_data (data_type, data) VALUES (?, ?)',
                [data_type, data]
            );
        }

        // Fetch the updated/created data
        const userData = await getOne(
            'SELECT * FROM user_data WHERE data_type = ?',
            [data_type]
        );

        res.status(existing ? 200 : 201).json({
            success: true,
            data: userData
        });
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save user data'
        });
    }
});

// PUT /api/user-data/:dataType - Update user data
router.put('/:dataType', async (req, res) => {
    try {
        const { dataType } = req.params;
        const { data } = req.body;

        // Check if data exists
        const existing = await getOne(
            'SELECT id FROM user_data WHERE data_type = ?',
            [dataType]
        );

        if (!existing) {
            return res.status(404).json({
                success: false,
                error: 'User data not found'
            });
        }

        // Update data
        await runQuery(
            'UPDATE user_data SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE data_type = ?',
            [data, dataType]
        );

        // Fetch updated data
        const userData = await getOne(
            'SELECT * FROM user_data WHERE data_type = ?',
            [dataType]
        );

        res.json({
            success: true,
            data: userData
        });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update user data'
        });
    }
});

// DELETE /api/user-data/:dataType - Delete user data
router.delete('/:dataType', async (req, res) => {
    try {
        const { dataType } = req.params;

        const result = await runQuery(
            'DELETE FROM user_data WHERE data_type = ?',
            [dataType]
        );
        
        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                error: 'User data not found'
            });
        }

        res.json({
            success: true,
            message: 'User data deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete user data'
        });
    }
});

module.exports = router;