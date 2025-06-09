const cellphoneModel = require("../models/cellphone");
const laptopModel = require('../models/laptop');
const bikeModel = require('../models/bike');
const carModel = require('../models/car');
const goldModel = require('../models/gold');
const policeComplaintsModel = require("../models/complaintAllocation");
const policeModel = require("../models/police");
const resolvedComplaintModel = require("../models/resolvedComplaints");
const safetyTipsModel = require('../models/safetyTips');
const updateTipsModel = require('../models/updates');

const fetchPhoneComplaintsController = async (req, res) => {
    try {
        const complaints = await cellphoneModel.find({}).select("imei brand model lostLocation lostDate complaintDate isVerified")
        return res.status(200).json({ success: true, message: "Complaints fetched successfully.", complaints })
    } catch (error) {
        console.error('failed to fetch complaints', error);
        return res.status(500).json({ success: true, message: error.message });
    }
}
const fetchLaptopComplaintsController = async (req, res) => {
    try {
        const complaints = await laptopModel.find({}).select("serialNo brand model lostLocation lostDate complaintDate isVerified")
        return res.status(200).json({ success: true, message: "Complaints fetched successfully.", complaints })
    } catch (error) {
        console.error('failed to fetch complaints', error);
        return res.status(500).json({ success: true, message: error.message });
    }
}
const fetchBikeComplaintsController = async (req, res) => {
    try {
        const complaints = await bikeModel.find({}).select("registrationNo chasisNo engineNo brand model lostLocation lostDate complaintDate isVerified")
        return res.status(200).json({ success: true, message: "Complaints fetched successfully.", complaints })
    } catch (error) {
        console.error('failed to fetch complaints', error);
        return res.status(500).json({ success: true, message: error.message });
    }
}
const fetchCarComplaintsController = async (req, res) => {
    try {
        const complaints = await carModel.find({}).select("registrationNo chasisNo engineNo brand model lostLocation lostDate complaintDate isVerified")
        return res.status(200).json({ success: true, message: "Complaints fetched successfully.", complaints })
    } catch (error) {
        console.error('failed to fetch complaints', error);
        return res.status(500).json({ success: true, message: error.message });
    }
}
const fetchGoldComplaintsController = async (req, res) => {
    try {
        const complaints = await goldModel.find({}).select("weight lostLocation lostDate complaintDate uniqueFeature isVerified")
        return res.status(200).json({ success: true, message: "Complaints fetched successfully.", complaints })
    } catch (error) {
        console.error('failed to fetch complaints', error);
        return res.status(500).json({ success: true, message: error.message });
    }
}

