const express = require('express');
const router = express.Router();
const { getDashboardStats, getUsers, addUser, getStores } = require('../controllers/adminController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// All routes here require System Admin role
router.use(authenticateToken, authorizeRole('system_admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.get('/stores', getStores); // <-- New Route
router.post('/users', addUser);

module.exports = router;