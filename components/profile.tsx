"use client"

import { useState } from "react"

interface ProfileProps {
  user: { email: string; name: string; profilePicture?: string }
  onUpdateProfile: (name: string, profilePicture?: string) => void
  onBack: () => void
}

export default function Profile({ user, onUpdateProfile, onBack }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(user.name)
  const [profilePicture, setProfilePicture] = useState(user.profilePicture || "")
  const [error, setError] = useState("")
  const [imageError, setImageError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSave = () => {
    setError("")
    setSuccess(false)

    // Validation
    if (!username.trim()) {
      setError("Username cannot be empty")
      return
    }

    if (username.trim().length < 2) {
      setError("Username must be at least 2 characters")
      return
    }

    if (username.trim().length > 30) {
      setError("Username must be less than 30 characters")
      return
    }

    // Save the username and profile picture
    onUpdateProfile(username.trim(), profilePicture)
    setIsEditing(false)
    setSuccess(true)

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000)
  }

  const handleCancel = () => {
    setUsername(user.name)
    setProfilePicture(user.profilePicture || "")
    setError("")
    setImageError("")
    setIsEditing(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("")
    const file = e.target.files?.[0]

    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setImageError("Please upload a valid image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size must be less than 5MB")
      return
    }

    // Convert to data URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfilePicture(reader.result as string)
      setImageError("")
    }
    reader.onerror = () => {
      setImageError("Failed to read image file")
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setProfilePicture("")
    setImageError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-sky-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
              title="Back to Dashboard"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-orange-600">Profile Settings</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-4xl text-white font-bold shadow-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Upload/Remove buttons overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <label
                  htmlFor="profile-upload"
                  className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition"
                  title="Upload Photo"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {profilePicture && (
                  <button
                    onClick={handleRemoveImage}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition cursor-pointer"
                    title="Remove Photo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {imageError && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                <span>⚠️</span>
                {imageError}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">Hover over photo to upload or remove</p>

            <h2 className="text-2xl font-bold text-gray-800 mt-4">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <p className="text-green-700 font-semibold">Profile updated successfully!</p>
            </div>
          )}

          {/* Profile Form */}
          <div className="space-y-6">
            {/* Email Field (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Email cannot be changed for security reasons
              </p>
            </div>

            {/* Username Field (Editable) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setError("")
                  }}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg transition ${
                    isEditing
                      ? "bg-white border-orange-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      : "bg-gray-50 border-gray-300 text-gray-600"
                  }`}
                  placeholder="Enter your username"
                />
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-600 hover:text-orange-700 font-semibold text-sm cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>
              {error && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  <span>⚠️</span>
                  {error}
                </p>
              )}
              {!error && isEditing && (
                <p className="text-xs text-gray-500 mt-2">
                  Username must be 2-30 characters long
                </p>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Account Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-semibold text-gray-800">December 2025</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Account Status:</span>
                <span className="font-semibold text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
