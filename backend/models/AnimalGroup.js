const mongoose = require('mongoose');

const animalGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    species: String,
    feedItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
    feedItemName: String,
    dailyFeedKg: { type: Number, default: 0 },
    animalCount: { type: Number, default: 0 },
    notes: String
}, { timestamps: true });

module.exports = mongoose.model('AnimalGroup', animalGroupSchema);
