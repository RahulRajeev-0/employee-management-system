import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { getAccessToken } from '../services/api';
import { getCurrentUser } from '../services/userService';

// Create context
export const AuthContext = createContext(null);

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = getAccessToken()
                if (token) {
                    const userProfile = await getCurrentUser()
                    setUser(userProfile)
                    console.log(userProfile);
                }
            } catch(error) {
                console.error('Auth initialization error:', error);
            } finally {
                // Set loading to false regardless of authentication status
                setLoading(false);
            }
        }
        
        checkAuth();
    }, []) // Empty dependency array is fine here
    
    const isAuthenticated = () => !!user;
    
    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}