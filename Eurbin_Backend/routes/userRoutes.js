// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

console.log('User Routes Loaded');

// Public Routes
router.post('/', userController.createUser);
router.post('/login', userController.loginUser);

// Protected Routes
router.get('/',  userController.getAllUsers);
router.get('/:id',  userController.getUserById);
router.put('/:id',  userController.updateUser);
router.delete('/:id',  userController.deleteUser);
router.put('/update-password',  userController.updatePassword);

module.exports = router;
