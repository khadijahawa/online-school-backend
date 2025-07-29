const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Giriş endpoint'i (herkese açık)
router.post('/login', authController.login);

module.exports = router;
