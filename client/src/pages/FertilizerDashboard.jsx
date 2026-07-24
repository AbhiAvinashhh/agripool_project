import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axiosInstance from '../utils/axiosConfig'

const FertilizerDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const [parcels, setParcels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchParcels()
  }, [])

  const fetchParcels = async () => {
    try {
      const { data } = await axiosInstance.get('/fertilizer/parcels')
      setParcels(data)
    } catch (error) {
      console.error('Error fetching parcels:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalCost = (parcel) =>
    parcel.recommendations?.reduce(
      (sum, rec) => sum + (rec.estimatedCost || 0),
      0
    ) || 0

  const calculateTotalYieldIncrease = (parcel) =>
    parcel.recommendations?.reduce(
      (sum, rec) => sum + (rec.expectedYieldIncrease || 0),
      0
    ) || 0

  return (
    <div className="fertilizer-hero">
      <div className="fertilizer-overlay">
        <div className="hero-content w-full max-w-7xl mx-auto">

          {/* ===== HERO TEXT ===== */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-800">
              Fertilizer Planning
            </h1>

            <p className="text-2xl md:text-3xl mb-4 text-gray-800 font-semibold">
              Smart Nutrition for Better Yields
            </p>

            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-700">
              Get customized fertilizer plans based on crop, soil, and land area.
            </p>

            <div className="mt-8">
              <Link
                to="/fertilizer/parcel/new"
                className="btn-primary px-8 py-4 text-lg"
              >
                + Add Land Parcel
              </Link>
            </div>
          </div>

          {/* ===== DASHBOARD CONTENT (ON IMAGE) ===== */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-700 text-lg">Loading parcels...</p>
            </div>
          ) : parcels.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-7xl mb-6">🌾</div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                No Land Parcels Yet
              </h2>
              <p className="text-gray-700 mb-8 text-lg">
                Add your first land parcel to get customized fertilizer recommendations
              </p>
              <Link
                to="/fertilizer/parcel/new"
                className="btn-primary px-8 py-4"
              >
                Add Land Parcel
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
              {parcels.map((parcel) => (
                <Link
                  key={parcel._id}
                  to={`/fertilizer/parcel/${parcel._id}`}
                  className="card"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {parcel.parcelName}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {parcel.area.value} {parcel.area.unit}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-gray-700">
                      <span className="font-semibold">Crop:</span> {parcel.currentCrop}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Soil:</span> {parcel.soilType}
                    </p>
                    {parcel.location?.city && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Location:</span>{' '}
                        {parcel.location.city}
                      </p>
                    )}
                  </div>

                  {parcel.recommendations?.length > 0 && (
                    <div className="border-t-2 border-primary-100 pt-6 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 font-medium">
                          Total Cost:
                        </span>
                        <span className="font-semibold text-primary-700 text-lg">
                          ₹{calculateTotalCost(parcel).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 font-medium">
                          Expected Yield Increase:
                        </span>
                        <span className="font-semibold text-green-700 text-lg">
                          +{calculateTotalYieldIncrease(parcel)} quintals
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 font-medium">
                          Recommendations:
                        </span>
                        <span className="font-semibold text-gray-800 text-lg">
                          {parcel.recommendations.length}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t-2 border-primary-100">
                    <span className="text-primary-700 hover:text-primary-800 font-semibold inline-flex items-center gap-2">
                      View Details →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default FertilizerDashboard
