# 🍽️ Food Donation Website

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)

> **Connecting communities to reduce food waste and fight hunger** 🌍

A comprehensive food donation platform that bridges the gap between food donors (restaurants, individuals, organizations) and receivers (food banks, shelters, families in need). Our mission is to reduce food waste while helping those in need access nutritious meals.

## 🌟 Key Features

### 👥 **Multi-Role System**
- **Donors**: Post food donations, manage requests, track contributions
- **Receivers**: Browse available food, submit requests, coordinate pickups  
- **Admins**: Oversee platform operations, manage users, generate reports

### 🎯 **Core Functionality**
- **Smart Donation Management**: Create, edit, and manage food donations with photos
- **Intelligent Request System**: Advanced matching between donors and receivers
- **Real-time Notifications**: Instant updates with smart filtering
- **Location Coordination**: Seamless pickup location and contact management
- **Dashboard Analytics**: Comprehensive insights for all user types
- **Mobile-First Design**: Responsive across all devices

### 🔧 **Advanced Features**
- **Notification Management**: Mark as read, bulk actions, smart filtering
- **Request Workflow**: Pending → Accepted → Completed lifecycle
- **Admin Analytics**: Real-time system statistics and user management
- **Secure Authentication**: JWT-based with role-based access control

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** for modern, responsive styling
- **Lucide React** for beautiful, consistent icons
- **React Router** for seamless navigation
- **Vite** for lightning-fast development

### Backend
- **Node.js** with Express.js framework
- **MySQL** database with optimized relationships
- **JWT Authentication** for secure access
- **bcryptjs** for password hashing
- **RESTful API** architecture

### Development & Deployment
- **ESLint** for code quality
- **TypeScript** for enhanced development experience
- **Render** ready for cloud deployment
- **Environment-based configuration**

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** or **yarn** package manager

### 📥 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rushikeshbhoyar12/food-donation-website.git
   cd food-donation-website
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE food_donation_db;
   ```

4. **Environment Configuration**
   ```bash
   # Copy environment files
   cp backend/.env.example backend/.env
   ```
   
   Update `backend/.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=food_donation_db
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

5. **Run Database Migrations**
   ```bash
   cd backend
   npm run setup
   npm run seed
   cd ..
   ```

6. **Start the Application**
   ```bash
   # Start backend server (Terminal 1)
   cd backend
   npm run dev

   # Start frontend development server (Terminal 2)
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔐 Default Login Credentials

### 👨‍💼 Admin Account
- **Email**: `admin@fooddonation.com`
- **Password**: `admin123`
- **Access**: Full system management, user oversight, analytics

### 🤝 Donor Account  
- **Email**: `donor@example.com` or `restaurant@example.com`
- **Password**: `donor123` or `restaurant123`
- **Access**: Create donations, manage requests, view analytics

### 🏠 Receiver Account
- **Email**: `receiver@example.com` or `community@example.com`  
- **Password**: `receiver123` or `community123`
- **Access**: Browse donations, submit requests, track status

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Donations
- `GET /api/donations` - Get all donations
- `POST /api/donations` - Create new donation
- `PUT /api/donations/:id` - Update donation
- `DELETE /api/donations/:id` - Delete donation

### Requests
- `POST /api/requests` - Create donation request
- `GET /api/requests` - Get user requests
- `PUT /api/requests/:id/status` - Update request status

## 🚀 Deployment Guide

### 📦 Deploy to Render

1. **Prepare for deployment**
   ```bash
   # Ensure all dependencies are installed
   npm install
   cd backend && npm install && cd ..
   ```

2. **Create Render account** at [render.com](https://render.com)

3. **Database Setup on Render**
   - Create a new **PostgreSQL** database service
   - Note the database URL for environment variables

4. **Backend Deployment**
   - Create a new **Web Service**
   - Connect your GitHub repository
   - Set **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     DATABASE_URL=[your-render-db-url]
     JWT_SECRET=[your-secret-key]
     PORT=5000
     ```

