// Initialize owner dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    updateStats();
    checkForNewOrders();
    
    // Check for new orders every 2 seconds
    setInterval(() => {
        checkForNewOrders();
        loadOrders();
        updateStats();
    }, 2000);
});

// Load and display orders
function loadOrders() {
    const ordersContainer = document.getElementById('orders-container');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p class="no-orders">No orders yet. Waiting for customers...</p>';
        return;
    }

    ordersContainer.innerHTML = '';

    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = `order-card ${order.isNew ? 'new' : ''}`;
        orderCard.onclick = () => showOrderDetails(order);
        
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        orderCard.innerHTML = `
            <div class="order-header">
                <div>
                    <div class="order-id">Order #${order.id.slice(-6)}</div>
                    <div class="order-date">${formattedDate}</div>
                </div>
                <span class="order-status">${order.status}</span>
            </div>
            <div class="order-info">
                <div class="order-info-item">
                    <div class="order-info-label">Customer</div>
                    <div class="order-info-value">${order.customerName}</div>
                </div>
                <div class="order-info-item">
                    <div class="order-info-label">Items</div>
                    <div class="order-info-value">${order.items.reduce((sum, item) => sum + item.quantity, 0)} items</div>
                </div>
                <div class="order-info-item">
                    <div class="order-info-label">Total</div>
                    <div class="order-info-value">$${order.total.toFixed(2)}</div>
                </div>
            </div>
        `;
        ordersContainer.appendChild(orderCard);
    });

    // Mark orders as not new after displaying
    orders.forEach(order => {
        if (order.isNew) {
            order.isNew = false;
        }
    });
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Update dashboard statistics
function updateStats() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    document.getElementById('total-orders').textContent = orders.length;
    document.getElementById('pending-orders').textContent = pendingOrders;
    document.getElementById('total-revenue').textContent = totalRevenue.toFixed(2);
}

// Check for new orders and show notification
function checkForNewOrders() {
    const hasNewOrder = localStorage.getItem('newOrderNotification') === 'true';
    const notificationBadge = document.getElementById('notification-badge');

    if (hasNewOrder) {
        notificationBadge.style.display = 'inline-block';
        
        // Clear notification after 10 seconds
        setTimeout(() => {
            localStorage.setItem('newOrderNotification', 'false');
            notificationBadge.style.display = 'none';
        }, 10000);
    } else {
        notificationBadge.style.display = 'none';
    }
}

// Show order details in modal
function showOrderDetails(order) {
    const modal = document.getElementById('order-modal');
    const orderDetails = document.getElementById('order-details');

    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    let itemsHtml = '';
    order.items.forEach(item => {
        itemsHtml += `
            <div class="order-item-detail">
                <div>
                    <div class="order-item-name">${item.emoji} ${item.name}</div>
                    <div class="order-item-quantity">Quantity: ${item.quantity}</div>
                </div>
                <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `;
    });

    orderDetails.innerHTML = `
        <div class="order-detail">
            <h3>Order Details</h3>
            <div style="margin-bottom: 1.5rem;">
                <div class="order-info-item" style="margin-bottom: 0.5rem;">
                    <div class="order-info-label">Order ID</div>
                    <div class="order-info-value">#${order.id.slice(-6)}</div>
                </div>
                <div class="order-info-item" style="margin-bottom: 0.5rem;">
                    <div class="order-info-label">Date & Time</div>
                    <div class="order-info-value">${formattedDate}</div>
                </div>
                <div class="order-info-item" style="margin-bottom: 0.5rem;">
                    <div class="order-info-label">Status</div>
                    <div class="order-info-value">
                        <span class="order-status">${order.status}</span>
                    </div>
                </div>
            </div>

            <h4 style="margin: 1.5rem 0 1rem 0; color: var(--text-dark);">Customer Information</h4>
            <div style="background: var(--bg-light); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <div class="order-info-item" style="margin-bottom: 0.5rem;">
                    <div class="order-info-label">Name</div>
                    <div class="order-info-value">${order.customerName}</div>
                </div>
                <div class="order-info-item" style="margin-bottom: 0.5rem;">
                    <div class="order-info-label">Email</div>
                    <div class="order-info-value">${order.customerEmail}</div>
                </div>
                <div class="order-info-item" style="margin-bottom: 0.5rem;">
                    <div class="order-info-label">Phone</div>
                    <div class="order-info-value">${order.customerPhone}</div>
                </div>
                <div class="order-info-item">
                    <div class="order-info-label">Address</div>
                    <div class="order-info-value">${order.customerAddress}</div>
                </div>
            </div>

            <h4 style="margin: 1.5rem 0 1rem 0; color: var(--text-dark);">Order Items</h4>
            <div class="order-items-list">
                ${itemsHtml}
            </div>

            <div class="order-total">
                <span>Total Amount:</span>
                <span>$${order.total.toFixed(2)}</span>
            </div>

            <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                <button class="btn-primary" onclick="updateOrderStatus('${order.id}', 'completed')" style="flex: 1;">
                    Mark as Completed
                </button>
                <button class="btn-primary" onclick="updateOrderStatus('${order.id}', 'cancelled')" style="flex: 1; background: var(--danger-color);">
                    Cancel Order
                </button>
            </div>
        </div>
    `;

    modal.classList.add('show');
}

// Update order status
function updateOrderStatus(orderId, status) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        order.status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
        updateStats();
        closeOrderModal();
    }
}

// Close order modal
function closeOrderModal() {
    const modal = document.getElementById('order-modal');
    modal.classList.remove('show');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('order-modal');
    if (event.target === modal) {
        closeOrderModal();
    }
}

