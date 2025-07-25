# HappyTours - Tour Booking Application

A full-stack tour booking application built with React, Node.js, and MongoDB.

## Features

- 🔐 User authentication (register/login)
- 🌍 Tour browsing and searching
- 📅 Tour booking management
- 🎯 User dashboard
- 📱 Responsive design

## Tech Stack

### Frontend
- Vite + React
- React Router for navigation
- TailwindCSS for styling
- Axios for API calls
- React Hook Form + Yup for validation
- Context API for state management

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT authentication
- RESTful API

## Project Structure

```
happytours/
├── client/          # Frontend React application
└── server/          # Backend Node.js application
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/logout` - Logout user

### Tours
- GET `/api/tours` - List all tours
- GET `/api/tours/:id` - Get tour details
- POST `/api/tours` - Create new tour (admin)
- PUT `/api/tours/:id` - Update tour (admin)
- DELETE `/api/tours/:id` - Delete tour (admin)

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings` - Get user's bookings
- DELETE `/api/bookings/:id` - Cancel booking

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/happytours
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## License

MIT #   H a p p y T o u r s  
 