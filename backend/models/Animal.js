const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    rfid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    species: { type: String, enum: ['Cattle', 'Cow', 'Buffalo', 'Goat', 'Sheep', 'Bird', 'Chicken', 'Duck', 'Other'], required: true },
    breed: String,
    gender: { type: String, enum: ['Male', 'Female'] },
    dateOfBirth: Date,
    weightKg: Number,
    status: { type: String, enum: ['Healthy', 'Sick', 'Quarantine', 'Sold', 'Deceased'], default: 'Healthy' },
    location: String,
    purchasePricePKR: Number,
    purchaseDate: Date,
    vaccinations: [String],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Animal', animalSchema);
