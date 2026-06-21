const router = require('express').Router();
const authCtrl = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/me', authMiddleware, authCtrl.getMe);
router.put('/profile', authMiddleware, authCtrl.updateProfile);
router.put('/password', authMiddleware, authCtrl.changePassword);
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/reset-password/:token', authCtrl.resetPassword);

module.exports = router;
