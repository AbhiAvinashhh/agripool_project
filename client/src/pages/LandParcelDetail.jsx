import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axiosInstance from '../utils/axiosConfig'

const LandParcelDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userInfo } = useSelector((state) => state.auth)
  const [parcel, setParcel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    fetchParcel()
  }, [id])

  const fetchParcel = async () => {
    try {
      const { data } = await axiosInstance.get(`/fertilizer/parcels/${id}`)
      setParcel(data)
    } catch (error) {
      console.error('Error fetching parcel:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerateRecommendations = async () => {
    try {
      setRegenerating(true)
      const { data } = await axiosInstance.post(`/fertilizer/parcels/${id}/recommendations`)
      setParcel({ ...parcel, recommendations: data })
      alert('Recommendations regenerated successfully!')
    } catch (error) {
      alert(error.response?.data?.message || 'Error regenerating recommendations')
    } finally {
      setRegenerating(false)
    }
  }

  const calculateTotalCost = () => {
    return parcel?.recommendations?.reduce((sum, rec) => sum + (rec.estimatedCost || 0), 0) || 0
  }

  const calculateTotalYieldIncrease = () => {
    return parcel?.recommendations?.reduce((sum, rec) => sum + (rec.expectedYieldIncrease || 0), 0) || 0
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!parcel) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Land parcel not found</p>
        <Link to="/fertilizer" className="text-primary-600 hover:text-primary-700">
          Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="fertilizer-page">
      <div className="container mx-auto px-8 py-12 max-w-5xl">
        <Link
          to="/fertilizer"
          className="text-primary-700 hover:text-primary-800 mb-6 inline-block font-semibold text-lg"
        >
          ← Back to dashboard
        </Link>

        <div className="card mb-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-3">
                {parcel.parcelName}
              </h1>
              <p className="text-gray-700 text-lg">
                {parcel.area.value} {parcel.area.unit}
              </p>
            </div>
            <Link
              to={`/fertilizer/parcel/${id}/edit`}
              className="bg-gradient-to-r from-primary-700 to-primary-600 text-white px-6 py-3 rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-primary-500/50 transition-all duration-300 font-semibold"
            >
              Edit
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Crop Information</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Current Crop:</span> {parcel.currentCrop}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Season:</span> {parcel.cropSeason || 'N/A'}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Soil Information</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Soil Type:</span> {parcel.soilType}
                </p>
                {parcel.phLevel && (
                  <p className="text-gray-700">
                    <span className="font-semibold">pH Level:</span> {parcel.phLevel}
                  </p>
                )}
                {parcel.organicMatter && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Organic Matter:</span> {parcel.organicMatter}%
                  </p>
                )}
              </div>
            </div>

            {parcel.location?.city && (
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
                <p className="text-gray-700">
                  {parcel.location.address && `${parcel.location.address}, `}
                  {parcel.location.city}, {parcel.location.state}
                  {parcel.location.pincode && ` - ${parcel.location.pincode}`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="card">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Fertilizer Recommendations</h2>
          <button
            onClick={handleRegenerateRecommendations}
            disabled={regenerating}
            className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-green-500/50 transition-all duration-300 disabled:opacity-50 font-semibold"
          >
            {regenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>

        {parcel.recommendations && parcel.recommendations.length > 0 ? (
          <>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-2xl mb-8 border-2 border-primary-200">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-sm text-gray-700 mb-2 font-medium">Total Recommendations</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {parcel.recommendations.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-700 mb-2 font-medium">Estimated Total Cost</p>
                  <p className="text-3xl font-bold text-primary-700">
                    ₹{calculateTotalCost().toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-700 mb-2 font-medium">Expected Yield Increase</p>
                  <p className="text-3xl font-bold text-green-700">
                    +{calculateTotalYieldIncrease()} quintals
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {parcel.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="border-2 border-primary-200 rounded-2xl p-6 hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 bg-white"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {rec.fertilizerName}
                      </h3>
                      <p className="text-gray-600">{rec.reason}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority} priority
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Quantity</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {rec.quantity} {rec.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Estimated Cost</p>
                      <p className="text-lg font-semibold text-primary-600">
                        ₹{rec.estimatedCost?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Expected Yield Increase</p>
                      <p className="text-lg font-semibold text-green-600">
                        +{rec.expectedYieldIncrease || 0} quintals
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-700 mb-6 text-lg">No recommendations available</p>
            <button
              onClick={handleRegenerateRecommendations}
              disabled={regenerating}
              className="bg-gradient-to-r from-primary-700 to-primary-600 text-white px-8 py-4 rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-primary-500/50 transition-all duration-300 disabled:opacity-50 font-semibold"
            >
              {regenerating ? 'Generating...' : 'Generate Recommendations'}
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default LandParcelDetail

