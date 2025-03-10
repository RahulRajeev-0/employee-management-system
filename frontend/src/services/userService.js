import { useNavigate } from 'react-router-dom';
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

