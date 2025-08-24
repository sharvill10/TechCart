# 🚀 TechCart

> **Next-Generation E-Commerce Platform for Tech Enthusiasts**

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-00D8FF.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)

**Built for Scale • Designed for Performance • Crafted for Excellence**

![TechCart Demo](./screenshots/demo.gif)

</div>

---

## 📸 **Screenshots**

<div align="center">

### 🏠 **Home Page**
<img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/c145d1f9-c612-4ba7-afc2-5c6447cc4431" />


### 🛒 **Shopping Experience**
<table>
<tr>
<td><img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/84178dc0-6fd6-483a-9018-29c864e24350" /></td>
<td><img width="1919" height="916" alt="image" src="https://github.com/user-attachments/assets/5ae56b41-6aa9-4ffa-b478-b2abd19e271a" />
</td>
</tr>
<tr>
<td align="center"><strong>Product Catalog</strong></td>
<td align="center"><strong>Shopping Cart</strong></td>
</tr>
</table>

### 💳 **Checkout Process**
<table>
<tr>
<td><img width="1919" height="908" alt="image" src="https://github.com/user-attachments/assets/d99a5c12-50cc-431b-999f-8133df1908f5" />
</td>
<td><img width="1919" height="916" alt="image" src="https://github.com/user-attachments/assets/3c8fa6c4-9703-416a-bc8a-aa875739e1f8" /></td>
<td><img width="1919" height="908" alt="image" src="https://github.com/user-attachments/assets/d9349cf1-588f-4e01-95e5-4c8312c04701" />
</td>
</tr>
<tr>
<td align="center"><strong>Checkout</strong></td>
<td align="center"><strong>Payment</strong></td>
<td align="center"><strong>Confirmation</strong></td>
</tr>
</table>

### 👑 **Admin Dashboard**
<table>
<tr>
<td><img width="1919" height="798" alt="image" src="https://github.com/user-attachments/assets/06f996d9-6cfd-47e7-ab15-f106257a769b" />
</td>
<td><img width="1919" height="899" alt="image" src="https://github.com/user-attachments/assets/305acd7e-40aa-4367-a1db-ce2c436dca0b" />

</td>
</tr>
<tr>
<td align="center"><strong>Order Mangement</strong></td>
<td align="center"><strong>Product Management</strong></td>
</tr>
</table>

### 📱 **Mobile Responsive**
<table>
<tr>
<td><img width="200" height="400" alt="Mobile Home" src="https://github.com/user-attachments/assets/45f276cb-e8c9-4da5-946c-2cbecdd9bf6d" /></td>
<td><img width="200" height="400" alt="Mobile Products" src="https://github.com/user-attachments/assets/50415478-e8ce-41b3-a4c4-36b132f5a52a" /></td>
<td><img width="200" height="400" alt="Mobile Cart" src="https://github.com/user-attachments/assets/be368403-6be4-4606-9e49-eed4780eac63" /></td>
<td><img width="200" height="400" alt="Mobile Checkout" src="https://github.com/user-attachments/assets/82af4f9f-17c6-430f-9a32-ec4d0c943c1f" /></td>
</tr>
<tr>
<td align="center"><strong>Home Screen</strong></td>
<td align="center"><strong>Product Browse</strong></td>
<td align="center"><strong>Shopping Cart</strong></td>
<td align="center"><strong>Login</strong></td>
</tr>
</table>


</div>

---

## ✨ **Core Features**

### 🛍️ **Customer Journey**
- **🏪 Product Showcase** → Immersive tech product catalog with advanced filtering
- **🛒 Smart Cart** → Intelligent cart management with real-time price calculations
- **📦 Order Lifecycle** → Seamless checkout → payment → shipping → delivery tracking
- **⭐ Social Proof** → Product reviews and rating system
- **👤 User Portal** → Profile management, order history, wishlist

### 🎛️ **Admin Command Center**
- **📊 Dashboard** → Real-time analytics, sales metrics, performance insights
- **🏭 Product Management** → CRUD operations, inventory control, bulk actions
- **🚚 Fulfillment Center** → Order processing, shipment tracking, delivery management
- **👥 User Administration** → Customer management, role-based access control
- **💰 Financial Overview** → Revenue tracking, payment monitoring

### 🔐 **Enterprise Security**
- **🔑 JWT Authentication** → Stateless, secure token-based auth
- **🛡️ Role-Based Access** → Granular permissions (Admin/Customer)
- **🔒 Data Protection** → Encrypted passwords, secure API endpoints
- **🍪 Session Management** → HTTP-only cookies, CSRF protection

---

## 🏗️ **Architecture Stack**

<table>
<tr>
<td width="50%">

### **Frontend Arsenal**
```javascript
React 18.3.1         // Component library
Redux Toolkit        // State management
React Router Dom     // Client-side routing
Tailwind CSS         // Utility-first styling
Formik + Yup         // Form handling & validation
Axios               // HTTP client
Lucide React        // Icon system
React Toastify      // Notifications
```

