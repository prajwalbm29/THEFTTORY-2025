import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Link, Outlet } from 'react-router-dom'
import axios from 'axios'
import { FaMobileAlt, FaLaptop, FaMotorcycle, FaCar, FaCoins } from 'react-icons/fa'

const Complaints = () => {
  const [phonecount, setPhonecount] = useState()
  const [laptopcount, setLaptopcount] = useState()
  const [bikecount, setBikecount] = useState()
  const [carcount, setCarcount] = useState()
  const [goldcount, setGoldcount] = useState()

  const fetchCount = async () => {
    try {
      const types = ['phone', 'laptop', 'bike', 'car', 'gold']
      const responses = await Promise.all(
        types.map(type => axios.get(`/api/v1/complaint/complaint-count/${type}`))
      )

      setPhonecount(responses[0]?.data?.count)
      setLaptopcount(responses[1]?.data?.count)
      setBikecount(responses[2]?.data?.count)
      setCarcount(responses[3]?.data?.count)
      setGoldcount(responses[4]?.data?.count)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchCount()
  }, [])

  return (
    <Layout>
      <div className='mt-4 mb-6 shadow'>
        <h1 className='text-center font-bold text-lg'>Verify the complaints using the details</h1>
        <div className='grid grid-cols-12'>
          <div className='col-span-12 md:col-span-6 lg:col-span-4'>
            <Cart
              link={'/admin/complaints/phone'}
              title={'Cell Phone Complaints'}
              count={phonecount}
              icon={<FaMobileAlt className="text-blue-500 text-2xl mr-2" />}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4'>
            <Cart
              link={'/admin/complaints/laptop'}
              title={'Laptop Complaints'}
              count={laptopcount}
              icon={<FaLaptop className="text-green-500 text-2xl mr-2" />}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4'>
            <Cart
              link={'/admin/complaints/bike'}
              title={'Bike Complaints'}
              count={bikecount}
              icon={<FaMotorcycle className="text-yellow-500 text-2xl mr-2" />}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4'>
            <Cart
              link={'/admin/complaints/car'}
              title={'Car Complaints'}
              count={carcount}
              icon={<FaCar className="text-red-500 text-2xl mr-2" />}
            />
          </div>
          <div className='col-span-12 md:col-span-6 lg:col-span-4'>
            <Cart
              link={'/admin/complaints/gold'}
              title={'Gold Complaints'}
              count={goldcount}
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

const Cart = ({ title, link, count, icon }) => {
  return (
    <Link to={link} className="block p-6 m-4 bg-gray-40 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600">
        Total number of {title.toLowerCase()}: <span className="font-bold">{count ?? 0}</span>
      </p>
    </Link>
  )
}


export default Complaints