5. **Frontend Deployment**
   - Create another **Static Site**
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_API_URL=[your-backend-url]
     ```

### 🌐 Environment Variables

#### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=food_donation_db

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Server
PORT=5000
NODE_ENV=development

# For production (Render)
DATABASE_URL=postgresql://username:password@host:port/database
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# For production
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## 📊 Database Schema

### Core Tables
- **`users`** - User accounts (donors, receivers, admins)
- **`donations`** - Food donation listings with details
- **`requests`** - Donation requests and status tracking
- **`notifications`** - Real-time system notifications

### Relationships
- Users → Donations (One-to-Many)
- Donations → Requests (One-to-Many)  
- Users → Notifications (One-to-Many)
- Users → Requests (One-to-Many)

## 🔄 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register    # User registration
POST   /api/auth/login       # User login
GET    /api/auth/profile     # Get user profile
PUT    /api/auth/profile     # Update user profile
```

### Donation Endpoints
```
GET    /api/donations        # Get all available donations
POST   /api/donations        # Create new donation (donors)
GET    /api/donations/my     # Get user's donations
PUT    /api/donations/:id    # Update donation
DELETE /api/donations/:id    # Delete donation
```

### Request Endpoints
```
POST   /api/requests                    # Create donation request
GET    /api/requests/my-requests        # Get user's requests
GET    /api/requests/for-my-donations   # Get requests for user's donations
PUT    /api/requests/:id/status         # Update request status
PUT    /api/requests/:id/complete       # Complete request (receivers)
```

### Notification Endpoints
```
GET    /api/notifications               # Get user notifications
PUT    /api/notifications/:id/read      # Mark notification as read
PUT    /api/notifications/read-all      # Mark all notifications as read
GET    /api/notifications/unread-count  # Get unread notification count
```

### Admin Endpoints
```
GET    /api/admin/stats       # Get system statistics
GET    /api/admin/users       # Get all users (admin only)
GET    /api/admin/donations   # Get all donations (admin only)
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started
1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
4. **Make** your changes
5. **Test** thoroughly
6. **Commit** with clear messages (`git commit -m 'Add amazing feature'`)
7. **Push** to your branch (`git push origin feature/amazing-feature`)
8. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Update documentation for new features
- Test your changes thoroughly
- Ensure responsive design

### Issue Reporting
- Use clear, descriptive titles
- Provide steps to reproduce
- Include screenshots if applicable
- Specify your environment details

## 📱 Screenshots

### Home Page
Beautiful landing page showcasing available donations with filtering options.

### Dashboard Views
- **Donor Dashboard**: Manage donations, view requests, track analytics
- **Receiver Dashboard**: Browse food, submit requests, track status  
- **Admin Dashboard**: System overview, user management, reports

### Mobile Experience
Fully responsive design optimized for mobile devices.

## 🏆 Features Roadmap

- [ ] **Mobile App** (React Native)
- [ ] **Map Integration** for location-based matching
- [ ] **Push Notifications** for mobile users
- [ ] **Multi-language Support**
- [ ] **Food Expiry Tracking** with automatic alerts
- [ ] **Rating System** for donors and receivers
- [ ] **Advanced Analytics** with charts and insights
- [ ] **Email Notifications** integration
- [ ] **Social Media Sharing** for donations

## 💝 Impact

This platform helps:
- **Reduce Food Waste** by connecting surplus food with those who need it
- **Fight Hunger** by making food more accessible to communities
- **Build Communities** by fostering connections between neighbors
- **Environmental Protection** by reducing food waste in landfills

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/rushikeshbhoyar12/food-donation-website/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rushikeshbhoyar12/food-donation-website/discussions)
- **Email**: support@fooddonationwebsite.com

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Pexels** for providing beautiful stock photos
- **Lucide** for the amazing icon library
- **Tailwind CSS** for the utility-first CSS framework
- **React Community** for the excellent ecosystem
- **Contributors** who help make this project better

---

<div align="center">

**Made with ❤️ to fight hunger and reduce food waste**

[⭐ Star this project](https://github.com/rushikeshbhoyar12/food-donation-website) • [🍴 Fork it](https://github.com/rushikeshbhoyar12/food-donation-website/fork) • [🐛 Report Bug](https://github.com/rushikeshbhoyar12/food-donation-website/issues) • [✨ Request Feature](https://github.com/rushikeshbhoyar12/food-donation-website/issues)

</div>