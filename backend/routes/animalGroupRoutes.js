const router = require('express').Router();
const ctrl = require('../controllers/animalGroupController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const adminAccess = [auth, authorize('admin', 'manager', 'worker')];

router.get('/', ...adminAccess, ctrl.getAllGroups);
router.get('/report', ...adminAccess, ctrl.generateReport);
router.post('/auto-adjust', ...adminAccess, ctrl.autoAdjustFeed);
router.post('/', ...adminAccess, ctrl.createGroup);
router.put('/:id', ...adminAccess, ctrl.updateGroup);
router.delete('/:id', auth, authorize('admin', 'manager'), ctrl.deleteGroup);

module.exports = router;
