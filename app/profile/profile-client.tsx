"use client"

import { useState, useActionState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { UploadButton } from "@/lib/uploadthing"
import { updateProfileAction, deleteProfilePictureAction, changePasswordAction } from "./actions"
import { signOutAction } from "@/app/auth/actions"

interface User {
  id: string
  email: string
  name: string
  profilePicture: string | null
  createdAt: Date
  status: string
}

interface ProfileClientProps {
  user: User
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Profile update state
  const [profileState, profileAction, isProfilePending] = useActionState(
    updateProfileAction,
    null
  )

  // Password change state
  const [passwordState, passwordAction, isPasswordPending] = useActionState(
    changePasswordAction,
    null
  )

  const handleLogout = async () => {
    await signOutAction()
  }

  const handleDeletePicture = async () => {
    if (confirm("Are you sure you want to delete your profile picture?")) {
      const result = await deleteProfilePictureAction()
      if (result.success) {
        router.refresh()
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-sky-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
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
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              {user.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-4xl text-white font-bold shadow-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <UploadButton
                endpoint="profilePicture"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    router.refresh()
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`Upload failed: ${error.message}`)
                }}
                appearance={{
                  button:
                    "bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition",
                  allowedContent: "hidden",
                }}
              />
              {user.profilePicture && (
                <button
                  onClick={handleDeletePicture}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition"
                >
                  Remove
                </button>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-4">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>

          {/* Success/Error Messages */}
          {profileState?.success && !isEditing && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium">{profileState.message}</p>
            </div>
          )}

          {profileState?.success === false && profileState.errors._form && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{profileState.errors._form[0]}</p>
            </div>
          )}

          {/* Profile Form */}
          <form action={profileAction} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={user.name}
                disabled={!isEditing || isProfilePending}
                className={`w-full px-4 py-3 border rounded-lg transition ${
                  isEditing && !isProfilePending
                    ? "bg-white border-orange-400 focus:ring-2 focus:ring-orange-500"
                    : "bg-gray-50 border-gray-300 text-gray-600"
                }`}
              />
              {profileState?.success === false && profileState.errors.name && (
                <p className="mt-1 text-sm text-red-600">{profileState.errors.name[0]}</p>
              )}
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed for security reasons
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={isProfilePending}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                  >
                    {isProfilePending ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isProfilePending}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>

          {/* Password Change Section */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Update
                </button>
              )}
            </div>

            {isChangingPassword && (
              <form action={passwordAction} className="space-y-4">
                {passwordState?.success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">{passwordState.message}</p>
                  </div>
                )}

                {passwordState?.success === false && passwordState.errors._form && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{passwordState.errors._form[0]}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                    disabled={isPasswordPending}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                  />
                  {passwordState?.success === false && passwordState.errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordState.errors.currentPassword[0]}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    disabled={isPasswordPending}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                  />
                  {passwordState?.success === false && passwordState.errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordState.errors.newPassword[0]}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    disabled={isPasswordPending}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                  />
                  {passwordState?.success === false && passwordState.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordState.errors.confirmPassword[0]}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isPasswordPending}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
                  >
                    {isPasswordPending ? "Changing..." : "Change Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    disabled={isPasswordPending}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Account Information */}
          <div className="pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Account Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-semibold text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Account Status:</span>
                <span className={`font-semibold ${
                  user.status === "active" ? "text-green-600" : "text-red-600"
                }`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
