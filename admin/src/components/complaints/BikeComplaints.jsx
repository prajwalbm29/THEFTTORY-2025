import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const BikeComplaints = () => {
  const [complaints, setComplaints] = useState([])

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get('/api/v1/admin/fetch-bike-complaints')
      if (data?.success) {
        setComplaints(data.complaints)
        fetchResolvedComplaints(data.complaints)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchResolvedComplaints = async (allComplaints) => {
    try {
      const { data } = await axios.get('/api/v1/complaint/resolved-complaints')
      if (data?.success && Array.isArray(data.resolvedComplaints)) {
        const filtered = allComplaints.filter(
          c => !data.resolvedComplaints.includes(c._id)
        )
        setComplaints(filtered)
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
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">🏍 Bike Complaints</h1>

      {complaints.length === 0 ? (
        <div className="text-center text-gray-500">🎉 No unresolved complaints found!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <Link key={complaint._id} to={`/admin/complaints/bike/${complaint._id}`} className='hover-shadow-lg transition transform hover:scale-105'>
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
                <h2 className="text-xl font-semibold mb-2">{complaint.brand} - {complaint.model}</h2>
                <p><strong>🏍 Registration Number:</strong> {complaint.registrationNo}</p>
                <p><strong>🏍 Chasis Number:</strong> {complaint.chasisNo}</p>
                <p><strong>🏍 Engine Number:</strong> {complaint.engineNo}</p>
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

export default BikeComplaints
