import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Home = () => {
  const { userInfo } = useSelector((state) => state.auth)

  return (
    <div className="hero">
      <div className="hero-overlay">
        <div className="hero-content">

          {/* ===== HERO TEXT ===== */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-800">
              Welcome to AgriPool
            </h1>

            <p className="text-2xl md:text-3xl mb-4 text-gray-800 font-semibold">
              Connecting Farmers Across the Golden Fields
            </p>

            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-700">
              Transport Sharing for Agricultural Produce & Customized Fertilizer Planning
            </p>

            <div className="flex justify-center gap-6 flex-wrap mt-10">
              <Link
                to="/transport"
                className="btn-primary px-10 py-4 text-lg"
              >
                🚚 Find Transport
              </Link>

              {userInfo ? (
                <Link
                  to="/fertilizer"
                  className="btn-primary px-10 py-4 text-lg"
                >
                  🌱 Fertilizer Plan
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="btn-primary px-10 py-4 text-lg"
                >
                  🌱 Fertilizer Plan
                </Link>
              )}
            </div>
          </div>

          {/* ===== FEATURES (ON IMAGE, NOT GREEN PAGE) ===== */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="card">
              <div className="text-5xl mb-6">🚚</div>
              <h2 className="card-title">Transport Sharing</h2>
              <p className="text-gray-700 mb-6">
                Just like the winding roads through our golden fields, connect with transporters
                to share costs and efficiently move your agricultural produce to markets.
                Find available transport or list your vehicle for others to use.
              </p>
              <Link
                to="/transport"
                className="text-primary-700 hover:text-primary-800 font-semibold"
              >
                Explore Transport →
              </Link>
            </div>

            <div className="card">
              <div className="text-5xl mb-6">🌱</div>
              <h2 className="card-title">Fertilizer Planning</h2>
              <p className="text-gray-700 mb-6">
                Nurture your fields like lush green landscapes across the horizon.
                Get customized, land-parcel specific fertilizer plans to reduce costs
                and maximize returns using smart recommendations.
              </p>

              {userInfo ? (
                <Link
                  to="/fertilizer"
                  className="text-primary-700 hover:text-primary-800 font-semibold"
                >
                  View Plans →
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="text-primary-700 hover:text-primary-800 font-semibold"
                >
                  Get Started →
                </Link>
              )}
            </div>
          </div>

          {/* ===== HOW IT WORKS (STILL ON IMAGE) ===== */}
          <div className="card">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
              How It Works
            </h2>

            <div className="grid md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <span className="text-3xl font-bold text-primary-800">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Register
                </h3>
                <p className="text-gray-700">
                  Join our community of farmers and transporters.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <span className="text-3xl font-bold text-primary-800">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Connect
                </h3>
                <p className="text-gray-700">
                  Find transport or plan fertilizer based on your needs.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <span className="text-3xl font-bold text-primary-800">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Thrive
                </h3>
                <p className="text-gray-700">
                  Save costs, increase yields, and grow sustainably.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home
