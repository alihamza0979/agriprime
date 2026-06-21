const router = require('express').Router();
const ctrl = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/stats', auth, authorize('admin', 'manager', 'accountant'), ctrl.getDashboardStats);
router.get('/users', auth, authorize('admin'), ctrl.getAllUsers);
router.post('/users', auth, authorize('admin'), ctrl.createUser);
router.put('/users/:id', auth, authorize('admin'), ctrl.updateUser);
router.delete('/users/:id', auth, authorize('admin'), ctrl.deleteUser);

module.exports = router;
