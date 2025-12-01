const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');


const apiRoutes = require('./routes/api');
const { errorHandler, notFound, rateLimit } = require('./middleware/validators');
const { getProductsByCategory, getAllCategories } = require('./data/products');

const app = express();



//security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'","http://localhost:3000"],
            scriptSrc: ["'self'", "'unsafe-inline'","http://localhost:3000"],
	    scriptSrcAttr: ["'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "http:","https:"],
	   
        },
    },
    hsts: false
}));

// CORS
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));

// Rate limiting
app.use('/api/', rateLimit(100, 60000)); // 100 requests per minute


// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'handicraft-store-secret-key-change-in-production',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));



app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//static files

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));



// Home page
app.get('/', (req, res) => {
    const categories = getAllCategories();
    res.render('index', { 
        title: 'Handicraft Store - Unique Handmade Products',
        categories 
    });
});

// Category page
app.get('/category/:category', (req, res) => {
    const category = req.params.category;
    const products = getProductsByCategory(category);
    
    if (!products || products.length === 0) {
        return res.status(404).render('error', {
            title: 'Category Not Found',
            message: 'The requested category does not exist.'
        });
    }
    
    res.render('category', {
        title: `${category} Handicrafts`,
        category,
        products
    });
});

// Cart page
app.get('/cart', (req, res) => {
    res.render('cart', {
        title: 'Shopping Cart'
    });
});

// About page
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us'
    });
});



app.use('/api', apiRoutes);

//health check

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

//errors

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

//start server

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`
    ╔════════════════════════════════════════════╗
    ║   Handicraft Store Server                  ║
    ╠════════════════════════════════════════════╣
    ║   Server running on http://localhost:${PORT}  ║
    ║   Environment: ${process.env.NODE_ENV || 'development'}                ║
    ║   Press Ctrl+C to stop                     ║
    ╚════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

module.exports = app;



