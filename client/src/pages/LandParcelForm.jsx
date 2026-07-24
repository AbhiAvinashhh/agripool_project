import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axiosInstance from '../utils/axiosConfig'

const LandParcelForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userInfo } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    parcelName: '',
    area: {
      value: '',
      unit: 'acre'
    },
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    soilType: 'loamy',
    currentCrop: '',
    cropSeason: 'kharif',
    phLevel: '',
    organicMatter: ''
  })

  const isEditMode = !!id

  useEffect(() => {
    if (isEditMode) {
      fetchParcel()
    }
  }, [id])

  const fetchParcel = async () => {
    try {
      const { data } = await axiosInstance.get(`/fertilizer/parcels/${id}`)
      setFormData({
        parcelName: data.parcelName || '',
        area: data.area || { value: '', unit: 'acre' },
        location: data.location || { address: '', city: '', state: '', pincode: '' },
        soilType: data.soilType || 'loamy',
        currentCrop: data.currentCrop || '',
        cropSeason: data.cropSeason || 'kharif',
        phLevel: data.phLevel || '',
        organicMatter: data.organicMatter || ''
      })
    } catch (error) {
      console.error('Error fetching parcel:', error)
      alert('Error loading parcel data')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.startsWith('area.')) {
      const field = name.split('.')[1]
      setFormData({
        ...formData,
        area: {
          ...formData.area,
          [field]: field === 'value' ? parseFloat(value) || '' : value
        }
      })
    } else if (name.startsWith('location.')) {
      const field = name.split('.')[1]
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [field]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: name === 'phLevel' || name === 'organicMatter' 
          ? (value === '' ? '' : parseFloat(value)) 
          : value
      })
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.parcelName.trim()) {
      newErrors.parcelName = 'Parcel name is required'
    }
    if (!formData.area.value || formData.area.value <= 0) {
      newErrors['area.value'] = 'Valid area is required'
    }
    if (!formData.currentCrop.trim()) {
      newErrors.currentCrop = 'Current crop is required'
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
      if (isEditMode) {
        await axiosInstance.put(`/fertilizer/parcels/${id}`, formData)
      } else {
        await axiosInstance.post('/fertilizer/parcels', formData)
      }
      navigate('/fertilizer')
    } catch (error) {
      console.error('Error saving parcel:', error)
      alert(error.response?.data?.message || 'Error saving land parcel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fertilizer-page">
      <div className="container mx-auto px-8 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          {isEditMode ? '✏️ Edit Land Parcel' : '🌱 Add New Land Parcel'}
        </h1>

        <form onSubmit={handleSubmit} className="card">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Parcel Name *
            </label>
            <input
              type="text"
              name="parcelName"
              value={formData.parcelName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
            {errors.parcelName && (
              <p className="text-red-500 text-xs mt-1">{errors.parcelName}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Area *
              </label>
              <input
                type="number"
                name="area.value"
                value={formData.area.value}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
              {errors['area.value'] && (
                <p className="text-red-500 text-xs mt-1">{errors['area.value']}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Unit
              </label>
              <select
                name="area.unit"
                value={formData.area.unit}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                <option value="acre">Acre</option>
                <option value="hectare">Hectare</option>
                <option value="sqft">Square Feet</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Location</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  name="location.pincode"
                  value={formData.location.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Soil Type *
              </label>
              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                <option value="clay">Clay</option>
                <option value="sandy">Sandy</option>
                <option value="loamy">Loamy</option>
                <option value="silt">Silt</option>
                <option value="peaty">Peaty</option>
                <option value="chalky">Chalky</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Current Crop *
              </label>
              <input
                type="text"
                name="currentCrop"
                value={formData.currentCrop}
                onChange={handleChange}
                required
                placeholder="e.g., Wheat, Rice, Corn"
                className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
              {errors.currentCrop && (
                <p className="text-red-500 text-xs mt-1">{errors.currentCrop}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Crop Season
              </label>
              <select
                name="cropSeason"
                value={formData.cropSeason}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                <option value="kharif">Kharif</option>
                <option value="rabi">Rabi</option>
                <option value="zaid">Zaid</option>
                <option value="year-round">Year Round</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                pH Level (0-14)
              </label>
              <input
                type="number"
                name="phLevel"
                value={formData.phLevel}
                onChange={handleChange}
                min="0"
                max="14"
                step="0.1"
                className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Organic Matter (%)
              </label>
              <input
                type="number"
                name="organicMatter"
                value={formData.organicMatter}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/fertilizer')}
              className="px-8 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-primary-500/50 transition-all duration-300 disabled:opacity-50 font-semibold"
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Parcel' : 'Create Parcel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LandParcelForm

