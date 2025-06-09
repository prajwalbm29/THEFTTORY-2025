import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';

const GeneralSafety = () => {
  const [safetyTips, setSafetyTips] = useState([]);
  const [policeUpdates, setPoliceUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSafetyTipInput, setShowSafetyTipInput] = useState(false);
  const [showPoliceUpdateInput, setShowPoliceUpdateInput] = useState(false);
  const [newSafetyTip, setNewSafetyTip] = useState('');
  const [newPoliceUpdate, setNewPoliceUpdate] = useState('');

  const [editingTipId, setEditingTipId] = useState(null);
  const [editingUpdateId, setEditingUpdateId] = useState(null);
  const [editTipText, setEditTipText] = useState('');
  const [editUpdateText, setEditUpdateText] = useState('');
  const handleEditTip = async (id) => {
    try {
      await axios.put(`/api/v1/admin/update-safetyTips/${id}`, { tips: editTipText });
      toast.success('Safety tip updated');
      getSafetyTips();
      setEditingTipId(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to edit");
    }
  };
  const handleDeleteTip = async (id) => {
    try {
      await axios.delete(`/api/v1/admin/delete-safetyTips/${id}`);
      toast.success('Safety tip deleted');
      getSafetyTips();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete safety tip');
    }
  };

  const handleEditUpdate = async (id) => {
    try {
      await axios.put(`/api/v1/admin/update-updateTips/${id}`, { update: editUpdateText });
      toast.success('Police update modified');
      getPoliceUpdates();
      setEditingUpdateId(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update police update');
    }
  };
  const handleDeleteUpdate = async (id) => {
    try {
      await axios.delete(`/api/v1/admin/delete-updateTips/${id}`);
      toast.success('Police update deleted');
      getPoliceUpdates();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete police update');
    }
  };


  const getSafetyTips = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/v1/complaint/get-safetyTips');
      if (data?.success) {
        setSafetyTips(data?.safetyTips);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch safety tips');
    } finally {
      setLoading(false);
    }
  };

  const getPoliceUpdates = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/v1/police/get-updateTips');
      if (data?.success) {
        setPoliceUpdates(data?.policeUpdates);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch police updates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSafetyTips();
    getPoliceUpdates();
  }, []);

  const handleAddSafetyTip = async () => {
    if (!newSafetyTip.trim()) {
      toast.error('Please enter a safety tip');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post('/api/v1/admin/add-safetyTips', {
        tips: newSafetyTip
      });

      if (data?.success) {
        toast.success('Safety tip added successfully');
        setSafetyTips(prev => [data?.newTip, ...prev]);
        setNewSafetyTip('');
        setShowSafetyTipInput(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add safety tip');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPoliceUpdate = async () => {
    if (!newPoliceUpdate.trim()) {
      toast.error('Please enter a police update');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post('/api/v1/admin/add-updateTips', {
        update: newPoliceUpdate
      });

      if (data?.success) {
        toast.success('Police update added successfully');
        setPoliceUpdates(prev => [data?.newUpdate, ...prev]);
        setNewPoliceUpdate('');
        setShowPoliceUpdateInput(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add police update');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Safety Information</h1>

        {/* Safety Tips Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Safety Tips</h2>
            <button
              onClick={() => setShowSafetyTipInput(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Safety Tip
            </button>
          </div>

          {showSafetyTipInput && (
            <div className="mb-4 flex gap-2">
              <textarea
                value={newSafetyTip}
                onChange={(e) => setNewSafetyTip(e.target.value)}
                placeholder="Enter new safety tip"
                className="flex-1 p-2 border rounded"
                rows={3}
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleAddSafetyTip}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowSafetyTipInput(false);
                    setNewSafetyTip('');
                  }}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {safetyTips.length === 0 ? (
            <p className="text-gray-500">No safety tips found</p>
          ) : (
            <div className="space-y-4">
              {safetyTips.map((item) => (
                <div key={item._id} className="p-4 border rounded-lg shadow-sm">
                  {editingTipId === item._id ? (
                    <div>
                      <textarea
                        value={editTipText}
                        onChange={(e) => setEditTipText(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows={3}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditTip(item._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTipId(null)}
                          className="bg-gray-600 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-4">
                      <p className="flex-1">{item.tips}</p>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => {
                            setEditingTipId(item._id);
                            setEditTipText(item.tips);
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTip(item._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Police Updates Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Police Updates</h2>
            <button
              onClick={() => setShowPoliceUpdateInput(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Police Update
            </button>
          </div>

          {showPoliceUpdateInput && (
            <div className="mb-4 flex gap-2">
              <textarea
                value={newPoliceUpdate}
                onChange={(e) => setNewPoliceUpdate(e.target.value)}
                placeholder="Enter new police update"
                className="flex-1 p-2 border rounded"
                rows={3}
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleAddPoliceUpdate}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowPoliceUpdateInput(false);
                    setNewPoliceUpdate('');
                  }}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {policeUpdates.length === 0 ? (
            <p className="text-gray-500">No police updates found</p>
          ) : (
            <div className="space-y-4">
              {policeUpdates.map((update) => (
                <div key={update._id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                  {editingUpdateId === update._id ? (
                    <div>
                      <textarea
                        value={editUpdateText}
                        onChange={(e) => setEditUpdateText(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows={3}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditUpdate(update._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUpdateId(null)}
                          className="bg-gray-600 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-4">
                      <p className="flex-1">{update.update}</p>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => {
                            setEditingUpdateId(update._id);
                            setEditUpdateText(update.update);
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUpdate(update._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );

};

export default GeneralSafety;