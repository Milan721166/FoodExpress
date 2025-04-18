const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const orderRoutes = require('./routes/orderRoutes');
const resturantRoutes = require('./routes/resturantRoutes');

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Connect to the database
connectDB();

// Routes 
app.use('/api/products', productRoutes);


// Add user routes
app.use('/api/users', userRoutes);

//orsers
app.use('/api/orders', orderRoutes);


//resturants
app.use('/api/resturants', resturantRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});