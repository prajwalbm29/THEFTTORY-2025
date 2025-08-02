import axios from 'axios';
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom'

const ResolvedDetails = () => {
    const { type, id } = useParams()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const [statusData, setStatusData] = useState(null);

    const [loading, setLoading] = useState(false)

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
    useEffect(() => {
        getStatus()
    }, [])

    const handleSendMail = async () => {
        try {
            setLoading(true)
            const {data} = await axios.post('/api/v1/admin/send-notification-mail', {title, description, type, id})
            if (data?.success) {
                toast.success(data?.message)
                setTitle('')
                setDescription('')
            } else {
                toast.error(data?.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || "Failed to send mail.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {statusData ? (
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
            ) : (
                <div className="mt-4 mb-6">
                    <h3 className="font-bold mb-4 text-center text-red-700">No Complaint Status updated by the police</h3>
                </div>
            )}

            {/* Mail Section */}
            <div className="m-6 border p-4 rounded-lg shadow-sm bg-gray-50">
                <h4 className="text-lg font-bold mb-2">📧 Notify Client</h4>
                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        type="text"
                        placeholder="Enter mail title"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Enter mail description"
                        rows="4"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    onClick={handleSendMail}
                    disabled={loading}
                >
                    {loading ? 'SENDING...' : 'SEND NOTIFICATION'}
                </button>
            </div>
        </>
    )
}

export default ResolvedDetails