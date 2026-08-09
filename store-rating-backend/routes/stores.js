const express = require('express');
const router = express.Router();
const { getStores, addStore, rateStore } = require('../controllers/storeController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Anyone logged in can view stores
router.get('/', authenticateToken, getStores);

// Only Normal Users can rate a store
router.post('/:store_id/rate', authenticateToken, authorizeRole('normal_user'), rateStore);

// Only System Admins can add a store
router.post('/', authenticateToken, authorizeRole('system_admin'), addStore);

module.exports = router;