</td>
<td width="50%">

### **Backend Infrastructure**
```javascript
Node.js + Express   // Server runtime
MongoDB + Mongoose  // Database & ODM
JWT                // Authentication
bcryptjs           // Password hashing
Cookie Parser      // Session handling
Colors             // Console styling
Dotenv            // Environment config
```

</td>
</tr>
</table>

---

## 🚀 **Quick Deploy**

### **One-Click Setup**
```bash
# 1. Clone & Navigate
git clone https://github.com/sharvil/tech-cart.git && cd tech-cart

# 2. Install Everything
npm install && npm install --prefix frontend

# 3. Environment Setup
echo "NODE_ENV=development
PORT=5002
MONGO_URI=mongodb://localhost:27017/techcart
JWT_SECRET=$(openssl rand -base64 32)
PAYPAL_CLIENT_ID=your_paypal_client_id" > .env

# 4. Seed Database
npm run data:import

# 5. Launch Application
npm run dev
```

### **Production Deployment**
```bash
npm run build    # Build optimized bundle
npm start       # Launch production server
```

---

## 📋 **Available Scripts**

| Command | Description | Environment |
|---------|-------------|-------------|
| `npm run dev` | 🔥 **Hot reload** - Frontend + Backend | Development |
| `npm run server` | ⚡ **Backend only** - API server | Development |
| `npm run client` | 🎨 **Frontend only** - React app | Development |
| `npm start` | 🚀 **Production** - Optimized build | Production |
| `npm run build` | 📦 **Build** - Create production bundle | Build |
| `npm run data:import` | 📊 **Seed** - Import sample data | Database |
| `npm run data:destroy` | 🗑️ **Clean** - Reset database | Database |

---

## 🌐 **Application Flow**

```mermaid
graph TD
    A[🏠 Home Page] --> B{👤 User Status}
    B -->|New User| C[📝 Register]
    B -->|Existing| D[🔐 Login]
    C --> E[🛍️ Product Catalog]
    D --> E
    E --> F[🛒 Add to Cart]
    F --> G[📋 Checkout]
    G --> H[💳 Payment Gateway]
    H --> I[📦 Order Confirmation]
    I --> J[🚚 Shipment Tracking]
    
    K[👑 Admin Login] --> L[📊 Dashboard]
    L --> M[🏭 Manage Products]
    L --> N[👥 Manage Users]
    L --> O[📦 Process Orders]
```

---

## 🎯 **Key Endpoints**

### **Customer API**
```http
POST   /api/users/auth           # 🔐 User authentication
POST   /api/users/register       # 📝 New user signup
GET    /api/products             # 📱 Product catalog
POST   /api/orders               # 🛒 Place order
GET    /api/orders/mine          # 📋 User orders
PUT    /api/users/profile        # 👤 Update profile
```

### **Admin API**
```http
POST   /api/products             # ➕ Create product
PUT    /api/products/:id         # ✏️ Update product
DELETE /api/products/:id         # 🗑️ Delete product
GET    /api/orders               # 📦 All orders
PUT    /api/orders/:id/deliver   # 🚚 Mark as delivered
GET    /api/users                # 👥 All users
```

---

## 💡 **Payment Integration Notice**

> **⚠️ Payment Gateway Status**
> 
> Payment integration infrastructure is **ready** but **disabled** to prevent accidental charges during development. The system includes:
> 
> - PayPal SDK integration (`@paypal/react-paypal-js`)
> - Secure payment flow architecture
> - Order processing pipeline
> - Transaction logging system
> 
> **To enable payments:** Configure your PayPal Client ID in environment variables

---

## 📁 **Project Structure**

