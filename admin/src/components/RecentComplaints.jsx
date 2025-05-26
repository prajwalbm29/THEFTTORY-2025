import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'

const RecentComplaints = () => {
    const [complaints, setComplaints] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchComplaints = async () => {
        try {
            const { data } = await axios.get('/api/v1/admin/recent-complaints')
            if (data?.success) {
                setComplaints(data?.complaints)
            }
        } catch (error) {
            console.log('error in fetching complaints', error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchComplaints()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <CgSpinner className="animate-spin text-blue-600 text-4xl" />
            </div>
        )
    }

    return (
        <div className="overflow-x-auto shadow-md sm:rounded-lg p-4 bg-white">
            <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-100 text-gray-600">
                    <tr>
                        <th className="px-4 py-3">Complaint ID</th>
                        <th className="px-4 py-3">Lost Location</th>
                        <th className="px-4 py-3">Lost Date</th>
                        <th className="px-4 py-3">Complaint Date</th>
                        <th className="px-4 py-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map((complaint) => (
                        <tr key={complaint._id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{complaint._id}</td>
                            <td className="px-4 py-2">{complaint.lostLocation}</td>
                            <td className="px-4 py-2">{new Date(complaint.lostDate).toLocaleDateString()}</td>
                            <td className="px-4 py-2">{new Date(complaint.complaintDate).toLocaleDateString()}</td>
                            <td className="px-4 py-2">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${complaint.isVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                                        }`}
                                >
                                    {complaint.isVerified ? 'Verified' : 'Not Verified'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default RecentComplaints