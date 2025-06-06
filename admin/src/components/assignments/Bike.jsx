import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AllocationModel from './AllocationModel'

const Bike = () => {
  const [openModel, setOpenModel] = useState(false)
  const [selectedComplaintId, setSelectedComplaintId] = useState(null)

  const [complaints, setComplaints] = useState([])
  const [allocation, setAllocation] = useState([])
  const [polices, setPolices] = useState([])

  const getComplaints = async () => {
    try {
      const { data } = await axios.get('/api/v1/admin/fetch-bike-complaints')
      if (data?.success) {
        await filterResolved(data?.complaints.filter(complaint => complaint?.isVerified))
      }
    } catch (error) {
      console.error(error)
    }
  }
  const filterResolved = async (complaints) => {
    try {
      const { data } = await axios.get('/api/v1/complaint/resolved-complaints')
      if (data?.success) {
        const resolvedIds = data?.resolvedComplaints.map(id => id.toString());
        const filtered = complaints.filter(complaint => {
          return !resolvedIds.includes(complaint._id.toString());
        });
        setComplaints(filtered);
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchPolices = async () => {
    try {
      const { data } = await axios.get('/api/v1/admin/fetch-polices')
      if (data?.success) {
        setPolices(data?.polices.filter(police => police?.hasAccess))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchAllocation = async () => {
    try {
      const { data } = await axios.get('/api/v1/admin/get-bike-complaint-allocation')
      if (data?.success) {
        setAllocation(data?.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getComplaints()
    fetchPolices()
    fetchAllocation()
  }, [])

  const handleCloseModel = async () => {
    setOpenModel(false)
    await fetchAllocation()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-400">🏍 Bike Complaints</h1>
      <table className="w-full table-auto border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-blue-100 text-left text-sm font-semibold text-gray-700">
            <th className="px-4 py-2 border-b border-gray-300">Registration Number</th>
            <th className="px-4 py-2 border-b border-gray-300">Chasis Number</th>
            <th className="px-4 py-2 border-b border-gray-300">Engine Number</th>
            <th className="px-4 py-2 border-b border-gray-300">Brand</th>
            <th className="px-4 py-2 border-b border-gray-300">Model</th>
            <th className="px-4 py-2 border-b border-gray-300">Lost Date</th>
            <th className="px-4 py-2 border-b border-gray-300">Complaint Date</th>
            <th className="px-4 py-2 border-b border-gray-300">Lost Location</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr
              key={complaint._id}
              className="cursor-pointer hover:bg-gray-100 text-sm transition"
              onClick={() => {
                setSelectedComplaintId(complaint._id)
                setOpenModel(true)
              }}
            >
              <td className="px-4 py-2 border-b border-gray-200">{complaint.registrationNo}</td>
              <td className="px-4 py-2 border-b border-gray-200">{complaint.chasisNo}</td>
              <td className="px-4 py-2 border-b border-gray-200">{complaint.engineNo}</td>
              <td className="px-4 py-2 border-b border-gray-200">{complaint.brand}</td>
              <td className="px-4 py-2 border-b border-gray-200">{complaint.model}</td>
              <td className="px-4 py-2 border-b border-gray-200">
                {new Date(complaint.lostDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border-b border-gray-200">
                {new Date(complaint.complaintDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border-b border-gray-200">{complaint.lostLocation}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {openModel && selectedComplaintId && (
        <AllocationModel
          complaintId={selectedComplaintId}
          polices={polices}
          allocation={allocation}
          onClose={handleCloseModel}
        />
      )}
    </div>
  )
}

export default Bike;
