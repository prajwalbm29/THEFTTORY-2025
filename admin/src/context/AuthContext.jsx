import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(null)

    const checkAdmin = () => {
        try {
            const token = localStorage.getItem('ACCESS_TOKEN')
            if (!token) {
                setIsAdmin(false)
                return
            }
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now() || !decoded.isAdmin) {
                setIsAdmin(false)
                delete axios.defaults.headers.common['Authorization']
                return
            }
            axios.defaults.headers.common['Authorization'] = token
            setIsAdmin(true)
        } catch (error) {
            console.error('error in checking admin', error)
            setIsAdmin(false)
        }
    }
    useEffect(() => {
        axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
        checkAdmin()
    }, [])

    const login = (token) => {
        localStorage.setItem('ACCESS_TOKEN', token)
        axios.defaults.headers.common['Authorization'] = token
        checkAdmin()
    }

    return (
        <AuthContext.Provider value={{isAdmin, login}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider