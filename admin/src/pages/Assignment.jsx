import React from 'react'
import Layout from '../components/Layout'
import { Link, Outlet } from 'react-router-dom'
import { FaCar, FaCoins, FaLaptop, FaMobileAlt, FaMotorcycle } from 'react-icons/fa'

const Assignment = () => {
  return (
    <Layout>
      <div className='mt-4 mb-6 shadow'>
        <h1 className='text-center font-bold text-lg'>Allocate police to verified complaints</h1>
        <div className='grid grid-cols-12'>
          <div className='col-span-12 md:col-span-6 lg:col-span-4'>
            <Cart
              link={'/admin/assignment/phone'}
              title={'Cell Phone Complaints'}
              icon={<FaMobileAlt className="text-blue-500 text-2xl mr-2" />}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4'>
            <Cart
              link={'/admin/assignment/laptop'}
              title={'Laptop Complaints'}
              icon={<FaLaptop className="text-green-500 text-2xl mr-2" />}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4'>
            <Cart
              link={'/admin/assignment/bike'}
              title={'Bike Complaints'}
              icon={<FaMotorcycle className="text-yellow-500 text-2xl mr-2" />}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4'>
            <Cart
              link={'/admin/assignment/car'}
              title={'Car Complaints'}
              icon={<FaCar className="text-red-500 text-2xl mr-2" />}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4'>
            <Cart
              link={'/admin/assignment/gold'}
              title={'Gold Complaints'}
              icon={<FaCoins className="text-amber-500 text-2xl mr-2" />}
            />
          </div>
        </div>
      </div>
      <main style={{ minHeight: '60vh' }}>
        <Outlet />
      </main>
    </Layout>
  )
}

const Cart = ({ title, link, icon }) => {
  return (
    <Link to={link} className="block p-6 m-4 bg-gray-40 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
    </Link>
  )
}

export default Assignment