const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/ownerController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/dashboard', authenticateToken, authorizeRole('store_owner'), getOwnerDashboard);

module.exports = router;