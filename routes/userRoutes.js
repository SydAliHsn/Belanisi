const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.delete('/logout', authController.logout);

router.patch('/updateMe', authController.protect, userController.updateUser);
router.patch('/updatePassword', authController.protect, authController.updatePassword);

router.delete('/deleteMe', authController.protect, userController.deleteUser);

router.get('/', userController.getAllUsers);

router.route('/:id').get(userController.getUser);
//   .delete(userController.deleteUser)
//   .patch(userController.updateUser);

module.exports = router;
