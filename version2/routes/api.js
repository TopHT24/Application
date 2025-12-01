const express = require('express');
const router = express.Router();
const {
    products,
    getProductById,
    getProductsByCategory,
    getAllCategories,
    searchProducts,
    getSuggestions
} = require('../data/products');
const CartService = require('../services/cartService');
const {
    validateProductId,
    validateCategory,
    validateCartItem
} = require('../middleware/validators');

// ============= PRODUCT ROUTES =============

// GET /api/products - Get all products with optional filters
router.get('/products', (req, res) => {
    const { category, search, limit, offset } = req.query;
    
    let result = products;
    
    // Filter by category
    if (category) {
        result = getProductsByCategory(category);
    }
    
    // Search
    if (search) {
        result = searchProducts(search);
    }
    
    // Pagination
    const startIndex = parseInt(offset) || 0;
    const endIndex = limit ? startIndex + parseInt(limit) : result.length;
    const paginatedResults = result.slice(startIndex, endIndex);
    
    res.json({
        success: true,
        data: paginatedResults,
        total: result.length,
        offset: startIndex,
        limit: limit ? parseInt(limit) : result.length
    });
});

// GET /api/products/:id - Get single product
router.get('/products/:id', validateProductId, (req, res) => {
    const product = getProductById(req.params.id);
    
    if (!product) {
        return res.status(404).json({
            success: false,
            error: 'Product not found'
        });
    }
    
    res.json({
        success: true,
        data: product
    });
});

// GET /api/products/:id/suggestions - Get product suggestions
router.get('/products/:id/suggestions', validateProductId, (req, res) => {
    const limit = parseInt(req.query.limit) || 3;
    const suggestions = getSuggestions(req.params.id, limit);
    
    res.json({
        success: true,
        data: suggestions
    });
});

// GET /api/categories - Get all categories
router.get('/categories', (req, res) => {
    const categories = getAllCategories();
    
    res.json({
        success: true,
        data: categories
    });
});

// GET /api/categories/:category - Get products by category
router.get('/categories/:category', validateCategory, (req, res) => {
    const categoryProducts = getProductsByCategory(req.params.category);
    
    res.json({
        success: true,
        data: categoryProducts,
        total: categoryProducts.length
    });
});

// ============= CART ROUTES =============

// Helper to get session ID
const getSessionId = (req) => {
    return req.sessionID || req.ip || 'default';
};

// GET /api/cart - Get cart contents
router.get('/cart', (req, res) => {
    const sessionId = getSessionId(req);
    const cart = CartService.getCart(sessionId);
    
    res.json({
        success: true,
        data: cart
    });
});

// POST /api/cart/items - Add item to cart
router.post('/cart/items', validateCartItem, (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const { productId, quantity = 1 } = req.body;
        
        const cart = CartService.addItem(sessionId, parseInt(productId), parseInt(quantity));
        const product = getProductById(productId);
        
        res.status(201).json({
            success: true,
            message: `${product.name} added to cart`,
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// PUT /api/cart/items/:productId - Update cart item quantity
router.put('/cart/items/:productId', validateProductId, (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const { quantity } = req.body;
        
        if (!quantity || parseInt(quantity) < 1) {
            return res.status(400).json({
                success: false,
                error: 'Invalid quantity'
            });
        }
        
        const cart = CartService.updateItem(
            sessionId,
            parseInt(req.params.productId),
            parseInt(quantity)
        );
        
        res.json({
            success: true,
            message: 'Cart updated',
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// DELETE /api/cart/items/:productId - Remove item from cart
router.delete('/cart/items/:productId', validateProductId, (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const cart = CartService.removeItem(sessionId, parseInt(req.params.productId));
        
        res.json({
            success: true,
            message: 'Item removed from cart',
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// DELETE /api/cart - Clear cart
router.delete('/cart', (req, res) => {
    const sessionId = getSessionId(req);
    const cart = CartService.clearCart(sessionId);
    
    res.json({
        success: true,
        message: 'Cart cleared',
        data: cart
    });
});

// GET /api/cart/summary - Get cart summary
router.get('/cart/summary', (req, res) => {
    const sessionId = getSessionId(req);
    const summary = CartService.getCartSummary(sessionId);
    
    res.json({
        success: true,
        data: summary
    });
});

// ============= SEARCH ROUTE =============

// GET /api/search - Search products
router.get('/search', (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        return res.status(400).json({
            success: false,
            error: 'Search query required'
        });
    }
    
    const results = searchProducts(q);
    
    res.json({
        success: true,
        data: results,
        total: results.length,
        query: q
    });
});

module.exports = router;
