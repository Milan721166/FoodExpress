const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// const { seedProducts } = require('../db/foodData'); // Import the seedProducts function

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI); // Simplified connection
//         console.log('MongoDB connected successfully');
//     } catch (error) {
//         console.error(`Error connecting to MongoDB: ${error.message}`);
//         process.exit(1);
//     }
// };

// connectDB().then(seedProducts); // Call seedProducts after connecting to the database

// module.exports = connectDB;




const connectDB = async () => {
    try {
        console.log('Mongo URI:', process.env.MONGO_URI); // Check the URI value
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
