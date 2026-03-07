const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
* MIDDLEWARE: Verify JWT Token
*/
const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            console.log('No token provided');
            return res.redirect('/admin');
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        console.log('Token verified for user:', decoded.username);
        next();
    } catch (error) {
        console.log('Token verification failed:', error.message);
        res.clearCookie('authToken');
        res.redirect('/admin');
    }
};

/**
*  GET /admin
* ADMIN DASHBOARD LOGIN_PAGE
*/

router.get('/', async (req, res) => {
   try {

        const locals = {
        title: "Admin Dashboard",
        description: "Simple blog built with Node.js, Express & MongoDB"
    }

       res.render('admin/index', { locals, layout: '../views/layouts/admin' });
   } catch (error) {
       console.log(error);  
    }
 });


 /**
*  POST /admin/login
* ADMIN DASHBOARD CHECK_LOGIN
*/

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('Login attempt:', { username });

        if (!username || !password) {
            return res.status(400).render('admin/index', {
                locals: {
                    title: "Admin Dashboard",
                    description: "Simple blog built with Node.js, Express & MongoDB",
                    message: "Username and password are required"
                },
                layout: '../views/layouts/admin'
            });
        }

        // Find user in database
        const user = await User.findOne({ username });
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('User not found in database');
            return res.status(401).render('admin/index', {
                locals: {
                    title: "Admin Dashboard",
                    description: "Simple blog built with Node.js, Express & MongoDB",
                    message: "Invalid username or password"
                },
                layout: '../views/layouts/admin'
            });
        }

        // Compare passwords using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            console.log('Password mismatch');
            return res.status(401).render('admin/index', {
                locals: {
                    title: "Admin Dashboard",
                    description: "Simple blog built with Node.js, Express & MongoDB",
                    message: "Invalid username or password"
                },
                layout: '../views/layouts/admin'
            });
        }

        // Create JWT Token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set token in cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Also store in session for backward compatibility
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.token = token;

        console.log('User logged in successfully:', user.username);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log('Login error:', error);
        res.status(500).render('admin/index', {
            locals: {
                title: "Admin Dashboard",
                description: "Simple blog built with Node.js, Express & MongoDB",
                message: "An error occurred during login"
            },
            layout: '../views/layouts/admin'
        });
    }
});


/**
*  GET /admin/dashboard
* ADMIN DASHBOARD (after login) - PROTECTED ROUTE
*/

router.get('/dashboard', verifyToken, async (req, res) => {
    try {
        console.log('Dashboard accessed by:', req.user.username);
        
        const locals = {
            title: "Admin Dashboard",
            description: "Simple blog built with Node.js, Express & MongoDB",
            username: req.user.username
        }

        const data = await Post.find().lean();
        res.render('admin/dashboard', { locals, data, layout: '../views/layouts/admin' });
    } catch (error) {
        console.log('Dashboard error:', error);
        res.status(500).send('Server Error');
    }
});


/**
*  POST /admin/register
* ADMIN REGISTER NEW USER
*/

router.post('/register', async (req, res) => {
    try {
        const { regUsername, regPassword } = req.body;

        console.log('Register attempt:', { regUsername });

        if (!regUsername || !regPassword) {
            return res.status(400).render('admin/index', {
                locals: {
                    title: "Admin Dashboard",
                    description: "Simple blog built with Node.js, Express & MongoDB",
                    message: "Username and password are required"
                },
                layout: '../views/layouts/admin'
            });
        }

        // Check if password is strong enough
        if (regPassword.length < 6) {
            return res.status(400).render('admin/index', {
                locals: {
                    title: "Admin Dashboard",
                    description: "Simple blog built with Node.js, Express & MongoDB",
                    message: "Password must be at least 6 characters long"
                },
                layout: '../views/layouts/admin'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username: regUsername });
        if (existingUser) {
            console.log('User already exists:', regUsername);
            return res.status(400).render('admin/index', {
                locals: {
                    title: "Admin Dashboard",
                    description: "Simple blog built with Node.js, Express & MongoDB",
                    message: "Username already exists"
                },
                layout: '../views/layouts/admin'
            });
        }

        // Hash password with bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(regPassword, salt);

        // Create new user with hashed password
        const newUser = new User({
            username: regUsername,
            password: hashedPassword
        });

        await newUser.save();
        console.log('User registered successfully:', regUsername);

        res.status(201).render('admin/index', {
            locals: {
                title: "Admin Dashboard",
                description: "Simple blog built with Node.js, Express & MongoDB",
                message: "User registered successfully! You can now login."
            },
            layout: '../views/layouts/admin'
        });
    } catch (error) {
        console.log('Register error:', error);
        res.status(500).render('admin/index', {
            locals: {
                title: "Admin Dashboard",
                description: "Simple blog built with Node.js, Express & MongoDB",
                message: "An error occurred during registration"
            },
            layout: '../views/layouts/admin'
        });
    }
});


/**
*  GET /admin/logout
* ADMIN LOGOUT
*/

router.get('/logout', (req, res) => {
    res.clearCookie('authToken');
    req.session = null;
    console.log('User logged out');
    res.redirect('/admin');
});


/**
*  GET /admin/create-test-user
* CREATE TEST USER
*/

router.get('/create-test-user', async (req, res) => {
    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Create a test user
        const testUser = new User({
            username: 'admin',
            password: hashedPassword
        });

        await testUser.save();
        console.log('Test user created: admin / admin123');
        
        res.json({ 
            message: 'Test user created successfully!',
            username: 'admin',
            password: 'admin123',
            note: 'Password is hashed in database with bcrypt'
        });
    } catch (error) {
        console.log('Error creating test user:', error);
        res.json({ 
            error: error.message 
        });
    }
});


