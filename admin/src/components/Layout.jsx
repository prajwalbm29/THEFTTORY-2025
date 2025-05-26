import React from 'react'
import Header from './Header'

const Layout = ({ children }) => {
    return (
        <div className='bg-white text-gray-800'>
            <Header />
            <main style={{ minHeight: '70vh' }}>
                {children}
            </main>
        </div>
    )
}

export default Layout