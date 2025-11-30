# ShopEasy - E-Commerce App

A modern e-commerce application with separate customer and owner interfaces. When customers place orders, the owner receives notifications in their dedicated dashboard.

## Features

### Customer App (`index.html`)
- Browse products with beautiful UI
- Add products to cart
- View and manage cart items
- Place orders with customer information
- Order confirmation

### Owner Dashboard (`owner.html`)
- View all customer orders
- Real-time order notifications
- Order statistics (total orders, pending orders, revenue)
- Detailed order information
- Update order status (completed/cancelled)
- Customer contact information

## How to Use

1. **For Customers:**
   - Open `index.html` in your web browser
   - Browse products and add them to your cart
   - Click the cart icon to view your items
   - Click "Checkout" to place an order
   - Enter your name, email, address, and phone when prompted

2. **For Store Owner:**
   - Open `owner.html` in your web browser (can be in a separate tab/window)
   - View all incoming orders in real-time
   - Click on any order to see full details
   - Update order status as needed
   - New orders will show a notification badge

## Technical Details

- **Storage:** Uses browser localStorage to store orders and cart data
- **Communication:** Both apps share the same localStorage, so orders placed in the customer app immediately appear in the owner dashboard
- **Real-time Updates:** Owner dashboard checks for new orders every 2 seconds
- **Privacy:** Customers cannot see orders placed by other customers - only the owner can see all orders

## Files Structure

- `index.html` - Customer-facing e-commerce store
- `owner.html` - Owner/admin dashboard
- `styles.css` - Shared styling for both apps
- `app.js` - Customer app functionality
- `owner.js` - Owner dashboard functionality

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- localStorage API
- CSS Grid and Flexbox

## Notes

- This is a front-end only application using localStorage
- Data persists in the browser until cleared
- For production use, consider implementing a backend server with a database