// updation of status
const updatePhoneStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const complaint = await cellphoneModel.findById(id);
        if (!complaint) {
            return res.status(404).json({ success: false, message: "complaint not found." })
        }
        complaint.isVerified = complaint.isVerified ? false : true
        await complaint.save()
        return res.status(200).json({ success: true, message: `Status updated to ${complaint.isVerified ? 'verified' : 'Not Verified'}` });
    } catch (error) {
        console.error('error in phone status updation', error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
const updateLaptopStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const complaint = await laptopModel.findById(id);
        if (!complaint) {
            return res.status(404).json({ success: false, message: "complaint not found." })
        }
        complaint.isVerified = complaint.isVerified ? false : true
        await complaint.save()
        return res.status(200).json({ success: true, message: `Status updated to ${complaint.isVerified ? 'verified' : 'Not Verified'}` });
    } catch (error) {
        console.error('error in phone status updation', error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
const updateBikeStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const complaint = await bikeModel.findById(id);
        if (!complaint) {
            return res.status(404).json({ success: false, message: "complaint not found." })
        }
        complaint.isVerified = complaint.isVerified ? false : true
        await complaint.save()
        return res.status(200).json({ success: true, message: `Status updated to ${complaint.isVerified ? 'verified' : 'Not Verified'}` });
    } catch (error) {
        console.error('error in phone status updation', error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
const updateCarStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const complaint = await carModel.findById(id);
        if (!complaint) {
            return res.status(404).json({ success: false, message: "complaint not found." })
        }
        complaint.isVerified = complaint.isVerified ? false : true
        await complaint.save()
        return res.status(200).json({ success: true, message: `Status updated to ${complaint.isVerified ? 'verified' : 'Not Verified'}` });
    } catch (error) {
        console.error('error in phone status updation', error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
const updateGoldStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const complaint = await goldModel.findById(id);
        if (!complaint) {
            return res.status(404).json({ success: false, message: "complaint not found." })
        }
        complaint.isVerified = complaint.isVerified ? false : true
        await complaint.save()
        return res.status(200).json({ success: true, message: `Status updated to ${complaint.isVerified ? 'verified' : 'Not Verified'}` });
    } catch (error) {
        console.error('error in phone status updation', error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

// allot and de-allocate complaints
const cellAllocateController = async (req, res) => {
    const { policeId, cellComplaintId } = req.body;

    try {
        const policeRecord = await policeComplaintsModel.findOne({ policeId });

        if (!policeRecord) {
            await policeComplaintsModel.create({
                policeId,
                cellComplaints: [cellComplaintId]
            })
            return res.status(200).json({ success: true, message: "Complaint allocated successfully" });
        }

        const index = policeRecord.cellComplaints.indexOf(cellComplaintId);

        if (index > -1) {
            // Complaint exists — remove it
            policeRecord.cellComplaints.splice(index, 1);
        } else {
            // Complaint not in list — add it
            policeRecord.cellComplaints.push(cellComplaintId);
        }

        await policeRecord.save();

        return res.status(200).json({
            success: true,
            message: index > -1 ? "Complaint deallocated successfully" : "Complaint allocated successfully"
        });

    } catch (error) {
        console.error("Error in altering the allocation", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
const laptopAllocateController = async (req, res) => {
    const { policeId, laptopComplaintId } = req.body;

    try {
        const policeRecord = await policeComplaintsModel.findOne({ policeId });

        if (!policeRecord) {
            await policeComplaintsModel.create({
                policeId,
                laptopComplaints: [laptopComplaintId]
            })
            return res.status(200).json({ success: true, message: 'Complaint allocated successfully' })
        }

        const index = policeRecord.laptopComplaints.indexOf(laptopComplaintId);

        if (index > -1) {
            policeRecord.laptopComplaints.splice(index, 1);
        } else {
            policeRecord.laptopComplaints.push(laptopComplaintId);
        }

        await policeRecord.save();

        return res.status(200).json({
            success: true,
            message: index > -1 ? "Complaint deallocated successfully" : "Complaint allocated successfully"
        });

    } catch (error) {
        console.error("Error in altering the allocation", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
const bikeAllocateController = async (req, res) => {
    const { policeId, bikeComplaintId } = req.body;

    try {
        const policeRecord = await policeComplaintsModel.findOne({ policeId });

        if (!policeRecord) {
            await policeComplaintsModel.create({
                policeId,
                bikeComplaints: [bikeComplaintId]
            })
            return res.status(200).json({ success: true, message: 'Complaint allocated successfully' })
        }

        const index = policeRecord.bikeComplaints.indexOf(bikeComplaintId);

        if (index > -1) {
            policeRecord.bikeComplaints.splice(index, 1);
        } else {
            policeRecord.bikeComplaints.push(bikeComplaintId);
        }

        await policeRecord.save();

        return res.status(200).json({
            success: true,
            message: index > -1 ? "Complaint deallocated successfully" : "Complaint allocated successfully"
        });

    } catch (error) {
        console.error("Error in altering the allocation", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
const carpAllocateController = async (req, res) => {
    const { policeId, carComplaintId } = req.body;

    try {
        const policeRecord = await policeComplaintsModel.findOne({ policeId });

        if (!policeRecord) {
            await policeComplaintsModel.create({
                policeId,
                carComplaints: [carComplaintId]
            })
            return res.status(200).json({ success: true, message: 'Complaint allocated successfully' })
        }

        const index = policeRecord.carComplaints.indexOf(carComplaintId);

        if (index > -1) {
            policeRecord.carComplaints.splice(index, 1);
        } else {
            policeRecord.carComplaints.push(carComplaintId);
        }

        await policeRecord.save();

        return res.status(200).json({
            success: true,
            message: index > -1 ? "Complaint deallocated successfully" : "Complaint allocated successfully"
        });

    } catch (error) {
        console.error("Error in altering the allocation", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
const goldAllocateController = async (req, res) => {
    const { policeId, goldComplaintId } = req.body;

    try {
        const policeRecord = await policeComplaintsModel.findOne({ policeId });

        if (!policeRecord) {
            await policeComplaintsModel.create({
                policeId,
                goldComplaints: [goldComplaintId]
            })
            return res.status(200).json({ success: true, message: "Complaint allocated successfully" });
        }

        const index = policeRecord.goldComplaints.indexOf(goldComplaintId);

        if (index > -1) {
            policeRecord.goldComplaints.splice(index, 1);
        } else {
            policeRecord.goldComplaints.push(goldComplaintId);
        }

        await policeRecord.save();

        return res.status(200).json({
            success: true,
            message: index > -1 ? "Complaint deallocated successfully" : "Complaint allocated successfully"
        });

    } catch (error) {
        console.error("Error in altering the allocation", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// police access controll
const policeAccessController = async (req, res) => {
    try {
        const { id } = req.params;
        const details = await policeModel.findById(id);
        if (!details) {
            return res.status(404).json({ success: false, message: "Police details does't exists." })
        }
        details.hasAccess = details.hasAccess ? false : true;
        await details.save();
        return res.status(200).json({ success: true, message: `Police access ${details.hasAccess ? 'allowed.' : 'declained.'}`, access: details.hasAccess })
    } catch (error) {
        console.error('error in police access', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
const fetchPoliceController = async (req, res) => {
    try {
        const polices = await policeModel.find({}).select("policeId position stationAddress hasAccess")
        return res.status(200).json({ success: true, message: "Police data fetched successfully.", polices });
    } catch (error) {
        console.error('error in fetching police', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}


const totalComplaintsController = async (req, res) => {
    try {
        let totalComplaints = 0;
        totalComplaints += await cellphoneModel.countDocuments();
        totalComplaints += await laptopModel.countDocuments();
        totalComplaints += await bikeModel.countDocuments();
        totalComplaints += await carModel.countDocuments();
        totalComplaints += await goldModel.countDocuments();

        return res.status(200).json({ success: true, totalComplaints })
    } catch (error) {
        console.error('error in fetching total complaints', error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
const activeOfficersController = async (req, res) => {
    try {
        const activeOfficers = await policeModel.countDocuments({ hasAccess: true })
        return res.status(200).json({ success: true, activeOfficers })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
const totalResolvedComplaintsController = async (req, res) => {
    try {
        const allPolice = await resolvedComplaintModel.find({});

        let totalResolved = 0;

        allPolice.forEach(police => {
            totalResolved += (police.cellComplaints?.length || 0);
            totalResolved += (police.laptopComplaints?.length || 0);
            totalResolved += (police.bikeComplaints?.length || 0);
            totalResolved += (police.carComplaints?.length || 0);
            totalResolved += (police.goldComplaints?.length || 0);
        });

        return res.status(200).json({ success: true, totalResolved });

    } catch (error) {
        console.error('Error in fetching total resolved complaints:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
const recentComplaintsController = async (req, res) => {
    try {
        let complaints = []
        const carComplaints = await carModel.find({}).select("lostLocation lostDate complaintDate isVerified").limit(2)
        const bikecomplaints = await bikeModel.find({}).select("lostLocation lostDate complaintDate isVerified").limit(2)
        const phonecomplaints = await cellphoneModel.find({}).select("lostLocation lostDate complaintDate isVerified").limit(2)
        const laptopcomplaints = await laptopModel.find({}).select("lostLocation lostDate complaintDate isVerified").limit(2)
        const goldcomplaints = await goldModel.find({}).select("lostLocation lostDate complaintDate isVerified").limit(2)
        complaints = [...carComplaints, ...bikecomplaints, ...phonecomplaints, ...laptopcomplaints, ...goldcomplaints]
        return res.status(200).json({ success: true, message: 'complaints fetched successfully', complaints })
    } catch (error) {
        console.error('error in fetching recent complaints', error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

const getPhoneComplaintAllocations = async (req, res) => {
    try {
        const result = await policeComplaintsModel.aggregate([
            { $unwind: "$cellComplaints" },
            {
                $group: {
                    _id: "$cellComplaints",
                    policeIds: { $addToSet: "$policeId" }
                }
            },
            {
                $project: {
                    _id: 0,
                    phoneComplaintId: "$_id",
                    policeIds: 1
                }
            }
        ]);

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error fetching phone complaint allocations:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const addSafetyTipsController = async (req, res) => {
    try {
        const { tips } = req.body;
        const existing = await safetyTipsModel.findOne({ tips });
        if (existing) {
            return res.status(400).json({ success: false, message: "Safety tip alredy exists" });
        }
        const newTip = await safetyTipsModel.create({
            tips,
        })
        return res.status(201).json({ success: true, message: "Safety tip add successfully.", newTip });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to add Safety tips." })
    }
}
const addUpdateTipsController = async (req, res) => {
    try {
        const { update } = req.body;
        const existing = await updateTipsModel.findOne({ update });
        if (existing) {
            return res.status(400).json({ success: false, message: "Police update alredy exists" });
        }
        const newUpdate = await updateTipsModel.create({
            update,
        })
        return res.status(201).json({ success: true, message: "Police update added successfully.", newUpdate });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to add Police update." })
    }
}
const updateSafetyTipsController = async (req, res) => {
    const { id } = req.params;
    const { tips } = req.body;
    try {
        const existing = await safetyTipsModel.findById(id);
        if (!existing) {
            return res.status(404).json({ success: false, message: "Safety tips not found." });
        }
        existing.tips = tips;
        await existing.save();
        return res.status(200).json({ success: true, message: "Safety tips updated successfully." })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
const updateUpdateTipsController = async (req, res) => {
    const { id } = req.params;
    const { update } = req.body;
    try {
        const existing = await updateTipsModel.findById(id);
        if (!existing) {
            return res.status(404).json({ success: false, message: "Police Update not found." });
        }
        existing.update = update;
        await existing.save();
        return res.status(200).json({ success: true, message: "Police Update updated successfully." })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
const deleteSafetyTipsController = async (req, res) => {
    try {
        const { id } = req.params;
        await safetyTipsModel.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Safety tip deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
const deleteUpdateTipsController = async (req, res) => {
    try {
        const { id } = req.params;
        await updateTipsModel.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Police update deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    fetchPhoneComplaintsController,
    fetchLaptopComplaintsController,
    fetchBikeComplaintsController,
    fetchCarComplaintsController,
    fetchGoldComplaintsController,
    updatePhoneStatusController,
    updateBikeStatusController,
    updateCarStatusController,
    updateLaptopStatusController,
    updateGoldStatusController,
    cellAllocateController,
    laptopAllocateController,
    bikeAllocateController,
    carpAllocateController,
    goldAllocateController,
    policeAccessController,
    fetchPoliceController,
    totalComplaintsController,
    activeOfficersController,
    totalResolvedComplaintsController,
    recentComplaintsController,
    getPhoneComplaintAllocations,
    addSafetyTipsController,
    addUpdateTipsController,
    updateSafetyTipsController,
    updateUpdateTipsController,
    deleteSafetyTipsController,
    deleteUpdateTipsController,
}