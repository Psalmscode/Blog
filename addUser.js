require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/user');

const addUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        // Clear existing users first (optional)
        // await User.deleteMany({});

        // Create a test user
        const testUser = new User({
            username: 'admin',
            password: 'admin123'
        });

        const savedUser = await testUser.save();
        console.log('Test user created successfully!');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('Saved user:', savedUser);

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

addUser();
