# 🚍 GoPath – Bus Booking Platform

> A scalable MERN stack application for seamless bus ticket booking with rewards, secure payments, and real-time notifications.

---

## 📌 Overview

**GoPath** is a full-stack bus booking platform built using the **MERN stack (MongoDB, Express, React, Node.js)**.

It provides a real-world booking experience with:
- Smart search & filtering  
- Interactive seat selection  
- Secure online payments  
- Rewards & coupon system  
- Real-time notifications  

---

## ✨ Features

### 👤 User
- 🔐 JWT Authentication (Login/Register)
- 🔍 Search buses with filters (price, timing, type)
- 💺 Interactive seat selection
- 🎟️ Booking & ticket management
- 💳 Razorpay payment integration
- 🪙 GoCoins reward system (3% cashback)
- 🏷️ Coupons & discounts
- ⭐ Ratings & reviews
- 🔔 Real-time notifications (Socket.IO)
- 📩 Email alerts (Nodemailer)
- ❌ Booking cancellation & refunds

---

### 🚌 Operator
- ➕ Add & manage buses
- 📅 Schedule trips
- 📊 View bookings & revenue
- 📋 Passenger manifest

---

### 🛠️ Admin
- 👥 Manage users & operators
- 🎯 Manage coupons & offers
- 📊 Platform analytics
- 🎫 Support/complaint system

---

## 🪙 GoCoins System

- Earn **3% coins** after trip completion  
- Conversion: **1 Coin = ₹0.50**  
- Redeem coins at checkout  
- Max usage: **50% of total booking**  

---

## 🏗️ Tech Stack

### Frontend
- React.js (Vite)
- Redux Toolkit
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

### Integrations
- Razorpay (Payments)
- Socket.IO (Real-time)
- Nodemailer (Email)
- Cloudinary (Media)
- JWT (Auth)

---

## ⚙️ Setup

### Clone
git clone https://github.com/AbdulHadhi-m/GoPath.git  

### Backend
cd backend  
npm install  
npm run dev  

### Frontend
cd frontend  
npm install  
npm run dev  

---

## 🔐 Environment Variables

Create `.env` inside backend:

PORT=5000
MONGODB_URI=xxxxxxxxxx
JWT_SECRET=xxxxxxxx
NODE_ENV=development
CLIENT_URL=http://localhost:5173


GOOGLE_CLIENT_ID=xxxxxxxx
GOOGLE_CLIENT_SECRET=xxxxxxxx
GOOGLE_CALLBACK_URL=xxxxxxxx

RAZORPAY_KEY_ID=xxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxx

CLOUDINARY_CLOUD_NAME=xxxxxxxx
CLOUDINARY_API_KEY=xxxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxxx


SMTP_HOST=xxxxxxxxxxx
SMTP_PORT=xxxxxxxxxx
SMTP_USER=xxxxxxxxxxxxx
SMTP_PASS=xxxxxxxxxxxxxx
SMTP_FROM_EMAIL=xxxxxxxxxxxxxxx 

---

Create `.env` inside frontend:

VITE_API_URL=xxxxxxx
VITE_RAZORPAY_KEY_ID=xxxxxxx

## 🔄 Workflow

1. Search trips  
2. Select seats  
3. Apply coupon / coins  
4. Payment (Razorpay)  
5. Booking confirmed  
6. Notifications sent  
7. Rewards credited  

---

## 🚀 Future Plans

- AI-based recommendations  
- Live bus tracking  
- Loyalty tiers system  
- Advanced analytics  
- Mobile app  

---

## 📜 License

MIT License © 2026 Abdul Hadhi M
