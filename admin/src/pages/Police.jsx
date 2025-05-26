import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import axios from 'axios'
import toast from 'react-hot-toast'

const Police = () => {
    const [loading, setLoading] = useState(true)
    const [polices, setPolices] = useState([])

    const getPolices = async () => {
        try {
            const { data } = await axios.get('/api/v1/admin/fetch-polices')
            if (data?.success) {
                setPolices(data?.polices)
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to fetch police data.')
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getPolices()
    }, [])

    const handleChangeAccess = async (id) => {
        try {
            const { data } = await axios.patch(`/api/v1/admin/update-police-access/${id}`)
            if (data?.success) {
                setPolices(prev => {
                    return prev.map(police => police._id == id ? { ...police, hasAccess: !police.hasAccess } : police)
                })
                toast.success(data?.message)
            }
        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.message || 'Error updating access.')
        }
    }

    return (
        <Layout>
            <div className="mt-6 mx-4 p-2">
                <h1 className="text-center text-2xl font-bold mb-4">Update Police Access</h1>
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border">Police ID</th>
                                    <th className="py-2 px-4 border">Position</th>
                                    <th className="py-2 px-4 border">Station Address</th>
                                    <th className="py-2 px-4 border">Access</th>
                                </tr>
                            </thead>
                            <tbody>
                                {polices.map(police => (
                                    <tr key={police?._id} className="text-center">
                                        <td className="py-2 px-4 border">{police?.policeId}</td>
                                        <td className="py-2 px-4 border">{police?.position}</td>
                                        <td className="py-2 px-4 border">{police?.stationAddress}</td>
                                        <td
                                            className={`py-2 px-4 border cursor-pointer ${police?.hasAccess ? 'text-green-600' : 'text-red-600'}`}
                                            onClick={() => handleChangeAccess(police?._id)}
                                        >
                                            {police?.hasAccess ? 'Allowed' : 'Declined'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default Police
