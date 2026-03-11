#!/usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./server/models/user');

const adminUsername = 'Author';
const adminPassword = 'Orooluwaiyanumi';
const adminEmail = 'admin@blog.local';

async function createAdmin() {
    try {
        const uri = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
        await mongoose.connect(uri);

        // Check if admin already exists
        const existingAdmin = await User.findOne({ username: adminUsername });
        if (existingAdmin) {
            console.log('❌ Admin user "Author" already exists!');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create admin user
        const adminUser = new User({
            username: adminUsername,
            email: adminEmail,
            password: hashedPassword,
            bio: 'Blog Administrator',
            createdAt: new Date()
        });

        await adminUser.save();
        console.log('✅ Admin account created successfully!');
        console.log('📝 Username:', adminUsername);
        console.log('🔐 Password:', adminPassword);
        console.log('\n📌 Use these credentials to login at http://localhost:5000/admin');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
}

createAdmin();
