import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const ResolvedPhone = () => {
  const [complaints, setComplaints] = useState([])

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get('/api/v1/admin/resolved-phone-complaints')
      if (data?.success) {
        setComplaints(data.complaints)
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchComplaints()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">📱 Cell Phone Complaints</h1>

      {complaints.length === 0 ? (
        <div className="text-center text-gray-500">🎉 No resolved complaints found!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <Link key={complaint._id} to={`/admin/resolved-complaints/phone/${complaint._id}`} className='hover-shadow-lg transition transform hover:scale-105'>
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
                <h2 className="text-xl font-semibold mb-2">{complaint.brand} - {complaint.model}</h2>
                <p><strong>📱 IMEI:</strong> {complaint.imei}</p>
                <p><strong>📍 Lost Location:</strong> {complaint.lostLocation}</p>
                <p><strong>📆 Lost Date:</strong> {new Date(complaint.lostDate).toLocaleDateString()}</p>
                <p><strong>📝 Complaint Date:</strong> {new Date(complaint.complaintDate).toLocaleDateString()}</p>
                <p>
                  <strong>✔️ Status:</strong>{' '}
                  <span className={`font-medium ${complaint.isVerified ? 'text-green-600' : 'text-red-500'}`}>
                    {complaint.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default ResolvedPhone
