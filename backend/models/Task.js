const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dueDate: Date,
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completedAt: Date,
    notes: String
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
