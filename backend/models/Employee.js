const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cnic: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    phone: String,
    email: String,
    salaryPKR: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'On Leave', 'Terminated'], default: 'Active' },
    joiningDate: Date,
    imageUrl: String,
    location: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hasLogin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
