import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axiosInstance from '../utils/axiosConfig'

const TransportList = () => {
  const [transports, setTransports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    date: '',
    produceType: '',
  })

  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    fetchTransports()
  }, [filters])

  const fetchTransports = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.origin) params.append('origin', filters.origin)
      if (filters.destination) params.append('destination', filters.destination)
      if (filters.date) params.append('date', filters.date)
      if (filters.produceType) params.append('produceType', filters.produceType)

      const { data } = await axiosInstance.get(`/transport?${params.toString()}`)
      setTransports(data)
    } catch (error) {
      console.error('Error fetching transports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="transport-hero">
      <div className="transport-overlay">
        <div className="hero-content w-full max-w-7xl mx-auto">

          {/* ===== HERO TEXT ===== */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-800">
              Transport Sharing
            </h1>

            <p className="text-2xl md:text-3xl mb-4 text-gray-800 font-semibold">
              Move Agricultural Produce Efficiently
            </p>

            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-700">
              Find available transport, share costs, and connect farmers with reliable logistics.
            </p>

            {userInfo && (
              <div className="mt-8">
                <Link
                  to="/transport/create"
                  className="btn-primary px-8 py-4 text-lg"
                >
                  + Create Listing
                </Link>
              </div>
            )}
          </div>

          {/* ===== FILTERS (ON IMAGE) ===== */}
          <div className="card mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              🔍 Filters
            </h2>

            <div className="grid md:grid-cols-4 gap-4">
              <input
                type="text"
                name="origin"
                placeholder="Origin City"
                value={filters.origin}
                onChange={handleFilterChange}
                className="px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />

              <input
                type="text"
                name="destination"
                placeholder="Destination City"
                value={filters.destination}
                onChange={handleFilterChange}
                className="px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />

              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />

              <input
                type="text"
                name="produceType"
                placeholder="Produce Type"
                value={filters.produceType}
                onChange={handleFilterChange}
                className="px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* ===== TRANSPORT CARDS (ON IMAGE) ===== */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-700 text-lg">Loading transports...</p>
            </div>
          ) : transports.length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-gray-700 text-lg">No transports found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
              {transports.map((transport) => (
                <Link
                  key={transport._id}
                  to={`/transport/${transport._id}`}
                  className="card"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {transport.vehicleType.toUpperCase()}
                  </h3>

                  <p className="text-gray-700 mb-2">
                    {transport.origin?.city} → {transport.destination?.city}
                  </p>

                  <p className="text-primary-700 font-bold text-lg">
                    ₹{transport.price}
                  </p>
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default TransportList
