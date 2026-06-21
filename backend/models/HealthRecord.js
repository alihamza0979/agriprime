const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
    animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    date: { type: Date, required: true },
    recordType: { type: String, enum: ['Checkup', 'Vaccination', 'Treatment', 'Surgery'], default: 'Checkup' },
    diagnosis: { type: String, required: true },
    treatment: { type: String, required: true },
    medications: { type: String },
    notes: { type: String },
    veterinarian: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    followUpDate: Date,
    status: { type: String, enum: ['Completed', 'Under Treatment', 'Critical', 'Recovered'], default: 'Completed' },
    costPKR: Number
}, { timestamps: true });

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
