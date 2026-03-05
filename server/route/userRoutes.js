const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware: Verify JWT Token
const verifyToken = (req, res, next) => {
    const token = req.cookies.userToken || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.clearCookie('userToken');
        res.redirect('/login');
    }
};

// Middleware: Check if user owns the post
const checkPostOwnership = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).send('Post not found');
        }

        // Check if user owns the post or is the creator
        if (post.userId && post.userId.toString() !== req.user.userId) {
            return res.status(403).send('You do not have permission to modify this post');
        }

        req.post = post;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

// GET /register
router.get('/register', (req, res) => {
    res.render('register', {
        locals: { title: 'Register', currentRoute: '/register' }
    });
});

// POST /register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (!username || !email || !password || !confirmPassword) {
            return res.render('register', {
                locals: { 
                    title: 'Register', 
                    message: 'All fields are required',
                    currentRoute: '/register'
                }
            });
        }

        if (password !== confirmPassword) {
            return res.render('register', {
                locals: { 
                    title: 'Register', 
                    message: 'Passwords do not match',
                    currentRoute: '/register'
                }
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.render('register', {
                locals: { 
                    title: 'Register', 
                    message: 'Username or email already exists',
                    currentRoute: '/register'
                }
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Create token
        const token = jwt.sign(
            { userId: user._id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('userToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.render('register', {
            locals: { 
                title: 'Register', 
                message: 'An error occurred',
                currentRoute: '/register'
            }
        });
    }
});

// GET /login
router.get('/login', (req, res) => {
    res.render('login', {
        locals: { title: 'Login', currentRoute: '/login' }
    });
});

// POST /login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', {
                locals: { 
                    title: 'Login', 
                    message: 'Invalid email or password',
                    currentRoute: '/login'
                }
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.render('login', {
                locals: { 
                    title: 'Login', 
                    message: 'Invalid email or password',
                    currentRoute: '/login'
                }
            });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('userToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.status(500).render('login', {
            locals: { 
                title: 'Login', 
                message: 'An error occurred',
                currentRoute: '/login'
            }
        });
    }
});

// GET /dashboard (User Dashboard)
router.get('/dashboard', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        
        res.render('dashboard', {
            locals: { 
                title: 'Dashboard', 
                currentRoute: '/dashboard',
                user
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// GET /profile (Edit profile)
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        
        res.render('profile', {
            locals: { 
                title: 'Edit Profile',
                currentRoute: '/profile',
                user
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// PUT /profile (Update profile)
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { username, bio } = req.body;
        
        await User.findByIdAndUpdate(
            req.user.userId,
            { username, bio },
            { new: true }
        );

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// GET /logout
router.get('/logout', (req, res) => {
    res.clearCookie('userToken');
    res.redirect('/');
});


/**
 * USER POST MANAGEMENT ROUTES
 */

// GET /user/posts - View user's own posts
router.get('/user/posts', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        
        res.render('user/my-posts', {
            locals: {
                title: 'My Posts',
                currentRoute: '/user/posts',
                user: req.user,
                posts: posts || []
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// GET /user/add-post - Add new post form
router.get('/user/add-post', verifyToken, (req, res) => {
    try {
        res.render('user/add-post', {
            locals: {
                title: 'Add New Post',
                currentRoute: '/user/add-post',
                user: req.user
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// POST /user/add-post - Create new post
router.post('/user/add-post', verifyToken, async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.render('user/add-post', {
                locals: {
                    title: 'Add New Post',
                    currentRoute: '/user/add-post',
                    user: req.user,
                    message: 'Title and content are required'
                }
            });
        }

        const newPost = new Post({
            title,
            content,
            author: req.user.username,
            userId: req.user.userId,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newPost.save();
        console.log('User post created:', title, 'by:', req.user.username);

        res.redirect('/user/posts');
    } catch (error) {
        console.log(error);
        res.render('user/add-post', {
            locals: {
                title: 'Add New Post',
                currentRoute: '/user/add-post',
                user: req.user,
                message: 'An error occurred while creating the post'
            }
        });
    }
});

// GET /user/edit-post/:id - Edit post form
router.get('/user/edit-post/:id', verifyToken, checkPostOwnership, async (req, res) => {
    try {
        res.render('user/edit-post', {
            locals: {
                title: 'Edit Post',
                currentRoute: '/user/edit-post',
                user: req.user,
                post: req.post
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// PUT /user/edit-post/:id - Update post
router.put('/user/edit-post/:id', verifyToken, checkPostOwnership, async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.render('user/edit-post', {
                locals: {
                    title: 'Edit Post',
                    currentRoute: '/user/edit-post',
                    user: req.user,
                    post: req.post,
                    message: 'Title and content are required'
                }
            });
        }

        await Post.findByIdAndUpdate(
            req.params.id,
            { title, content, updatedAt: new Date() },
            { new: true }
        );

        console.log('User post updated:', req.params.id, 'by:', req.user.username);
        res.redirect('/user/posts');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE /user/delete-post/:id - Delete user's own post
router.delete('/user/delete-post/:id', verifyToken, checkPostOwnership, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        
        console.log('User post deleted:', req.params.id, 'by:', req.user.username);
        res.redirect('/user/posts');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error deleting post');
    }
});

module.exports = router;
