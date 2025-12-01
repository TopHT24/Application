const { getProductById } = require('../data/products');

// In-memory cart storage (use database in production)
const carts = new Map();

class CartService {
    // Get or create cart for session
    static getCart(sessionId) {
        if (!carts.has(sessionId)) {
            carts.set(sessionId, {
                items: [],
                total: 0,
                itemCount: 0
            });
        }
        return carts.get(sessionId);
    }

    // Add item to cart
    static addItem(sessionId, productId, quantity = 1) {
        const product = getProductById(productId);
        
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.stock < quantity) {
            throw new Error('Insufficient stock');
        }

        const cart = this.getCart(sessionId);
        const existingItem = cart.items.find(item => item.productId === productId);

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (product.stock < newQuantity) {
                throw new Error('Insufficient stock');
            }
            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({
                productId,
                name: product.name,
                price: product.price,
                image: product.img,
                quantity,
                subtotal: product.price * quantity
            });
        }

        this.recalculateCart(cart);
        return cart;
    }

    // Update item quantity
    static updateItem(sessionId, productId, quantity) {
        if (quantity < 1) {
            throw new Error('Quantity must be at least 1');
        }

        const product = getProductById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.stock < quantity) {
            throw new Error('Insufficient stock');
        }

        const cart = this.getCart(sessionId);
        const item = cart.items.find(item => item.productId === productId);

        if (!item) {
            throw new Error('Item not in cart');
        }

        item.quantity = quantity;
        item.subtotal = item.price * quantity;

        this.recalculateCart(cart);
        return cart;
    }

    // Remove item from cart
    static removeItem(sessionId, productId) {
        const cart = this.getCart(sessionId);
        cart.items = cart.items.filter(item => item.productId !== productId);
        this.recalculateCart(cart);
        return cart;
    }

    // Clear cart
    static clearCart(sessionId) {
        carts.set(sessionId, {
            items: [],
            total: 0,
            itemCount: 0
        });
        return this.getCart(sessionId);
    }

    // Recalculate cart totals
    static recalculateCart(cart) {
        cart.total = cart.items.reduce((sum, item) => {
            item.subtotal = item.price * item.quantity;
            return sum + item.subtotal;
        }, 0);
        cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Get cart summary
    static getCartSummary(sessionId) {
        const cart = this.getCart(sessionId);
        return {
            itemCount: cart.itemCount,
            total: cart.total,
            items: cart.items.map(item => ({
                productId: item.productId,
                name: item.name,
                quantity: item.quantity
            }))
        };
    }
}

module.exports = CartService;
