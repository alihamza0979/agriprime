const BreedingRecord = require('../models/BreedingRecord');

exports.getAllBreedingRecords = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        const records = await BreedingRecord.find(filter)
            .populate('animalId', 'rfid name species breed gender')
            .populate('partnerAnimalId', 'rfid name breed')
            .sort({ expectedBirthDate: 1 });
        res.json({ success: true, count: records.length, data: records });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getBreedingRecordById = async (req, res) => {
    try {
        const record = await BreedingRecord.findById(req.params.id)
            .populate('animalId')
            .populate('partnerAnimalId');
        if (!record) return res.status(404).json({ message: 'Breeding record not found' });
        res.json({ success: true, data: record });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createBreedingRecord = async (req, res) => {
    try {
        const record = new BreedingRecord(req.body);
        await record.save();
        await record.populate('animalId', 'rfid name species breed');
        res.status(201).json({ success: true, data: record });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBreedingRecord = async (req, res) => {
    try {
        const record = await BreedingRecord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            .populate('animalId', 'rfid name species breed');
        if (!record) return res.status(404).json({ message: 'Breeding record not found' });
        res.json({ success: true, data: record });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteBreedingRecord = async (req, res) => {
    try {
        const record = await BreedingRecord.findByIdAndDelete(req.params.id);
        if (!record) return res.status(404).json({ message: 'Breeding record not found' });
        res.json({ success: true, message: 'Breeding record removed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBreedingStats = async (req, res) => {
    try {
        const [activeCycles, upcomingBirths, pregnantCount] = await Promise.all([
            BreedingRecord.countDocuments({ status: { $in: ['Heat Alert', 'Bred'] } }),
            BreedingRecord.countDocuments({ status: 'Pregnant' }),
            BreedingRecord.countDocuments({ status: 'Pregnant' })
        ]);
        const nextDue = await BreedingRecord.findOne({ status: 'Pregnant', expectedBirthDate: { $gte: new Date() } })
            .sort({ expectedBirthDate: 1 })
            .populate('animalId', 'name');
        res.json({
            success: true,
            data: {
                activeCycles,
                upcomingBirths: pregnantCount,
                nextDueDate: nextDue?.expectedBirthDate,
                nextDueAnimal: nextDue?.animalId?.name
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
