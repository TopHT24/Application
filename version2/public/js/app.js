// NOTIFICATION SYSTEM

class NotificationManager {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = this.getIcon(type);
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icon}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        this.container.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    success(message) {
        this.show(message, 'success');
    }

    error(message) {
        this.show(message, 'error');
    }

    warning(message) {
        this.show(message, 'warning');
    }

    info(message) {
        this.show(message, 'info');
    }
}

const notify = new NotificationManager();

// ============= CART MANAGER =============


class CartManager {
    constructor() {
        this.cart = { items: [], total: 0, itemCount: 0 };
        this.loading = false;
        this.updateCartBadge();
    }

    async addToCart(productId, quantity = 1) {
        if (this.loading) return false;
        
        this.loading = true;
        try {
            const response = await fetch('/api/cart/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    productId: parseInt(productId), 
                    quantity: parseInt(quantity) 
                })
            });

            const result = await response.json();

            if (result.success) {
                this.cart = result.data;
                this.updateCartBadge();
                this.refreshCartDisplay();
                notify.success(result.message || 'Item added to cart!');
                return true;
            } else {
                notify.error(result.error || 'Failed to add item to cart');
                return false;
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            notify.error('Network error. Please try again.');
            return false;
        } finally {
            this.loading = false;
        }
    }

    async updateQuantity(productId, quantity) {
        if (this.loading) return false;
        
        quantity = parseInt(quantity);
        if (isNaN(quantity) || quantity < 1) {
            notify.error('Invalid quantity');
            return false;
        }

        this.loading = true;
        try {
            const response = await fetch(`/api/cart/items/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity })
            });

            const result = await response.json();

            if (result.success) {
                this.cart = result.data;
                this.updateCartBadge();
                this.refreshCartDisplay();
                return true;
            } else {
                notify.error(result.error || 'Failed to update cart');
                // Reload cart to get correct state
                await this.loadCart();
                return false;
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            notify.error('Network error. Please try again.');
            return false;
        } finally {
            this.loading = false;
        }
    }

    async removeFromCart(productId) {
        if (this.loading) return false;
        
        this.loading = true;
        try {
            const response = await fetch(`/api/cart/items/${productId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                this.cart = result.data;
                this.updateCartBadge();
                this.refreshCartDisplay();
                notify.success('Item removed from cart');
                return true;
            } else {
                notify.error(result.error || 'Failed to remove item');
                return false;
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            notify.error('Network error. Please try again.');
            return false;
        } finally {
            this.loading = false;
        }
    }

    async clearCart() {
        if (!confirm('Are you sure you want to clear your cart?')) {
            return false;
        }

        if (this.loading) return false;
        
        this.loading = true;
        try {
            const response = await fetch('/api/cart', {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                this.cart = result.data;
                this.updateCartBadge();
                this.refreshCartDisplay();
                notify.success('Cart cleared');
                return true;
            } else {
                notify.error(result.error || 'Failed to clear cart');
                return false;
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            notify.error('Network error. Please try again.');
            return false;
        } finally {
            this.loading = false;
        }
    }

    async loadCart() {
        try {
            const response = await fetch('/api/cart');
            const result = await response.json();

            if (result.success) {
                this.cart = result.data;
                this.updateCartBadge();
                this.refreshCartDisplay();
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            // Don't show error notification on page load
        }
    }

    updateCartBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        badges.forEach(badge => {
            const count = this.cart.itemCount || 0;
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline' : 'none';
        });
    }

    refreshCartDisplay() {
        // This will be called on the cart page to refresh the display
        if (typeof displayCart === 'function') {
            displayCart(this.cart);
        }
    }

    formatPrice(price) {
        return `$${parseFloat(price).toFixed(2)}`;
    }
}

// Global cart instance
const cart = new CartManager();

// ... rest of your app.js code (notifications, search, etc.) ...

// ============= PRODUCT SUGGESTIONS =============

async function loadSuggestions(productId, containerId) {
    try {
        const response = await fetch(`/api/products/${productId}/suggestions`);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            const container = document.getElementById(containerId);
            if (!container) return;

            container.innerHTML = '<h3>You might also like:</h3>';
            
            const suggestionsDiv = document.createElement('div');
            suggestionsDiv.className = 'suggestions-grid';

            result.data.forEach(product => {
                const productCard = createProductCard(product);
                suggestionsDiv.appendChild(productCard);
            });

            container.appendChild(suggestionsDiv);
        }
    } catch (error) {
        console.error('Error loading suggestions:', error);
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.img}" alt="${product.name}" loading="lazy">
        <h4>${product.name}</h4>
        <p class="price">${cart.formatPrice(product.price)}</p>
        <button onclick="cart.addToCart(${product.id})" class="btn btn-primary">
            Add to Cart
        </button>
    `;
    return card;
}

// ============= SEARCH FUNCTIONALITY =============

let searchTimeout;

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();

        if (query.length < 2) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            return;
        }

        searchTimeout = setTimeout(() => performSearch(query), 300);
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

async function performSearch(query) {
    const searchResults = document.getElementById('search-results');
    
    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            displaySearchResults(result.data);
        } else {
            searchResults.innerHTML = '<div class="no-results">No products found</div>';
            searchResults.style.display = 'block';
        }
    } catch (error) {
        console.error('Search error:', error);
        searchResults.innerHTML = '<div class="error">Search failed</div>';
        searchResults.style.display = 'block';
    }
}

function displaySearchResults(products) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = products.map(product => `
        <div class="search-result-item" onclick="window.location.href='/category/${product.category}'">
            <img src="${product.img}" alt="${product.name}">
            <div class="search-result-info">
                <h4>${product.name}</h4>
                <p class="price">${cart.formatPrice(product.price)}</p>
            </div>
        </div>
    `).join('');
    searchResults.style.display = 'block';
}

// ============= SMOOTH SCROLLING =============

function smoothScroll(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============= INITIALIZATION =============

document.addEventListener('DOMContentLoaded', () => {
    // Load cart on page load
    cart.loadCart();
    
    // Setup search if search input exists
    setupSearch();
    
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            smoothScroll(targetId);
        });
    });
});

// Expose functions globally
window.cart = cart;
window.notify = notify;
window.smoothScroll = smoothScroll;
window.loadSuggestions = loadSuggestions;
