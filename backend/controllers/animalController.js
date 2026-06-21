const Animal = require('../models/Animal');

exports.getAllAnimals = async (req, res) => {
    try {
        const filter = {};
        if (req.query.breed) filter.breed = req.query.breed;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.species) filter.species = req.query.species;

        const animals = await Animal.find(filter).sort({ createdAt: -1 }).populate('owner', 'name email');
        res.json({ success: true, count: animals.length, data: animals });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAnimalById = async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id).populate('owner', 'name email');
        if (!animal) return res.status(404).json({ message: 'Animal not found' });
        res.json({ success: true, data: animal });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createAnimal = async (req, res) => {
    try {
        const animal = new Animal({
            ...req.body,
            owner: req.user.userId
        });
        await animal.save();
        res.status(201).json({ success: true, data: animal });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Duplicate RFID' });
        }
        res.status(500).json({ message: err.message });
    }
};

exports.updateAnimal = async (req, res) => {
    try {
        const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!animal) return res.status(404).json({ message: 'Animal not found' });
        res.json({ success: true, data: animal });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteAnimal = async (req, res) => {
    try {
        const animal = await Animal.findByIdAndDelete(req.params.id);
        if (!animal) return res.status(404).json({ message: 'Animal not found' });
        res.json({ success: true, message: 'Animal removed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getByStatus = async (req, res) => {
    try {
        const animals = await Animal.find({ status: req.params.status });
        res.json({ success: true, count: animals.length, data: animals });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
