import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { removeTokens, baseURL } from '../services/api';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Toggle profile dropdown
  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const logoutUser = () => {
    removeTokens();
    setUser(null);
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate('/')}
        >
          Employee Management System
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <button
            onClick={() => handleNavigation('/')}
            className="hover:text-gray-300 transition"
          >
            Home
          </button>
          <button
            onClick={() => handleNavigation('/form')}
            className="hover:text-gray-300 transition"
          >
            Forms
          </button>
          <button
            onClick={() => handleNavigation('/reports')}
            className="hover:text-gray-300 transition"
          >
            Reports
          </button>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={toggleProfile}
            className="flex items-center hover:bg-gray-800 px-2 py-1 rounded space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <img
                src={baseURL + user.profile_pic}
                className="w-full h-full object-cover rounded-full"
                alt="Profile"
              />
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg py-2 z-10">
              <a
                onClick={() => handleNavigation('/profile')}
                className="block px-4 py-2 text-black hover:bg-gray-200 cursor-pointer"
              >
                My Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-black hover:bg-gray-200"
              >
                Settings
              </a>
              <a
                onClick={logoutUser}
                className="block px-4 py-2 text-black hover:bg-gray-200 cursor-pointer"
              >
                Logout
              </a>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-4">
          <button
            onClick={() => handleNavigation('/dashboard')}
            className="text-sm hover:text-gray-300 transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNavigation('/employees')}
            className="text-sm hover:text-gray-300 transition"
          >
            Employees
          </button>
          <button
            onClick={() => handleNavigation('/reports')}
            className="text-sm hover:text-gray-300 transition"
          >
            Reports
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
