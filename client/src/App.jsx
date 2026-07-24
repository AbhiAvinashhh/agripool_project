import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import TransportList from './pages/TransportList'
import TransportCreate from './pages/TransportCreate'
import TransportDetail from './pages/TransportDetail'
import FertilizerDashboard from './pages/FertilizerDashboard'
import LandParcelForm from './pages/LandParcelForm'
import LandParcelDetail from './pages/LandParcelDetail'
import Profile from './pages/Profile'
import './App.css'

function App() {
  const { userInfo } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={userInfo ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={userInfo ? <Navigate to="/" /> : <Register />} 
        />
        <Route path="/transport" element={<TransportList />} />
        <Route 
          path="/transport/create" 
          element={userInfo ? <TransportCreate /> : <Navigate to="/login" />} 
        />
        <Route path="/transport/:id" element={<TransportDetail />} />
        <Route 
          path="/fertilizer" 
          element={userInfo ? <FertilizerDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/fertilizer/parcel/new" 
          element={userInfo ? <LandParcelForm /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/fertilizer/parcel/:id" 
          element={userInfo ? <LandParcelDetail /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/fertilizer/parcel/:id/edit" 
          element={userInfo ? <LandParcelForm /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={userInfo ? <Profile /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  )
}

export default App

