const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Half Day', 'On Leave'], default: 'Present' },
    checkInTime: Date,
    source: { type: String, enum: ['manual', 'task_completion', 'admin'], default: 'manual' },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    notes: String
}, { timestamps: true });

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
