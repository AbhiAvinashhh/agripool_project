import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from '../utils/axiosConfig'

const TransportCreate = () => {
  const navigate = useNavigate()
  const { userInfo } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    vehicleType: 'truck',
    vehicleNumber: '',
    capacity: '',
    unit: 'kg',
    origin: {
      address: '',
      city: '',
      state: '',
    },
    destination: {
      address: '',
      city: '',
      state: '',
    },
    availableDate: '',
    price: '',
    priceUnit: 'per_kg',
    produceType: '',
    description: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('origin.')) {
      const field = name.split('.')[1]
      setFormData({
        ...formData,
        origin: {
          ...formData.origin,
          [field]: value,
        },
      })
    } else if (name.startsWith('destination.')) {
      const field = name.split('.')[1]
      setFormData({
        ...formData,
        destination: {
          ...formData.destination,
          [field]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }

    // Clear error
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required'
    }
    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = 'Valid capacity is required'
    }
    if (!formData.origin.city.trim()) {
      newErrors['origin.city'] = 'Origin city is required'
    }
    if (!formData.destination.city.trim()) {
      newErrors['destination.city'] = 'Destination city is required'
    }
    if (!formData.availableDate) {
      newErrors.availableDate = 'Available date is required'
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required'
    }
    if (!formData.produceType.trim()) {
      newErrors.produceType = 'Produce type is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      setLoading(true)
      await axios.post('/transport', formData)
      navigate('/transport')
    } catch (error) {
      console.error('Error creating transport:', error)
      alert(error.response?.data?.message || 'Error creating transport listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="transport-page">
      <div className="container mx-auto px-8 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">🚚 Create Transport Listing</h1>

        <form onSubmit={handleSubmit} className="card">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Vehicle Type *
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="truck">Truck</option>
              <option value="tractor">Tractor</option>
              <option value="van">Van</option>
              <option value="pickup">Pickup</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Vehicle Number *
            </label>
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
            {errors.vehicleNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.vehicleNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Capacity *
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
            {errors.capacity && (
              <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Unit
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="kg">Kilogram (kg)</option>
              <option value="quintal">Quintal</option>
              <option value="ton">Ton</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Origin City *
            </label>
            <input
              type="text"
              name="origin.city"
              value={formData.origin.city}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
            {errors['origin.city'] && (
              <p className="text-red-500 text-xs mt-1">{errors['origin.city']}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Destination City *
            </label>
            <input
              type="text"
              name="destination.city"
              value={formData.destination.city}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
            {errors['destination.city'] && (
              <p className="text-red-500 text-xs mt-1">{errors['destination.city']}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Available Date *
            </label>
            <input
              type="date"
              name="availableDate"
              value={formData.availableDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
            {errors.availableDate && (
              <p className="text-red-500 text-xs mt-1">{errors.availableDate}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Price *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Price Unit
            </label>
            <select
              name="priceUnit"
              value={formData.priceUnit}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="per_kg">Per kg</option>
              <option value="per_quintal">Per quintal</option>
              <option value="per_ton">Per ton</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Produce Type *
            </label>
            <input
              type="text"
              name="produceType"
              value={formData.produceType}
              onChange={handleChange}
              placeholder="e.g., Wheat, Rice, Vegetables"
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
            {errors.produceType && (
              <p className="text-red-500 text-xs mt-1">{errors.produceType}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/transport')}
              className="px-8 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-primary-500/50 transition-all duration-300 disabled:opacity-50 font-semibold"
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransportCreate

