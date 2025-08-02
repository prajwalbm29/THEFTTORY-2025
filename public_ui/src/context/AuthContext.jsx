import React, { createContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import Config from 'react-native-config'; not working .env access

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState({
        name: '',
        aadhaarNo: ''
    })
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const verifyAuthentication = async () => {
        const token = await AsyncStorage.getItem('ACCESS_TOKEN');
        if (!token) {
            setIsAuthenticated(false);
            return;
        }
        const decoded = jwtDecode(token);
        if (decoded.exp < Date.now()) {
            await AsyncStorage.removeItem('ACCESS_TOKEN');
            setIsAuthenticated(false);
            return;
        }
        axios.defaults.headers.common['Authorization'] = token;
        setIsAuthenticated(true);
    };
    useEffect(() => {
        axios.defaults.baseURL = 'http://192.168.19.63:7001'; //Config.API_BASE_URL
        verifyAuthentication();
    }, []);

    const login = async (token, name, aadhaarNo) => {
        setIsAuthenticated(true);
        await AsyncStorage.setItem('ACCESS_TOKEN', token);
        axios.defaults.headers.common['Authorization'] = token;
        setUser({
            name,
            aadhaarNo,
        });
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login }}>
            {children}
        </AuthContext.Provider>
    )
};

