const mongoose = require('mongoose');

const breedingRecordSchema = new mongoose.Schema({
    animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    partnerAnimalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal' },
    heatDate: Date,
    breedingDate: Date,
    expectedBirthDate: Date,
    actualBirthDate: Date,
    status: {
        type: String,
        enum: ['Heat Alert', 'Bred', 'Pregnant', 'Delivered', 'Failed'],
        default: 'Heat Alert'
    },
    offspringCount: { type: Number, default: 0 },
    notes: String,
    veterinarian: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('BreedingRecord', breedingRecordSchema);