```
tech-cart/
├── 📦 package.json             # Root dependencies & scripts
├── 🔧 .env                     # Environment variables
├── 📝 README.md                # Project documentation  
├── 🚫 .gitignore              # Git ignore patterns
├── 🌱 seeder.js               # Database seeder script
├──
├── 📸 screenshots/             # Project demo images
│   ├── demo.gif               # Main application demo
│   ├── homepage.png           # Landing page screenshot
│   ├── products.png           # Product catalog view
│   ├── cart.png               # Shopping cart interface
│   ├── checkout.png           # Checkout process flow
│   ├── payment.png            # Payment gateway integration
│   ├── order-confirmation.png # Order success page
│   ├── admin-dashboard.png    # Admin control panel
│   ├── admin-products.png     # Product management
│   └── mobile-views.png       # Mobile responsive design
├──
├── ⚡ backend/                 # Express.js API Server
│   ├── 🚀 server.js           # Main server entry point
│   ├── 🌱 seeder.js           # Database population script
│   ├──
│   ├── 📁 config/             # Server configuration
│   │   └── db.js              # MongoDB connection setup
│   ├──
│   ├── 🎮 controllers/        # Business logic handlers
│   │   ├── userController.js  # User authentication & management
│   │   ├── productController.js # Product CRUD operations
│   │   └── orderController.js # Order processing logic
│   ├──
│   ├── 🗃️ models/             # MongoDB schemas
│   │   ├── User.js            # User data model
│   │   ├── Product.js         # Product data model  
│   │   └── Order.js           # Order data model
│   ├──
│   ├── 🛡️ middleware/         # Custom middleware functions
│   │   ├── authMiddleware.js  # JWT authentication
│   │   └── errorMiddleware.js # Error handling
│   ├──
│   ├── 🛤️ routes/             # API endpoint definitions
│   │   ├── userRoutes.js      # User-related routes
│   │   ├── productRoutes.js   # Product-related routes
│   │   ├── orderRoutes.js     # Order-related routes
│   │   └── uploadRoutes.js    # File upload routes
│   ├──
│   ├── 🔧 utils/              # Utility functions
│   │   └── generateToken.js   # JWT token generation
│   └──
│   └── 📊 data/               # Sample/seed data
│       ├── users.js           # Sample user accounts
│       └── products.js        # Sample product catalog
├──
└── 🎨 frontend/               # React.js Client Application
    ├── 📦 package.json        # Frontend dependencies
    ├── 🎨 tailwind.config.js   # Tailwind CSS configuration
    ├──
    ├── 📁 public/             # Static assets
    │   ├── index.html         # Main HTML template
    │   └── favicon.ico        # Application icon
    ├──
    └── 📁 src/                # React source code
        ├── 🚀 index.js        # React application entry
        ├── 📱 App.js          # Main App component
        ├── 🎨 index.css       # Global styling
        ├── 🏪 store.js        # Redux store configuration
        ├── 📋 constants.js    # Application constants
        ├──
        ├── 🧩 components/     # Reusable UI components
        │   ├── Header.js      # Navigation header
        │   ├── Footer.js      # Site footer
        │   ├── Product.js     # Product card component
        │   ├── Rating.js      # Star rating display
        │   ├── Message.js     # Alert/notification component
        │   ├── Loader.js      # Loading spinner
        │   ├── Paginate.js    # Pagination controls
        │   ├── SearchBox.js   # Product search functionality
        │   ├── ProductCarousel.js # Featured products slider
        │   ├── CheckoutSteps.js # Checkout progress indicator
        │   ├── FormContainer.js # Form wrapper component
        │   ├── PrivateRoute.js # Protected route wrapper
        │   └── AdminRoute.js  # Admin-only route wrapper
        ├──
        ├── 📄 screens/        # Page-level components
        │   ├── HomeScreen.js       # Homepage with products
        │   ├── ProductScreen.js    # Product details page
        │   ├── CartScreen.js       # Shopping cart page
        │   ├── LoginScreen.js      # User login form
        │   ├── RegisterScreen.js   # User registration
        │   ├── ProfileScreen.js    # User profile management
        │   ├── ShippingScreen.js   # Shipping address form
        │   ├── PaymentScreen.js    # Payment method selection
        │   ├── PlaceOrderScreen.js # Order review & placement
        │   ├── OrderScreen.js      # Individual order details
        │   ├── UserListScreen.js   # Admin: user management
        │   ├── UserEditScreen.js   # Admin: edit user
        │   ├── ProductListScreen.js # Admin: product listing
        │   ├── ProductEditScreen.js # Admin: edit product
        │   └── OrderListScreen.js  # Admin: order management
        ├──
        ├── 🗂️ slices/         # Redux state slices
        │   ├── authSlice.js        # Authentication state
        │   ├── cartSlice.js        # Shopping cart state  
        │   ├── apiSlice.js         # Base RTK Query API
        │   ├── usersApiSlice.js    # User API endpoints
        │   ├── productsApiSlice.js # Product API endpoints
        │   ├── ordersApiSlice.js   # Order API endpoints
        │   └── uploadApiSlice.js   # File upload endpoints
        └──
        └── 🔧 utils/          # Utility functions
            └── cartUtils.js   # Cart calculation helpers
```

---

## 📷 **Adding Screenshots**

Create a `screenshots/` folder in your project root and add these images:

### **Required Images:**
```bash
screenshots/
├── demo.gif                    # 🎬 Main demo (optional)
├── homepage.png               # 🏠 Landing page
├── products.png               # 📱 Product listing
├── cart.png                   # 🛒 Shopping cart
├── checkout.png               # 💳 Checkout flow
├── payment.png                # 💰 Payment page
├── order-confirmation.png     # ✅ Success page
├── admin-dashboard.png        # 📊 Admin overview
├── admin-products.png         # 🏭 Product management
└── mobile-views.png           # 📱 Mobile screens
```

### **Pro Tips:**
- **Use high-quality screenshots** (1920x1080 recommended)
- **Show real data** instead of placeholder content
- **Include both light/dark themes** if applicable
- **Capture mobile responsiveness**
- **Create animated GIFs** for user flows
- **Optimize images** for web (compress without quality loss)

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Author**

**Sharvil Shetty**
- 🌟 Full-Stack Developer

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ by [Sharvil Shetty](https://github.com/sharvil)

</div>
