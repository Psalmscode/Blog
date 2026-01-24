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

// require('dotenv').config();

// const express = require('express');
// const expressLayout = require('express-ejs-layouts');
// const session = require('express-session');
// const methodOverride = require('method-override');
// const connectDB = require('./server/route/config/db');
// const cookieParser = require('cookie-parser');

// const app = express();
// const PORT = process.env.PORT || 5000;

// const db = require('./server/route/config/db');
// const { isActiveRoute } = require('./server/routerHelpers');

// // Connect to DB first
// connectDB();

// // Middleware
// app.use(express.static('public'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(methodOverride('_method'));

// // Session Configuration
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24 // 24 hours
//     }
// }));

// // Templating Engine
// app.use(expressLayout);
// app.set('layout', './layouts/main');
// app.set('view engine', 'ejs');

// app.locals.isActiveRoute = isActiveRoute;


// // Routes
// app.use('/', require('./server/route/main'));
// app.use('/admin', require('./server/route/admin'));
// app.use('/api', require('./server/route/postRoutes'));

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
const MongoStore = require('connect-mongo');
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

// 3. Session Configuration (Fixed for Render & MongoDB)
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        ttl: 14 * 24 * 60 * 60 // Sessions saved for 14 days
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        // Set secure to true if on Render (production)
        secure: process.env.NODE_ENV === 'production',
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
app.use('/admin', require('./server/route/admin'));
app.use('/api', require('./server/route/postRoutes'));

// 6. Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});