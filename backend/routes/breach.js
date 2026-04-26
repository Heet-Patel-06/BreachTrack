const express = require('express');
const { checkBreach, getHistory, getStats } = require('../controllers/breachController');

const router = express.Router();

// Check breach
router.post('/check', checkBreach);

// Get history
router.get('/history', getHistory);

// Get dashboard stats
router.get('/stats', getStats);

module.exports = router;