// Validation middleware
const validateProductId = (req, res, next) => {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            success: false,
            error: 'Invalid product ID'
        });
    }
    
    next();
};

const validateCategory = (req, res, next) => {
    const { category } = req.params;
    const validCategories = ['Iran', 'Caribbean', 'Taiwanese'];
    
    if (!category || !validCategories.includes(category)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid category. Valid categories: ' + validCategories.join(', ')
        });
    }
    
    next();
};

const validateCartItem = (req, res, next) => {
    const { productId, quantity } = req.body;
    
    if (!productId || isNaN(parseInt(productId))) {
        return res.status(400).json({
            success: false,
            error: 'Invalid product ID'
        });
    }
    
    if (quantity && (isNaN(parseInt(quantity)) || parseInt(quantity) < 1)) {
        return res.status(400).json({
            success: false,
            error: 'Quantity must be a positive number'
        });
    }
    
    next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Not found middleware
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Resource not found'
    });
};

// Rate limiting helper (basic implementation)
const rateLimitMap = new Map();

const rateLimit = (maxRequests = 100, windowMs = 60000) => {
    return (req, res, next) => {
        const ip = req.ip;
        const now = Date.now();
        
        if (!rateLimitMap.has(ip)) {
            rateLimitMap.set(ip, []);
        }
        
        const requests = rateLimitMap.get(ip).filter(time => now - time < windowMs);
        
        if (requests.length >= maxRequests) {
            return res.status(429).json({
                success: false,
                error: 'Too many requests, please try again later'
            });
        }
        
        requests.push(now);
        rateLimitMap.set(ip, requests);
        
        next();
    };
};

module.exports = {
    validateProductId,
    validateCategory,
    validateCartItem,
    errorHandler,
    notFound,
    rateLimit
};
