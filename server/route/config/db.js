const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('DB Connected:', mongoose.connection.host);
    } catch (error) {
        console.log('DB Connection Error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
