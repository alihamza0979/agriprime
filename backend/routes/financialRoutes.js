const router = require('express').Router();
const ctrl = require('../controllers/financialController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const financeAccess = [auth, authorize('admin', 'manager', 'accountant')];

router.get('/', ...financeAccess, ctrl.getAllFinancialRecords);
router.get('/:id', ...financeAccess, ctrl.getFinancialRecordById);
router.post('/', ...financeAccess, ctrl.createFinancialRecord);
router.put('/:id', ...financeAccess, ctrl.updateFinancialRecord);
router.delete('/:id', auth, authorize('admin'), ctrl.deleteFinancialRecord);

module.exports = router;
