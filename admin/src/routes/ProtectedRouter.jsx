import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRouter = () => {
    const { isAdmin } = useContext(AuthContext)

    if (isAdmin === null) {
        return (
            <p>Loading....</p>
        )
    }

    return isAdmin ? <Outlet /> : <Navigate to={'/login'} />
}

export default ProtectedRouter