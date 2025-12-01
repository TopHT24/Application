
// Cart page functionality

function displayCart(cartData) {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCartMessage = document.getElementById('empty-cart');

    if (!cartData || !cartData.items || cartData.items.length === 0) {
        if (cartItemsContainer) cartItemsContainer.innerHTML = '';
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }

    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';

    // Display cart items
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cartData.items.map(item => `
            <div class="cart-item" data-product-id="${item.productId}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='/images/placeholder.jpg'">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">${formatPrice(item.price)} each</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="btn-quantity btn-decrease" data-product-id="${item.productId}" data-quantity="${item.quantity}" ${item.quantity <= 1 ? 'disabled' : ''}>
                        −
                    </button>
                    <input type="number" 
                           value="${item.quantity}" 
                           min="1" 
                           max="100"
                           class="quantity-input"
                           data-product-id="${item.productId}"
                           readonly>
                    <button class="btn-quantity btn-increase" data-product-id="${item.productId}" data-quantity="${item.quantity}">
                        +
                    </button>
                </div>
                <div class="cart-item-subtotal">
                    <p class="subtotal-label">Subtotal</p>
                    <p class="subtotal-amount">${formatPrice(item.subtotal)}</p>
                </div>
                <div class="cart-item-remove">
                    <button class="btn-remove" data-product-id="${item.productId}" title="Remove item">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Display cart summary
    displayCartSummary(cartData);
    
    // Attach event listeners
    attachCartEventListeners();
}

function attachCartEventListeners() {
    // Decrease quantity buttons
    document.querySelectorAll('.btn-decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const currentQty = parseInt(this.getAttribute('data-quantity'));
            if (currentQty > 1) {
                updateCartItemQuantity(productId, currentQty - 1);
            }
        });
    });
    
    // Increase quantity buttons
    document.querySelectorAll('.btn-increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const currentQty = parseInt(this.getAttribute('data-quantity'));
            updateCartItemQuantity(productId, currentQty + 1);
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            removeCartItem(productId);
        });
    });
}

function displayCartSummary(cartData) {
    const summaryContainer = document.getElementById('cart-summary');
    if (!summaryContainer) return;
    
    const shipping = cartData.total > 0 ? 15.00 : 0; // Free shipping on empty cart
    const tax = cartData.total * 0.08; // 8% tax
    const total = cartData.total + shipping + tax;

    summaryContainer.innerHTML = `
        <h2>Order Summary</h2>
        <div class="summary-row">
            <span>Subtotal (${cartData.itemCount} items)</span>
            <span>${formatPrice(cartData.total)}</span>
        </div>
        <div class="summary-row">
            <span>Shipping</span>
            <span>${formatPrice(shipping)}</span>
        </div>
        <div class="summary-row">
            <span>Tax (8%)</span>
            <span>${formatPrice(tax)}</span>
        </div>
        <hr>
        <div class="summary-row summary-total">
            <span><strong>Total</strong></span>
            <span><strong>${formatPrice(total)}</strong></span>
        </div>
        <button onclick="proceedToCheckout()" class="btn btn-primary btn-checkout">
            Proceed to Checkout
        </button>
        <button onclick="continueShopping()" class="btn btn-secondary">
            Continue Shopping
        </button>
    `;
}

async function updateCartItemQuantity(productId, quantity) {
    if (isNaN(quantity) || quantity < 1) {
        notify.error('Invalid quantity');
        return;
    }
    
    try {
        const response = await fetch(`/api/cart/items/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: parseInt(quantity) })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Update global cart object
            if (window.cart) {
                window.cart.cart = result.data;
                window.cart.updateCartBadge();
            }
            // Redisplay cart
            displayCart(result.data);
            notify.success('Cart updated');
        } else {
            notify.error(result.error || 'Failed to update cart');
            // Reload cart to show correct state
            if (window.cart) {
                await window.cart.loadCart();
            }
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        notify.error('Failed to update cart');
    }
}

async function removeCartItem(productId) {
    if (!confirm('Remove this item from cart?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/cart/items/${productId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Update global cart
            if (window.cart) {
                window.cart.cart = result.data;
                window.cart.updateCartBadge();
            }
            // Redisplay cart
            displayCart(result.data);
            notify.success('Item removed from cart');
        } else {
            notify.error(result.error || 'Failed to remove item');
        }
    } catch (error) {
        console.error('Error removing item:', error);
        notify.error('Failed to remove item');
    }
}

function formatPrice(price) {
    return `$${parseFloat(price).toFixed(2)}`;
}

function proceedToCheckout() {
    if (!window.cart || !window.cart.cart.items || window.cart.cart.items.length === 0) {
        notify.warning('Your cart is empty');
        return;
    }
    
    notify.info('Checkout functionality coming soon!');
}

function continueShopping() {
    window.location.href = '/';
}

async function clearEntireCart() {
    if (!confirm('Are you sure you want to clear your cart?')) {
        return;
    }
    
    try {
        const response = await fetch('/api/cart', {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Update global cart
            if (window.cart) {
                window.cart.cart = result.data;
                window.cart.updateCartBadge();
            }
            // Redisplay cart
            displayCart(result.data);
            notify.success('Cart cleared');
        } else {
            notify.error(result.error || 'Failed to clear cart');
        }
    } catch (error) {
        console.error('Error clearing cart:', error);
        notify.error('Failed to clear cart');
    }
}

// Load cart when page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for cart to be initialized
    if (window.cart) {
        await window.cart.loadCart();
        displayCart(window.cart.cart);
    } else {
        // If cart not loaded yet, wait a bit
        setTimeout(async () => {
            if (window.cart) {
                await window.cart.loadCart();
                displayCart(window.cart.cart);
            }
        }, 100);
    }
});

// Expose functions globally
window.displayCart = displayCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.removeCartItem = removeCartItem;
window.proceedToCheckout = proceedToCheckout;
window.continueShopping = continueShopping;
window.clearEntireCart = clearEntireCart;
