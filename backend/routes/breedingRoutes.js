const router = require('express').Router();
const ctrl = require('../controllers/breedingController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const vetAccess = [auth, authorize('admin', 'manager', 'veterinarian')];

router.get('/stats', ...vetAccess, ctrl.getBreedingStats);
router.get('/', ...vetAccess, ctrl.getAllBreedingRecords);
router.get('/:id', ...vetAccess, ctrl.getBreedingRecordById);
router.post('/', ...vetAccess, ctrl.createBreedingRecord);
router.put('/:id', ...vetAccess, ctrl.updateBreedingRecord);
router.delete('/:id', auth, authorize('admin'), ctrl.deleteBreedingRecord);

module.exports = router;
