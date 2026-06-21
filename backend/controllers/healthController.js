const HealthRecord = require('../models/HealthRecord');

exports.getAllHealthRecords = async (req, res) => {
    try {
        const filter = {};
        if (req.query.animalId) filter.animalId = req.query.animalId;
        const records = await HealthRecord.find(filter).populate('animalId', 'rfid name').populate('veterinarian', 'name');
        res.json({ success: true, count: records.length, data: records });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getHealthRecordById = async (req, res) => {
    try {
        const record = await HealthRecord.findById(req.params.id).populate('animalId').populate('veterinarian');
        if (!record) return res.status(404).json({ message: 'Record not found' });
        res.json({ success: true, data: record });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createHealthRecord = async (req, res) => {
    try {
        const record = new HealthRecord({
            ...req.body,
            veterinarian: req.user.userId
        });
        await record.save();
        res.status(201).json({ success: true, data: record });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateHealthRecord = async (req, res) => {
    try {
        const record = await HealthRecord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!record) return res.status(404).json({ message: 'Record not found' });
        res.json({ success: true, data: record });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteHealthRecord = async (req, res) => {
    try {
        const record = await HealthRecord.findByIdAndDelete(req.params.id);
        if (!record) return res.status(404).json({ message: 'Record not found' });
        res.json({ success: true, message: 'Record removed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.exportMedicalHistory = async (req, res) => {
    try {
        const records = await HealthRecord.find()
            .populate('animalId', 'rfid name species breed')
            .populate('veterinarian', 'name')
            .sort({ date: -1 });

        const rows = records.map(r => ({
            date: r.date ? new Date(r.date).toISOString().split('T')[0] : '',
            animal: r.animalId?.name || 'Unknown',
            rfid: r.animalId?.rfid || '',
            species: r.animalId?.species || '',
            recordType: r.recordType,
            diagnosis: r.diagnosis,
            treatment: r.treatment,
            medications: r.medications || '',
            status: r.status,
            veterinarian: r.veterinarian?.name || '',
            notes: r.notes || ''
        }));

        res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
