import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-gradient-to-r from-primary-800 to-primary-700 text-white shadow-xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
            🌾 AgriPool
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/transport" 
              className={`px-3 py-2 rounded-lg transition-all duration-300 font-medium ${
                isActive('/transport') 
                  ? 'bg-white text-primary-800 shadow-md' 
                  : 'hover:bg-primary-600 hover:text-white'
              }`}
            >
              🚚 Transport
            </Link>
            
            {userInfo ? (
              <>
                <Link 
                  to="/fertilizer" 
                  className={`px-3 py-2 rounded-lg transition-all duration-300 font-medium ${
                    isActive('/fertilizer') || location.pathname.startsWith('/fertilizer')
                      ? 'bg-white text-primary-800 shadow-md' 
                      : 'hover:bg-primary-600 hover:text-white'
                  }`}
                >
                  🌱 Fertilizer Plan
                </Link>
                <Link 
                  to="/profile" 
                  className={`px-3 py-2 rounded-lg transition-all duration-300 font-medium ${
                    isActive('/profile') 
                      ? 'bg-white text-primary-800 shadow-md' 
                      : 'hover:bg-primary-600 hover:text-white'
                  }`}
                >
                  👤 Profile
                </Link>
                <span className="text-primary-100 px-3 py-2 font-medium">
                  {userInfo.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-primary-800 hover:bg-primary-50 px-5 py-2 rounded-xl transition-all duration-300 font-semibold hover:shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-4 py-2 rounded-xl transition-all duration-300 font-semibold ${
                    isActive('/login')
                      ? 'bg-white text-primary-800 shadow-md'
                      : 'hover:bg-primary-600 hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-primary-800 hover:bg-primary-50 px-5 py-2 rounded-xl transition-all duration-300 font-semibold hover:shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

