import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const GoldDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getDetails = async () => {
    try {
      const { data } = await axios.get(`/api/v1/complaint/gold-details/${id}`);
      console.log(data)
      if (data?.success) {
        setComplaint(data?.gold);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to fetch Car details.');
    }
  };

  const getStatus = async () => {
    try {
      const { data } = await axios.get(`/api/v1/complaint/complaint-status/${id}`);
      if (data?.success) {
        setStatusData(data.complaint);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to fetch complaint status.');
    }
  };

  const toggleVerification = async () => {
    try {
      setLoading(true);
      const { data } = await axios.patch(`/api/v1/admin/update-gold-status/${id}`);
      if (data?.success) {
        setComplaint((prev) => ({ ...prev, isVerified: !prev.isVerified }));
        toast.success(data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
    getStatus();
  }, []);



  if (!complaint) return <p className="text-center mt-10">Loading complaint details...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 mb-10 p-6 bg-white rounded-xl shadow-lg space-y-4 border">
      <h2 className="text-2xl font-semibold text-center mb-4"> Gold Complaint Details</h2>
      <div className="space-y-2 text-gray-700">
        <p><strong>Weight in grams:</strong> {complaint.weight}</p>
        <p><strong>Unique Feature:</strong> {complaint.uniqueFeature}</p>
        <p><strong>Witness:</strong> {complaint.witness}</p>
        <hr />
        <p><strong>Lost Location:</strong> {complaint.lostLocation}</p>
        <p><strong>Lost Description:</strong> {complaint.lostDescription}</p>
        <p><strong>Lost Date:</strong> {new Date(complaint.lostDate).toLocaleDateString()}</p>
        <p><strong>Complaint Date:</strong> {new Date(complaint.complaintDate).toLocaleDateString()}</p>

        {/* Status Tracker */}
        {statusData && (
          <div className="mt-4 mb-6">
            <h3 className="text-xl font-bold mb-4">🛠️ Complaint Status Tracker</h3>
            <ul className="space-y-4 border-l-4 border-blue-500 pl-4">
              {statusData.status.map((step, index) => (
                <li key={index} className="relative">
                  <div className="absolute -left-3 top-1 w-4 h-4 bg-blue-500 rounded-full"></div>
                  <p className="font-semibold">{step}</p>
                  <p className="text-gray-600 text-sm">{statusData.description[index]}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p>
          <strong>Verification:</strong>{' '}
          <span className={complaint.isVerified ? 'text-green-600' : 'text-red-600'}>
            {complaint.isVerified ? 'Verified' : 'Not Verified'}
          </span>
        </p>
      </div>

      <button
        onClick={toggleVerification}
        disabled={loading}
        className={`mt-4 w-full px-4 py-2 rounded-md text-white ${complaint.isVerified ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } transition`}
      >
        {loading ? 'Updating...' : complaint.isVerified ? 'Mark as Not Verified' : 'Mark as Verified'}
      </button>
    </div>
  );
};

export default GoldDetails;