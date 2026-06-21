const router = require('express').Router();
const ctrl = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const staffAccess = [auth, authorize('admin', 'manager', 'worker', 'veterinarian')];
const adminAccess = [auth, authorize('admin', 'manager')];

router.get('/', ...staffAccess, ctrl.getAllTasks);
router.get('/:id', ...staffAccess, ctrl.getTaskById);
router.post('/', ...adminAccess, ctrl.createTask);
router.put('/:id', ...staffAccess, ctrl.updateTask);
router.put('/:id/progress', ...staffAccess, ctrl.updateProgress);
router.delete('/:id', auth, authorize('admin', 'manager'), ctrl.deleteTask);

module.exports = router;
