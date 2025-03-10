import React, { useContext, useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { notifySuccess, notifyError, notifyWarning } from "../utils/toast";
import { getCurrentUser, loginUser } from "../services/userService";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const {setUser} = useContext(AuthContext)
  const handleSubmit = async(e) => {
    e.preventDefault();
    const requestData = new FormData()
    requestData.append("email", email)
    requestData.append("password", password)
    try{
      const response = await loginUser(requestData);
      const userProfile = await getCurrentUser()
      setUser(userProfile)
      notifySuccess("Login successfully!");

      navigate('/')

    }catch(error){
      if (error.response && error.response.data) {
                notifyError(error.response.data.error || "Login failed");
              }else{
                  notifyError("Registration failed. Please try again later.");
              }
    }
    // Add your authentication logic here
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left side - Image for larger screens */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-800 items-center justify-center">
        <div className="max-w-md text-center text-white p-8">
          <h1 className="text-4xl font-bold mb-6">Employee Management System</h1>
          <p className="text-xl">Welcome back, log in to access your dashboard.</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo for mobile view */}
          <div className="text-center mb-10 lg:hidden">
            <h1 className="text-3xl font-bold text-blue-600">Welcome Back</h1>
            <p className="mt-2 text-gray-600">Log in to your account</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              {/* <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div> */}

              {/* Login Button */}
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </form>

            {/* Sign up link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </a>
              </p>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;