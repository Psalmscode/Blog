require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
// Updated for connect-mongo v6 compatibility with CommonJS (require)
const MongoStore = require('connect-mongo').default; 
const methodOverride = require('method-override');
const connectDB = require('./server/route/config/db');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

const { isActiveRoute } = require('./server/routerHelpers');

// 1. Connect to Database
connectDB();

// 2. Standard Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

// 3. Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        // Tries MONGO_URL first, then MONGODB_URI as a backup
        mongoUrl: process.env.MONGO_URL || process.env.MONGODB_URI,
        ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        // secure: true is required if your site is served over HTTPS (Render does this)
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        httpOnly: true
    }
}));

// 4. Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

// 5. Routes
app.use('/', require('./server/route/main'));
app.use('/', require('./server/route/userRoutes'));
app.use('/admin', require('./server/route/admin'));
app.use('/api', require('./server/route/postRoutes'));

// 6. Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});