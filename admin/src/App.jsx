import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './routes/AppRouters'
import AuthProvider from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App