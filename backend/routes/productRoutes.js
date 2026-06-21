const router = require('express').Router();
const ctrl = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/', ctrl.getAllProducts);
router.get('/search', ctrl.searchProducts);
router.get('/:id', ctrl.getProductById);
router.post('/', auth, authorize('admin', 'manager'), ctrl.createProduct);
router.put('/category/rename', auth, authorize('admin', 'manager'), ctrl.renameCategory);
router.put('/:id', auth, authorize('admin', 'manager'), ctrl.updateProduct);
router.delete('/:id', auth, authorize('admin'), ctrl.deleteProduct);

module.exports = router;
