import React, {useContext, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { removeTokens, baseURL } from '../services/api';

const Navbar = () => {
    const [profileOpen, setProfileOpen] = useState(false);
    const {user, setUser} = useContext(AuthContext);

  const navigate = useNavigate()
    // Toggle profile dropdown
  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

   const logoutUser = () =>{
      removeTokens()
      setUser(null)
  
      navigate("/")
    }
  
  return (
   
     <>
            {/* Navbar */}
            <nav className="bg-gradient-to-r from-gray-700 to-gray-900  text-white p-4">
              <div className="container mx-auto flex justify-between items-center">
                <div className="text-xl font-bold">Employee Management System</div>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={toggleProfile}
                    className="flex items-center hover:bg-gray-800 px-2 py-1 rounded space-x-2 focus:outline-none"
                    >
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <img src={baseURL + user.profile_pic}
                      className="w-full h-full object-cover rounded-full"/>
                    </div>
                    {/* <span>{user.username}</span> */}
                  </button>
                  
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg py-2 z-10">
                      <a href="#" className="block px-4 py-2 text-black hover:bg-gray-200">My Profile</a>
                      <a href="#" className="block px-4 py-2 text-black hover:bg-gray-200">Settings</a>
                      <a onClick={logoutUser} className="block px-4 py-2 text-black hover:bg-gray-200">Logout</a>
                    </div>
                  )}
                </div>
              </div>
            </nav>
                  </>
   
  )
}

export default Navbar
