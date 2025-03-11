import api, { removeTokens } from './api';
import {setAccessToken, setRefreshToken} from './api'

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/user/signup/', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/user/login/', credentials);
    setAccessToken(response.data.access)
    setRefreshToken(response.data.refresh)
    return response.data.user;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/user/details/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (passwordData)=> {
  try{
    const formData = new FormData();
    formData.append("current_password", passwordData.currentPassword)
    formData.append("new_password", passwordData.newPassword)

    const response = await api.patch('/user/details/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return ;
  }catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
}


export const updateUserProfile = async (userData) => {
  try {
    // Create FormData to handle file uploads
    const formData = new FormData();
    
    // Add text fields to FormData
    formData.append('first_name', userData.firstName);
    formData.append('last_name', userData.lastName);
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    
    // Handle profile picture - check if it's a base64 string (newly uploaded)
    if (userData.profilePicture && userData.profilePicture.startsWith('data:')) {
      // Convert base64 to file
      const response = await fetch(userData.profilePicture);
      const blob = await response.blob();
      const file = new File([blob], 'profile-picture.jpg', { type: 'image/jpeg' });
      formData.append('profile_pic', file);
    }
    
    // Send the request with FormData
    const response = await api.put('/user/details/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};