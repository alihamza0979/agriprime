const router = require('express').Router();
const ctrl = require('../controllers/healthController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const vetAccess = [auth, authorize('admin', 'manager', 'veterinarian')];

router.get('/', ...vetAccess, ctrl.getAllHealthRecords);
router.get('/export', ...vetAccess, ctrl.exportMedicalHistory);
router.get('/:id', ...vetAccess, ctrl.getHealthRecordById);
router.post('/', ...vetAccess, ctrl.createHealthRecord);
router.put('/:id', ...vetAccess, ctrl.updateHealthRecord);
router.delete('/:id', auth, authorize('admin'), ctrl.deleteHealthRecord);

module.exports = router;
