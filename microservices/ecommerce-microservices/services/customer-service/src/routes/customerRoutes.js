const express = require('express');
const CustomerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/register', validate.registerCustomer, CustomerController.register);
router.post('/login', validate.loginCustomer, CustomerController.login);
router.get('/profile', authMiddleware, CustomerController.getProfile);
router.put('/profile', authMiddleware, validate.updateCustomer, CustomerController.updateProfile);
router.post('/logout', authMiddleware, CustomerController.logout);

module.exports = router;