/** 
 * GET /admin/add-post
 * Admin - Create New Post (Protected Route)
*/

router.get('/add-post', verifyToken, async (req, res) => {
    try {
        const locals = {
            title: "Add New Post",
            description: "Simple blog built with Node.js, Express & MongoDB",
            username: req.user.username
        }

        const data = await Post.find()
        res.render('admin/add-post', { locals, layout: '../views/layouts/admin' });
    } catch (error) {
        console.log(error);  
    }
});


/**
 * POST /admin/add-post
 * Admin - Save New Post
 */

router.post('/add-post', verifyToken, async (req, res) => {
    try {
        const { title, content } = req.body;

        console.log('Add post attempt by:', req.user.username);
        console.log('Request body:', { title, content });

        if (!title || !content) {
            return res.status(400).render('admin/add-post', {
                locals: {
                    title: "Add New Post",
                    description: "Simple blog built with Node.js, Express & MongoDB",
                    message: "Title and content are required",
                    username: req.user.username
                },
                layout: '../views/layouts/admin'
            });
        }

        // Create new post
        const newPost = new Post({
            title: title,
            content: content,
            author: req.user.username,
            userId: req.user.userId,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const savedPost = await newPost.save();
        console.log('Post created successfully:', title, 'ID:', savedPost._id);

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log('Add post error:', error);
        res.status(500).render('admin/add-post', {
            locals: {
                title: "Add New Post",
                description: "Simple blog built with Node.js, Express & MongoDB",
                message: "An error occurred while creating the post: " + error.message,
                username: req.user.username
            },
            layout: '../views/layouts/admin'
        });
    }
});

/** 
 * GET /admin/edit-post/:id
 * Admin - Edit Post
*/

router.get('/edit-post/:id', verifyToken, async (req, res) => {
    try {
        const locals = {
            title: "Edit Post",
            description: "Simple blog built with Node.js, Express & MongoDB",
            username: req.user.username
        }

        const data = await Post.findById(req.params.id);
        res.render('admin/edit-post', { locals, data, layout: '../views/layouts/admin' });
    } catch (error) {
        console.log(error);  
    }
});

/** 
 * PUT /admin/edit-post/:id
 * Admin - Update Post
*/

router.put('/edit-post/:id', verifyToken, async (req, res) => {
    try {
        const { title, content } = req.body;

        console.log('Edit post attempt by:', req.user.username, 'Post ID:', req.params.id);
        console.log('Request body:', { title, content });

        if (!title || !content) {
            const data = await Post.findById(req.params.id);
            return res.status(400).render('admin/edit-post', {
                locals: {
                    title: "Edit Post",
                    description: "Simple blog built with Node.js, Express & MongoDB",
                    username: req.user.username,
                    message: "Title and content are required"
                },
                data,
                layout: '../views/layouts/admin'
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id, 
            {
                title: title,
                content: content,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            console.log('Post not found for update:', req.params.id);
            return res.status(404).send('Post not found');
        }

        console.log('Post updated successfully:', req.params.id, 'New data:', updatedPost);
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log('Edit post error:', error);
        res.status(500).send('Error updating post: ' + error.message);
    }
});


/**
 * DELETE /admin/delete-post/:id
 * Admin - Delete Any Post (Admin has ultimate power)
 */

router.delete('/delete-post/:id', verifyToken, async (req, res) => {
    try {
        console.log('Delete post attempt by:', req.user.username, 'Post ID:', req.params.id);

        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            console.log('Post not found for deletion:', req.params.id);
            return res.status(404).send('Post not found');
        }

        console.log('Post deleted successfully by admin:', req.params.id);
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log('Delete post error:', error);
        res.status(500).send('Error deleting post: ' + error.message);
    }
});

/**
 * GET /admin/logout
 * Admin - Logout
 */

router.get('/logout', (req, res) => {
    res.clearCookie('authToken');
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.log('Error destroying session:', err);
            }
        });
    }
    console.log('User logged out');
    res.redirect('/admin');
});

module.exports = router;    