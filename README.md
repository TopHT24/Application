# 🛍️ Handicraft Store - E-Commerce Platform V2.0

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Express](https://img.shields.io/badge/Express-5.1.0-blue.svg)
![Jest](https://img.shields.io/badge/Jest-29.7.0-red.svg)
![Coverage](https://img.shields.io/badge/Coverage-70%25+-brightgreen.svg)
![License](https://img.shields.io/badge/License-ISC-yellow.svg)

**A modern, secure, and fully-tested e-commerce platform for handcrafted products from around the world.**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Testing](#-testing) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Browser Compatibility](#-browser-compatibility)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [Testing](#-testing)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Overview

Handicraft Store is a full-stack e-commerce platform designed to connect artisans with customers worldwide. Built with modern web technologies, it features a complete shopping cart system, real-time search, product suggestions, and comprehensive testing coverage.

### Why This Project?

- ✅ **Production-Ready**: Enterprise-level security and error handling
- ✅ **Fully Tested**: 90+ tests with >70% code coverage
- ✅ **Modern Architecture**: Clean, modular, and maintainable codebase
- ✅ **Great UX**: Real-time notifications, smooth animations, responsive design
- ✅ **RESTful API**: Well-documented API with 14 endpoints
- ✅ **Security First**: Helmet.js, CORS, rate limiting, input validation

---

## ✨ Features

### 🛒 Shopping Cart System
- Add items with quantity validation
- Update quantities in real-time
- Remove individual items
- Clear entire cart
- Persistent cart across sessions
- Stock validation
- Real-time total calculations

### 🔔 Real-Time Notifications
- Toast notifications (success, error, warning, info)
- Auto-dismiss with smooth animations
- Non-intrusive design
- Manual close option

### 🔍 Smart Search
- Real-time autocomplete
- Search by name, description, and tags
- Debounced input (300ms)
- Visual dropdown results
- Click outside to close

### 💡 Product Suggestions
- AI-powered recommendations
- Category-based suggestions
- "You might also like" feature
- Configurable limit

### 🔒 Security Features
- **Helmet.js**: Security headers (CSP, HSTS, etc.)
- **CORS**: Configurable cross-origin policies
- **Rate Limiting**: 100 requests/minute per IP
- **Input Validation**: All endpoints validated
- **Session Management**: Secure cookie handling
- **Error Sanitization**: No sensitive data exposure

### 📱 Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly buttons
- Optimized grids
- Smooth animations

### 🎨 User Experience
- Clean, modern UI
- Intuitive navigation
- Fast page loads
- Accessible design
- Loading states

---

## 🛠️ Tech Stack

### Backend
- **Node.js** (18+) - JavaScript runtime
- **Express.js** (5.1.0) - Web framework
- **Pug** (3.0.3) - Template engine
- **express-session** - Session management

### Security & Middleware
- **Helmet.js** (8.1.0) - Security headers
- **CORS** (2.8.5) - Cross-origin resource sharing
- **Morgan** (1.10.1) - HTTP request logger

### Testing
- **Jest** (29.7.0) - Testing framework
- **Supertest** (6.3.3) - HTTP assertions

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **CSS3** - Modern styling with CSS variables
- **Responsive Design** - Mobile-first approach

---

## 🌐 Browser Compatibility

### ✅ Recommended Browser

**Google Chrome (Latest Version)**

This application is optimized and fully tested on **Google Chrome**. For the best experience, please use Chrome.

### Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| **Chrome** | Latest | ✅ **Recommended** |
| Edge | Latest | ✅ Supported |
| Firefox | Latest | ⚠️ May require CSP adjustments |
| Safari | Latest | ⚠️ May require CORS adjustments |
| Opera | Latest | ✅ Supported |

### Safari Users

If using Safari, you may need to:
1. Disable "Prevent cross-site tracking" in Settings
2. Clear browser cache after first load
3. Use `http://127.0.0.1:3000` instead of `localhost`

**For development, Chrome is highly recommended!**

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Google Chrome** (latest version)
- **Git** (for cloning)

Check your versions:
```bash
node --version  # Should be v18+
npm --version   # Should be v9+
```

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/TopHT24/Application
cd Application/version2

```

### 2. Install Dependencies
```bash
npm install
```

This installs:
- Express, Pug, Helmet, CORS, Morgan (app dependencies)
- Jest, Supertest (testing dependencies)

```

### 6. Start the Server
```bash
npm start
```

Server runs on: **http://localhost:3000**

### 7. Open in Chrome
```bash
# Windows
start chrome http://localhost:3000

# Mac
open "Google Chrome" and go to  http://localhost:3000

# Linux
google-chrome http://localhost:3000
```


---

## 🔒 Security

### Security Features

- ✅ **Helmet.js** - Sets secure HTTP headers
- ✅ **CORS** - Configurable cross-origin policies
- ✅ **Rate Limiting** - Prevents API abuse (100 req/min)
- ✅ **Input Validation** - All inputs validated
- ✅ **Session Security** - HttpOnly cookies, sameSite
- ✅ **Error Handling** - No sensitive data in errors
- ✅ **CSP** - Content Security Policy configured
- ✅ **No SQL Injection** - Using in-memory storage

### Security Headers
```http
Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```



---

## 🎨 Screenshots

### Homepage
![Homepage](screenshots/homepage.png)

### Category Page
![Category](screenshots/category.png)

### Shopping Cart
![Cart](screenshots/cart.png)

### Real-Time Notifications
![Notifications](screenshots/notifications.png)

---

## 🗺️ Roadmap

### Version 2.0 (Planned)
- [ ] User authentication & authorization
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Payment processing (Stripe/PayPal)
- [ ] Order management system
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Product reviews & ratings
- [ ] Wishlist functionality
- [ ] Multi-language support

### Version 3.0 (Future)
- [ ] AI-powered product recommendations
- [ ] Real-time inventory tracking
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Social media integration
- [ ] Live chat support

---



## 🐛 Known Issues

### Browser-Specific Issues

**Safari:**
- May require CORS adjustments
- Use `http://127.0.0.1:3000` instead of localhost
- Disable "Prevent cross-site tracking" in Settings

**Firefox:**
- CSP may need adjustments for some features
- Works best with CSP disabled in development

**Solution:** Use **Google Chrome** for best experience!

---


```

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ for artisans worldwide

[Back to Top](#-handicraft-store---e-commerce-platform)

</div>



       
