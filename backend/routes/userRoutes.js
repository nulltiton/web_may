const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/', userController.getUsers);
router.post('/submit', userController.addUser);
router.post('/delete', userController.deleteUser);

module.exports = router;