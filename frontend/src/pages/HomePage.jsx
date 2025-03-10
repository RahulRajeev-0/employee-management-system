import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { baseURL, removeTokens } from '../services/api';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const {user, setUser} = useContext(AuthContext);
  const navigate = useNavigate()
  // Sample employee data
  const initialEmployees = [
    { id: 1, name: 'John Doe', position: 'Frontend Developer', department: 'Engineering', status: 'Active' },
    { id: 2, name: 'Jane Smith', position: 'UI/UX Designer', department: 'Design', status: 'Active' },
    { id: 3, name: 'Michael Johnson', position: 'Project Manager', department: 'Management', status: 'On Leave' },
    { id: 4, name: 'Emily Williams', position: 'Backend Developer', department: 'Engineering', status: 'Active' },
    { id: 5, name: 'Robert Brown', position: 'HR Specialist', department: 'Human Resources', status: 'Active' },
    { id: 6, name: 'Sarah Davis', position: 'Marketing Specialist', department: 'Marketing', status: 'Inactive' },
  ];

  const [employees, setEmployees] = useState(initialEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [profileOpen, setProfileOpen] = useState(false);

  // Get unique departments for filter dropdown
  const departments = ['All', ...new Set(employees.map(emp => emp.department))];
  
  // Get unique statuses for filter dropdown
  const statuses = ['All', ...new Set(employees.map(emp => emp.status))];

  const logoutUser = () =>{
    removeTokens()
    setUser(null)

    navigate("/")
  }

  // Toggle profile dropdown
  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle department filter change
  const handleDepartmentChange = (e) => {
    setDepartmentFilter(e.target.value);
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Apply filters when dependencies change
  useEffect(() => {
    let results = initialEmployees;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(employee => 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        employee.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply department filter
    if (departmentFilter !== 'All') {
      results = results.filter(employee => employee.department === departmentFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      results = results.filter(employee => employee.status === statusFilter);
    }
    
    setFilteredEmployees(results);
  }, [searchTerm, departmentFilter, statusFilter]);

 

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-black text-white p-4">
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
              <span>{user.username}</span>
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
      
      {/* Main Content */}
      <main className="flex-grow p-4">
        <div className="container mx-auto">
          {/* Dashboard Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-black">Dashboard</h1>
            <p className="text-gray-600">Welcome back, Admin!</p>
          </div>
          
          {/* Employee Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Total Employees</h2>
              <p className="text-3xl font-bold">{employees.length}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Active Employees</h2>
              <p className="text-3xl font-bold">{employees.filter(emp => emp.status === 'Active').length}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Departments</h2>
              <p className="text-3xl font-bold">{new Set(employees.map(emp => emp.department)).size}</p>
            </div>
          </div>
          
          {/* Employee List Section */}
          <div className="bg-white rounded shadow overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Employee List</h2>
              <button className="bg-black text-white px-4 py-2 rounded">Add Employee</button>
            </div>
            
            {/* Search and Filter Section */}
            <div className="p-4 border-b">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    placeholder="Search by name or position..."
                    className="w-full border border-gray-300 rounded p-2"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                
                {/* Department Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select 
                    className="w-full border border-gray-300 rounded p-2"
                    value={departmentFilter}
                    onChange={handleDepartmentChange}
                  >
                    {departments.map(department => (
                      <option key={department} value={department}>{department}</option>
                    ))}
                  </select>
                </div>
                
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    className="w-full border border-gray-300 rounded p-2"
                    value={statusFilter}
                    onChange={handleStatusChange}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Employee Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-4">ID</th>
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Position</th>
                    <th className="text-left p-4">Department</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map(employee => (
                      <tr key={employee.id} className="border-t hover:bg-gray-50">
                        <td className="p-4">{employee.id}</td>
                        <td className="p-4">{employee.name}</td>
                        <td className="p-4">{employee.position}</td>
                        <td className="p-4">{employee.department}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            employee.status === 'Active' ? 'bg-gray-800 text-white' : 
                            employee.status === 'On Leave' ? 'bg-gray-400 text-black' : 
                            'bg-gray-200 text-black'
                          }`}>
                            {employee.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button className="p-1 text-gray-600 hover:text-black">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button className="p-1 text-gray-600 hover:text-black">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-500">No employees found matching your criteria</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex justify-between items-center p-4 border-t">
              <div className="text-gray-600">
                Showing {filteredEmployees.length} of {employees.length} entries
              </div>
              <div className="flex space-x-1">
                <button className="px-3 py-1 bg-gray-200 text-black rounded">Previous</button>
                <button className="px-3 py-1 bg-black text-white rounded">1</button>
                <button className="px-3 py-1 bg-gray-200 text-black rounded">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-black text-white p-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>© 2025 Employee Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;