<<<<<<< HEAD
# AgriPool - Transport Sharing for Agricultural Produce

A full-stack web application for transport sharing of agricultural produce to markets and customized land parcel-specific fertilizer planning.

## Features

### Transport Sharing
- Browse available transport listings
- Create transport listings (for transporters)
- Book transport for agricultural produce
- Filter by origin, destination, date, and produce type
- View transport details and bookings

### Fertilizer Planning
- Add and manage land parcels
- Get customized fertilizer recommendations based on:
  - Soil type (clay, sandy, loamy, silt, peaty, chalky)
  - Current crop
  - Land area
  - pH level
  - Organic matter content
- View cost estimates and expected yield increases
- Regenerate recommendations

### User Management
- User registration and authentication
- Role-based access (farmer, transporter, admin)
- User profile management

## Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Redux Toolkit** for state management
- **Axios** for HTTP requests
- **TailwindCSS** for styling

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Express Validator** for input validation
- **bcryptjs** for password hashing

## Project Structure

```
agripool/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main app component
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── index.js            # Server entry point
│   └── package.json
└── package.json            # Root package.json
```

## Installation

1. **Install dependencies for all projects:**
   ```bash
   npm run install-all
   ```

   Or install separately:
   ```bash
   # Root
   npm install
   
   # Backend
   cd server
   npm install
   
   # Frontend
   cd client
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/agripool
   JWT_SECRET=your-secret-key-here
   SESSION_SECRET=your-session-secret-here
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your system. If not installed, download from [mongodb.com](https://www.mongodb.com/try/download/community)

## Running the Application

### Development Mode

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run separately:

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Transport
- `GET /api/transport` - Get all transport listings (with filters)
- `GET /api/transport/:id` - Get single transport listing
- `POST /api/transport` - Create transport listing (protected)
- `PUT /api/transport/:id` - Update transport listing (protected)
- `DELETE /api/transport/:id` - Delete transport listing (protected)
- `POST /api/transport/:id/book` - Book transport (protected)

### Fertilizer
- `GET /api/fertilizer/parcels` - Get all land parcels (protected)
- `GET /api/fertilizer/parcels/:id` - Get single land parcel (protected)
- `POST /api/fertilizer/parcels` - Create land parcel (protected)
- `PUT /api/fertilizer/parcels/:id` - Update land parcel (protected)
- `DELETE /api/fertilizer/parcels/:id` - Delete land parcel (protected)
- `POST /api/fertilizer/parcels/:id/recommendations` - Generate recommendations (protected)

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

## Key Features Implementation

### ES6+ JavaScript Features Used
- Arrow Functions
- Destructuring
- Spread Operator
- Rest Operator
- Template Literals
- Array Methods (map, filter, reduce, forEach, find)
- Classes
- Modules (import/export)
- let/const

### React Features Used
- Functional Components
- Hooks (useState, useEffect, useSelector, useDispatch)
- React Router (Routes, Route, Navigate, Link, useNavigate, useParams)
- Controlled Components
- Form Validation
- Error Handling

### Redux Features
- Redux Toolkit (configureStore, createSlice, createAsyncThunk)
- React-Redux (Provider, useSelector, useDispatch)

### Node.js Features
- Express.js
- MongoDB with Mongoose
- Middleware
- Error Handling
- JWT Authentication
- Input Validation

## Building for Production

**Frontend:**
```bash
cd client
npm run build
```

**Backend:**
```bash
cd server
npm start
```

## License

ISC

=======
# agripool-project
agripool ca2 project
>>>>>>> 80cbce44bcb87727bb203e504bdfa4c2e1ae0c5b
