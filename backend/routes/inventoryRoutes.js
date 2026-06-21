const router = require('express').Router();
const ctrl = require('../controllers/inventoryController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const adminAccess = [auth, authorize('admin', 'manager', 'worker')];

router.get('/', ...adminAccess, ctrl.getAllInventory);
router.get('/:id', ...adminAccess, ctrl.getInventoryById);
router.post('/', ...adminAccess, ctrl.createInventory);
router.put('/:id', ...adminAccess, ctrl.updateInventory);
router.delete('/:id', auth, authorize('admin'), ctrl.deleteInventory);

module.exports = router;
