const router = require('express').Router();
const ctrl = require('../controllers/employeeController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const adminOnly = [auth, authorize('admin', 'manager')];

router.get('/', ...adminOnly, ctrl.getAllEmployees);
router.get('/:id', ...adminOnly, ctrl.getEmployeeById);
router.post('/', ...adminOnly, ctrl.createEmployee);
router.put('/:id', ...adminOnly, ctrl.updateEmployee);
router.delete('/:id', auth, authorize('admin'), ctrl.deleteEmployee);
router.post('/:id/credentials', auth, authorize('admin', 'manager'), ctrl.generateCredentials);

module.exports = router;
