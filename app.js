// require('dotenv').config();

// const express = require('express');
// const expressLayout = require('express-ejs-layouts');

// const connectDB = require('./server/route/config/db');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to DB
// connectDB();

// app.use(express.static('public'));

// // Templating Engine
// app.use(expressLayout);
// app.set('layout', './layouts/main');
// app.set('view engine', 'ejs');

// app.use('/', require('./server/route/main'));

// app.use(express.json());
// app.use("/api", require("./server/route/postRoutes"));


// app.listen(PORT, () => {
//     console.log(`App listening on port ${PORT}`);
// });

require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
const methodOverride = require('method-override');
const connectDB = require('./server/route/config/db');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

const db = require('./server/route/config/db');
const { isActiveRoute } = require('./server/routerHelpers');

// Connect to DB first
connectDB();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;


// Routes
app.use('/', require('./server/route/main'));
app.use('/admin', require('./server/route/admin'));
app.use('/api', require('./server/route/postRoutes'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
