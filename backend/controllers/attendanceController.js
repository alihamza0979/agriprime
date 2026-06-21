const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

exports.getAllAttendance = async (req, res) => {
    try {
        const filter = {};
        if (req.query.employeeId) filter.employeeId = req.query.employeeId;
        if (req.query.date) {
            const d = new Date(req.query.date);
            d.setHours(0, 0, 0, 0);
            filter.date = d;
        }

        if (req.user.role === 'worker' || req.user.role === 'veterinarian') {
            const emp = await Employee.findOne({ userId: req.user.userId });
            if (emp) filter.employeeId = emp._id;
        }

        const records = await Attendance.find(filter)
            .populate('employeeId', 'name role department')
            .sort({ date: -1 });
        res.json({ success: true, count: records.length, data: records });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.markAttendance = async (req, res) => {
    try {
        const { employeeId, status, notes } = req.body;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let empId = employeeId;
        if (req.user.role === 'worker' || req.user.role === 'veterinarian') {
            const emp = await Employee.findOne({ userId: req.user.userId });
            if (!emp) return res.status(400).json({ message: 'Employee profile not linked' });
            empId = emp._id;
        }

        const record = await Attendance.findOneAndUpdate(
            { employeeId: empId, date: today },
            { employeeId: empId, date: today, status: status || 'Present', checkInTime: new Date(), source: 'manual', notes },
            { upsert: true, new: true }
        ).populate('employeeId', 'name');

        res.json({ success: true, data: record });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
