import React, { useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateUserProfile, updatePassword } from "../services/userService";
import { FiEdit2, FiUser, FiMail, FiLock, FiCheckCircle } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { baseURL } from "../services/api";
import { notifySuccess, notifyError, notifyWarning } from "../utils/toast";

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Form states
  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    username: user?.username || "",
    email: user?.email || "",
    profilePicture: user?.profile_pic || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateField = (fieldName, value) => {
    let newErrors = { ...errors };

    // Validate currentPassword
    if (fieldName === "currentPassword") {
      if (!value) {
        newErrors.currentPassword = "Current password is required";
      } else if (value.length < 8) {
        newErrors.currentPassword = "Password should be at least 8 characters";
      } else {
        newErrors.currentPassword = "";
      }
    }

    // Validate newPassword
    if (fieldName === "newPassword") {
      if (!value) {
        newErrors.newPassword = "New password is required";
      } else if (value.length < 8) {
        newErrors.newPassword = "Password should be at least 8 characters";
      } else {
        newErrors.newPassword = "";
      }

      // Re-check confirmPassword when newPassword changes
      if (
        passwordData.confirmPassword &&
        value !== passwordData.confirmPassword
      ) {
        newErrors.confirmPassword = "Passwords do not match";
      } else if (passwordData.confirmPassword) {
        newErrors.confirmPassword = "";
      }
    }

    // Validate confirmPassword
    if (fieldName === "confirmPassword") {
      if (!value) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (value !== passwordData.newPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        newErrors.confirmPassword = "";
      }
    }

    setErrors(newErrors);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value); // Ensure you validate the updated state
  };

  // Handle profile form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        notifyError("Image size must be less than 3MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Reset form data if canceling edit
      setFormData({
        firstName: user?.first_name || "",
        lastName: user?.last_name || "",
        username: user?.username || "",
        email: user?.email || "",
        profilePicture: user?.profile_pic || "",
      });
    }
    setIsEditing(!isEditing);
  };

  // Submit profile updates
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserProfile(formData);
      setUser(updatedUser);
      notifySuccess("Profile updated successfully!");
      // Clear message after 3 seconds
    } catch (error) {
      notifyWarning("Failed to update profile");
    }
    setIsEditing(false);
  };

  // Submit password change
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Validate all password fields before submission
    validateField("currentPassword", passwordData.currentPassword);
    validateField("newPassword", passwordData.newPassword);
    validateField("confirmPassword", passwordData.confirmPassword);

    // Check if there are any errors
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword ||
      passwordData.newPassword !== passwordData.confirmPassword ||
      Object.values(errors).some((err) => err !== "")
    ) {
      notifyWarning("Please fix the errors before submitting");
      return;
    }

    try {
      await updatePassword(passwordData);

      // Reset form and state on success
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      notifySuccess("Password updated successfully");
    } catch (error) {
      if (error.response && error.response.data) {
        notifyError(error.response.data.error || "Update failed");
      } else {
        notifyError("Password update failed. Please try again later.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
          </div>

          <div className="p-6">
            {/* Profile picture and basic info */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-white shadow">
                  {formData.profilePicture ? (
                    <img
                      src={
                        formData.profilePicture.startsWith("data:")
                          ? formData.profilePicture
                          : baseURL + formData.profilePicture
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-gray-400 text-6xl" />
                  )}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600"
                  >
                    <FiEdit2 size={16} />
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800">
                  {!isEditing
                    ? `${user?.first_name || ""} ${user?.last_name || ""}`
                    : ""}
                </h2>
                {!isEditing && (
                  <>
                    <p className="text-gray-600 flex items-center gap-2 mt-2">
                      <FiUser className="text-blue-500" /> @
                      {user?.username || ""}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      <FiMail className="text-blue-500" /> {user?.email || ""}
                    </p>
                  </>
                )}

                {!isEditing && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={toggleEditMode}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
                    >
                      <FiLock size={16} /> Change Password
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Form */}
            {isEditing && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={toggleEditMode}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Password Form */}
            {showPasswordForm && !isEditing && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Change Password
                </h3>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.currentPassword && (
                      <div className="text-red-500">
                        {errors.currentPassword}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.newPassword && (
                      <div className="text-red-500">{errors.newPassword}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.confirmPassword && (
                      <div className="text-red-500">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPasswordForm(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
