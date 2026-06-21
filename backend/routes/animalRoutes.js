const router = require('express').Router();
const ctrl = require('../controllers/animalController');
const auth = require('../middleware/authMiddleware');

const authorize = require('../middleware/roleMiddleware');
const adminOnly = [auth, authorize('admin', 'manager', 'veterinarian')];

router.get('/', ...adminOnly, ctrl.getAllAnimals);
router.get('/status/:status', ...adminOnly, ctrl.getByStatus);
router.get('/:id', ...adminOnly, ctrl.getAnimalById);
router.post('/', ...adminOnly, ctrl.createAnimal);
router.put('/:id', ...adminOnly, ctrl.updateAnimal);
router.delete('/:id', auth, authorize('admin'), ctrl.deleteAnimal);

module.exports = router;
