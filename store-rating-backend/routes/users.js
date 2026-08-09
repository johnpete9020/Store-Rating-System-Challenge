const express = require('express');
const router = express.Router();
const { updatePassword } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

router.put('/update-password', authenticateToken, updatePassword);

module.exports = router;