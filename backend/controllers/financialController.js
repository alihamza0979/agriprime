const FinancialRecord = require('../models/FinancialRecord');

exports.getAllFinancialRecords = async (req, res) => {
    try {
        const filter = {};
        if (req.query.type) filter.type = req.query.type;
        const records = await FinancialRecord.find(filter)
            .populate('relatedAnimalId', 'rfid name')
            .populate('relatedOrderId', 'orderNumber')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: records.length, data: records });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getFinancialRecordById = async (req, res) => {
    try {
        const record = await FinancialRecord.findById(req.params.id)
            .populate('relatedAnimalId')
            .populate('relatedOrderId');
        if (!record) return res.status(404).json({ message: 'Record not found' });
        res.json({ success: true, data: record });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createFinancialRecord = async (req, res) => {
    try {
        const record = new FinancialRecord(req.body);
        await record.save();
        res.status(201).json({ success: true, data: record });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateFinancialRecord = async (req, res) => {
    try {
        const record = await FinancialRecord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!record) return res.status(404).json({ message: 'Record not found' });
        res.json({ success: true, data: record });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteFinancialRecord = async (req, res) => {
    try {
        const record = await FinancialRecord.findByIdAndDelete(req.params.id);
        if (!record) return res.status(404).json({ message: 'Record not found' });
        res.json({ success: true, message: 'Record removed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
