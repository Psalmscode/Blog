const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const nodemailer = require('nodemailer');


/**
*  GET /
* HOME  
*/
router.get('', async (req, res) => {

    try {

        const locals = {
        title: "Node.js Blog",
        description: "Simple blog built with Node.js, Express & MongoDB"
    }
    
       let perPage = 20;
       let page = parseInt(req.query.page) || 1;

       // Validate page number
       if (page < 1) {
           page = 1;
       }

       const data = await Post.aggregate([
        { $sort: { createdAt: -1 } },
        { $skip: perPage * page - perPage },
        { $limit: perPage }
       ]).exec();
        
       const count = await Post.countDocuments();
       const nextPage = parseInt(page) + 1;
       const hasNextPage = nextPage <= Math.ceil(count / perPage);


        res.render('index', { 
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
         });

    } catch (error) {
        console.log(error);  
    }

});

/**
 * GET /posts
 * All Posts
 */
router.get('/posts', async (req, res) => {
    try {
        const locals = {
            title: "All Posts - Node.js Blog",
            description: "Simple blog built with Node.js, Express & MongoDB",
            currentRoute: '/posts'
        };

        let perPage = 10;
        let page = parseInt(req.query.page) || 1;

        // Validate page number
        if (page < 1) {
            page = 1;
        }

        const data = await Post.aggregate([
            { $sort: { createdAt: -1 } },
            { $skip: perPage * page - perPage },
            { $limit: perPage }
        ]).exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('posts', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            layout: '../views/layouts/main'
        });
    } catch (error) {
        console.log('Posts page error:', error);
        res.status(500).send('Internal Server Error');
    }
});

/**
* GET /
* POST :id
*/
// router.get('/post/:id', async (req, res) => {
//     try {

//         const locals = {
//         title: "Node.js Blog",
//         description: "Simple blog built with Node.js, Express & MongoDB"
//     }

//         let slug = req.params.id;

//         const data = await Post.findById({ _id: slug });
//         res.render('post', { locals, data });
//     } catch (error) {
//         console.log(error);  
//     }

// });

router.get('/post/:id', async (req, res) => {
    try {
        const locals = {
            title: "Node.js Blog",
            description: "Simple blog built with Node.js, Express & MongoDB"
        };

        let slug = req.params.id;

        // FIX 1: Use findById(slug) directly. 
        // findById takes the string ID, not an object with _id.
        const data = await Post.findById(slug);

        // FIX 2: Ensure 'locals' is passed so the header doesn't crash,
        // and check if data exists before rendering.
        if (!data) {
            return res.status(404).send("Post not found");
        }

        res.render('post', { 
            locals, 
            data,
            layout: '../views/layouts/main' // Only include if using express-ejs-layouts
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});


/**
* POST /search
* Search Posts
*/
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search Results - Node.js Blog",
            description: "Simple blog built with Node.js, Express & MongoDB",
            currentRoute: '/search'
        };

        let searchTerm = req.body.searchTerm;
        
        if (!searchTerm || searchTerm.trim() === '') {
            return res.redirect('/');
        }

        // Search for posts by title or content
        const data = await Post.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { content: { $regex: searchTerm, $options: 'i' } }
            ]
        });

        res.render('search', { 
            locals,
            data,
            searchTerm,
            layout: '../views/layouts/main'
        });
    } catch (error) {
        console.log('Search error:', error);
        res.status(500).send('Internal Server Error');
    }
});  


/**
 * GET /about
 * About Page
 */
router.get('/about', (req, res) => {
    try {
        const locals = {
            title: "About - Node.js Blog",
            description: "Simple blog built with Node.js, Express & MongoDB",
            currentRoute: '/about'
        };

        res.render('about', { 
            locals,
            layout: '../views/layouts/main'
        });
    } catch (error) {
        console.log('About page error:', error);
        res.status(500).send('Internal Server Error');
    }
});


/**
 * GET /contact
 * Contact Page
 */
router.get('/contact', (req, res) => {
    try {
        const locals = {
            title: "Contact - Node.js Blog",
            description: "Simple blog built with Node.js, Express & MongoDB",
            currentRoute: '/contact'
        };

        res.render('contact', { 
            locals,
            layout: '../views/layouts/main'
        });
    } catch (error) {
        console.log('Contact page error:', error);
        res.status(500).send('Internal Server Error');
    }
});


/**
 * POST /contact
 * Handle Contact Form Submission
 */
router.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        console.log('Contact form submission:', { name, email, subject });

        // Validate form data
        if (!name || !email || !subject || !message) {
            return res.status(400).render('contact', {
                locals: {
                    title: "Contact - Node.js Blog",
                    description: "Simple blog built with Node.js, Express & MongoDB",
                    currentRoute: '/contact',
                    message: 'Please fill in all fields'
                },
                layout: '../views/layouts/main'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).render('contact', {
                locals: {
                    title: "Contact - Node.js Blog",
                    description: "Simple blog built with Node.js, Express & MongoDB",
                    currentRoute: '/contact',
                    message: 'Please provide a valid email address'
                },
                layout: '../views/layouts/main'
            });
        }

        // Configure email transporter
        if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
            throw new Error('Email configuration is missing. Please set GMAIL_USER and GMAIL_PASSWORD in your .env file. Use an App Password, not your regular Gmail password.');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD
            }
        });

        // Verify transporter connection before sending
        await transporter.verify();

        // Email content to send to admin
        const adminMailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER, // Send to yourself
            subject: `New Contact Form: ${subject}`,
            html: `
                <h2>New Contact Message</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <h3>Message:</h3>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p>This is an automated email from your blog contact form.</p>
            `
        };

        // Email content to send to user
        const userMailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'We received your message - ' + process.env.BLOG_NAME || 'Node.js Blog',
            html: `
                <h2>Thank you for contacting us!</h2>
                <p>Hi ${name},</p>
                <p>We have received your message and will get back to you as soon as possible.</p>
                <hr>
                <h3>Your Message Summary:</h3>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p>Best regards,<br>The Blog Team</p>
            `
        };

        // Send emails
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);

        console.log('Emails sent successfully for message from:', email);

        res.status(200).render('contact', {
            locals: {
                title: "Contact - Node.js Blog",
                description: "Simple blog built with Node.js, Express & MongoDB",
                currentRoute: '/contact',
                message: 'Thank you for your message! We will get back to you soon. Check your email for confirmation.',
                successMessage: true
            },
            layout: '../views/layouts/main'
        });

    } catch (error) {
        console.log('Contact form error:', error);
        
        let errorMessage = 'An error occurred while sending your message. Please try again.';
        if (error.message.includes('Invalid login')) {
            errorMessage = 'Email configuration error. Please contact the administrator.';
        }

        res.status(500).render('contact', {
            locals: {
                title: "Contact - Node.js Blog",
                description: "Simple blog built with Node.js, Express & MongoDB",
                currentRoute: '/contact',
                message: errorMessage
            },
            layout: '../views/layouts/main'
        });
    }
});

module.exports = router;


// function insertPostData() {
//    Post.insertMany([
//        {
//            title: "Building a Blog",
//            content: "This is the content text.",
//            author: "Wonder",
//            createdAt: new Date(),
//            updatedAt: new Date()
//        },
//        {
//            title: "Second Post",
//            content: "This is the content text.",
//            author: "Wonder",
//            createdAt: new Date(),
//            updatedAt: new Date()
//        }
//    ]);
// }

// insertPostData();
