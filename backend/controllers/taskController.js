const Task = require('../models/Task');
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

const markAttendance = async (employeeId, taskId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existing = await Attendance.findOne({ employeeId, date: today });
    if (!existing) {
        await Attendance.create({
            employeeId,
            date: today,
            status: 'Present',
            checkInTime: new Date(),
            source: 'task_completion',
            taskId
        });
    }
};

exports.getAllTasks = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

        if (req.user.role === 'worker' || req.user.role === 'veterinarian') {
            const emp = await Employee.findOne({ userId: req.user.userId });
            if (emp) filter.assignedTo = emp._id;
        }

        const tasks = await Task.find(filter)
            .populate('assignedTo', 'name role department')
            .populate('assignedBy', 'name')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: tasks.length, data: tasks });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name role department')
            .populate('assignedBy', 'name');
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const task = new Task({ ...req.body, assignedBy: req.user.userId });
        await task.save();
        await task.populate('assignedTo', 'name role department');
        res.status(201).json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.status === 'Done') {
            updates.progress = 100;
            updates.completedAt = new Date();
        }
        const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
            .populate('assignedTo', 'name role department');
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (updates.status === 'Done' && task.assignedTo) {
            await markAttendance(task.assignedTo._id || task.assignedTo, task._id);
        }

        res.json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ success: true, message: 'Task removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateProgress = async (req, res) => {
    try {
        const { progress, status } = req.body;
        const updates = { progress };
        if (status) updates.status = status;
        if (progress >= 100 || status === 'Done') {
            updates.status = 'Done';
            updates.progress = 100;
            updates.completedAt = new Date();
        } else if (progress > 0) {
            updates.status = 'In Progress';
        }

        const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true })
            .populate('assignedTo', 'name role department');
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (updates.status === 'Done' && task.assignedTo) {
            await markAttendance(task.assignedTo._id || task.assignedTo, task._id);
        }

        res.json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
