const mongoose = require('mongoose');

const financialRecordSchema = new mongoose.Schema({
    type: { type: String, enum: ['Income', 'Expense'], required: true },
    category: { type: String, required: true },
    description: String,
    amountPKR: { type: Number, required: true },
    date: { type: Date, required: true },
    relatedAnimalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal' },
    relatedOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
}, { timestamps: true });

module.exports = mongoose.model('FinancialRecord', financialRecordSchema);
