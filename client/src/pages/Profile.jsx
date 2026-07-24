import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axiosInstance from '../utils/axiosConfig'

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data } = await axiosInstance.get('/users/profile')
      setProfile(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p className="text-center py-20">Loading profile...</p>
  }

  return (
    <div className="profile-page">
      <div className="profile-content">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-24">
          👤 My Profile
        </h1>

        <div className="card relative pt-24">
          {/* PROFILE IMAGE */}
          <img
            src="/images/profile.jpg"
            alt="Profile"
            className="profile-avatar absolute left-1/2 -top-20 -translate-x-1/2"
          />

          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-gray-800">
              {profile?.name || userInfo?.name}
            </h2>
            <p className="text-gray-600">{profile?.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Role:{' '}
              <span className="font-semibold capitalize">
                {profile?.role || userInfo?.role}
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 text-center">
            <div>
              <h3 className="text-sm font-semibold text-gray-600">Phone</h3>
              <p className="text-gray-800">{profile?.phone || '—'}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-600">
                Member Since
              </h3>
              <p className="text-gray-800">
                {new Date(profile?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <button className="btn-primary">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
