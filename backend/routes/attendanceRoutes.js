const router = require('express').Router();
const ctrl = require('../controllers/attendanceController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/', auth, authorize('admin', 'manager', 'worker', 'veterinarian'), ctrl.getAllAttendance);
router.post('/mark', auth, authorize('admin', 'manager', 'worker', 'veterinarian'), ctrl.markAttendance);

module.exports = router;
