import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Link, Outlet } from 'react-router-dom'
import Layout from '../components/Layout'
import { FaMobileAlt, FaLaptop, FaMotorcycle, FaCar, FaCoins } from 'react-icons/fa'

function ResolvedComplaints() {
    const [resolvedCnt, setResolvedCnt] = useState({
        phone: 0,
        laptop: 0,
        bike: 0,
        car: 0,
        gold: 0
    })

    const findTotalCount = async () => {
        try {
            const { data } = await axios.get('/api/v1/admin/resolved-complaints-count');
            if (data?.success) {
                setResolvedCnt({
                    phone: data?.phone,
                    laptop: data?.laptop,
                    bike: data?.bike,
                    car: data?.car,
                    gold: data?.gold
                });
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || "Failed to fetch resolved count.");
        }
    }
    useEffect(() => {
        findTotalCount();
    }, [])

    return (
        <Layout>
            <div className='mt-4 mb-6 shadow'>
                <h1 className='text-center font-bold text-lg'>Notify the Public</h1>
                <div className='grid grid-cols-12'>
                    <div className='col-span-12 md:col-span-6 lg:col-span-4'>
                        <Cart
                            link={'/admin/resolved-complaints/phone'}
                            title={'Cell Phone Complaints'}
                            count={resolvedCnt.phone}
                            icon={<FaMobileAlt className="text-blue-500 text-2xl mr-2" />}
                        />
                    </div>
                    <div className='col-span-12 md:col-span-6 lg:col-span-4'>
                        <Cart
                            link={'/admin/resolved-complaints/laptop'}
                            title={'Laptop Complaints'}
                            count={resolvedCnt.laptop}
                            icon={<FaLaptop className="text-green-500 text-2xl mr-2" />}
                        />
                    </div>
                    <div className='col-span-12 md:col-span-6 lg:col-span-4'>
                        <Cart
                            link={'/admin/complaints/bike'}
                            title={'Bike Complaints'}
                            count={resolvedCnt.bike}
                            icon={<FaMotorcycle className="text-yellow-500 text-2xl mr-2" />}
                        />
                    </div>
                    <div className='col-span-12 md:col-span-6 lg:col-span-4'>
                        <Cart
                            link={'/admin/complaints/car'}
                            title={'Car Complaints'}
                            count={resolvedCnt.car}
                            icon={<FaCar className="text-red-500 text-2xl mr-2" />}
                        />
                    </div>
                    <div className='col-span-12 md:col-span-6 lg:col-span-4'>
                        <Cart
                            link={'/admin/complaints/gold'}
                            title={'Gold Complaints'}
                            count={resolvedCnt.car}
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

export default ResolvedComplaints