import { useEffect, useState } from 'react'
import axios from 'axios';

const AllocationModel = ({ complaintId, polices, allocation, onClose }) => {
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        const found = allocation.find(item => item.phoneComplaintId === complaintId);
        setSelected(found?.policeIds || []);
    }, [complaintId, allocation]);

    const togglePolice = async (policeId) => {
        try {
            await axios.patch('/api/v1/admin/update-phone-allocation', { policeId, cellComplaintId: complaintId });

            setSelected(prev =>
                prev.includes(policeId)
                    ? prev.filter(id => id !== policeId)
                    : [...prev, policeId]
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative border border-gray-400">
                <h2 className="text-xl font-semibold mb-4">Allocate Complaint</h2>
                <button onClick={onClose} className="absolute top-2 right-4 text-2xl cursor-pointer">❌</button>

                <div className="max-h-[400px] overflow-y-auto">
                    {polices.map(police => (
                        <div key={police._id} className="flex items-center justify-between border-b py-2">
                            <div>
                                <p className="font-medium">ID: {police.policeId}</p>
                                <p>Position: {police.position}</p>
                                <p>Station: {police.stationAddress}</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={selected.includes(police._id)}
                                onChange={() => togglePolice(police._id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllocationModel