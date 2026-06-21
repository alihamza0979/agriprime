const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'https://agriprime-n5ao.onrender.com',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Health check for deployment monitoring
app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/animals', require('./routes/animalRoutes'));
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/financial', require('./routes/financialRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/breeding', require('./routes/breedingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/animal-groups', require('./routes/animalGroupRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_jwt_secret_change_in_production')) {
    console.error('FATAL: Set a strong JWT_SECRET environment variable before running in production.');
    process.exit(1);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`AgriPrime Server running on port ${PORT}`);
});
