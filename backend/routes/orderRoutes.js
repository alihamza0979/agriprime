const router = require('express').Router();
const ctrl = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, ctrl.getAllOrders);
router.get('/:id', auth, ctrl.getOrderById);
router.post('/', auth, ctrl.createOrder);
router.put('/:id', auth, ctrl.updateOrder);
router.delete('/:id', auth, ctrl.deleteOrder);

module.exports = router;
