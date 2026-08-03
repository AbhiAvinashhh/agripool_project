import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axiosInstance from '../utils/axiosConfig'

const TransportDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userInfo } = useSelector((state) => state.auth)
  const [transport, setTransport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingQuantity, setBookingQuantity] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    fetchTransport()
  }, [id])

  const fetchTransport = async () => {
    try {
      const { data } = await axiosInstance.get(`/transport/${id}`)
      setTransport(data)
    } catch (error) {
      console.error('Error fetching transport:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    if (!userInfo) {
      navigate('/login')
      return
    }

    try {
      setBookingLoading(true)
      await axiosInstance.post(`/transport/${id}/book`, {
        quantity: parseFloat(bookingQuantity)
      })
      alert('Booking request submitted successfully!')
      fetchTransport()
      setBookingQuantity('')
    } catch (error) {
      alert(error.response?.data?.message || 'Error booking transport')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!transport) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Transport not found</p>
        <Link to="/transport" className="text-primary-600 hover:text-primary-700">
          Back to listings
        </Link>
      </div>
    )
  }

  const isOwner = userInfo && transport.userId._id === userInfo._id

  return (
    <div className="transport-page">
      <div className="container mx-auto px-8 py-12 max-w-5xl">
        <Link
          to="/transport"
          className="text-primary-700 hover:text-primary-800 mb-6 inline-block font-semibold text-lg"
        >
          ← Back to listings
        </Link>

        <div className="card mb-8">
          <div className="flex justify-between items-start mb-8">
            <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              {transport.vehicleType.toUpperCase()} - {transport.vehicleNumber}
            </h1>
            <p className="text-gray-700 text-lg">Transporter: {transport.transporterName}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            transport.status === 'available' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {transport.status}
          </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Origin</h3>
            <p className="text-gray-700">
              {transport.origin?.address && `${transport.origin.address}, `}
              {transport.origin?.city}, {transport.origin?.state}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Destination</h3>
            <p className="text-gray-700">
              {transport.destination?.address && `${transport.destination.address}, `}
              {transport.destination?.city}, {transport.destination?.state}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Capacity</h3>
            <p className="text-gray-700">
              {transport.capacity} {transport.unit}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Date</h3>
            <p className="text-gray-700">
              {new Date(transport.availableDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Produce Type</h3>
            <p className="text-gray-700">{transport.produceType}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Price</h3>
            <p className="text-2xl font-bold text-primary-600">
              ₹{transport.price} / {transport.priceUnit.replace('_', '/')}
            </p>
            </div>
          </div>

          {transport.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-700">{transport.description}</p>
            </div>
          )}

          {transport.bookings && transport.bookings.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Bookings</h3>
              <div className="space-y-2">
                {transport.bookings.map((booking, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700">
                      <span className="font-semibold">
                        {booking.userId?.name || 'Unknown'}
                      </span>
                      {' '} - Quantity: {booking.quantity} {transport.unit} - 
                      Status: <span className={`font-semibold ${
                        booking.status === 'confirmed' ? 'text-green-600' :
                        booking.status === 'pending' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {booking.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isOwner && transport.status === 'available' && userInfo && (
            <div className="border-t-2 border-primary-100 pt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Book Transport</h3>
              <form onSubmit={handleBooking} className="flex gap-4">
                <input
                  type="number"
                  value={bookingQuantity}
                  onChange={(e) => setBookingQuantity(e.target.value)}
                  placeholder="Quantity"
                  min="0"
                  max={transport.capacity}
                  required
                  className="flex-1 px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
                <span className="self-center text-gray-700 font-medium">{transport.unit}</span>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-8 py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-primary-500/50 transition-all duration-300 disabled:opacity-50 font-semibold"
                >
                  {bookingLoading ? 'Booking...' : 'Book Now'}
                </button>
              </form>
            </div>
          )}

          {isOwner && (
            <div className="border-t-2 border-primary-100 pt-8 flex gap-4">
              <Link
                to={`/transport/${id}/edit`}
                className="px-8 py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-primary-500/50 transition-all duration-300 font-semibold"
              >
                Edit Listing
              </Link>
            </div>
          )}

          {!userInfo && (
            <div className="border-t pt-6">
              <p className="text-gray-600 mb-4">
                Please <Link to="/login" className="text-primary-600 hover:text-primary-700">login</Link> to book this transport
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransportDetail

