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
const nodemailer = require('nodemailer');
const aadhaarDetails = require("../models/aadhaarDetails");

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
    const { policeId, complaintId } = req.body;

    try {
        const policeRecord = await policeComplaintsModel.findOne({ policeId });

        if (!policeRecord) {
            await policeComplaintsModel.create({
                policeId,
                cellComplaints: [complaintId]
            })
            return res.status(200).json({ success: true, message: "Complaint allocated successfully" });
        }

        const index = policeRecord.cellComplaints.indexOf(complaintId);

        if (index > -1) {
            // Complaint exists — remove it
            policeRecord.cellComplaints.splice(index, 1);
        } else {
            // Complaint not in list — add it
            policeRecord.cellComplaints.push(complaintId);
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
    const { policeId, complaintId } = req.body;

    try {
        const policeRecord = await policeComplaintsModel.findOne({ policeId });

        if (!policeRecord) {
            await policeComplaintsModel.create({
                policeId,
                laptopComplaints: [complaintId]
            })
            return res.status(200).json({ success: true, message: 'Complaint allocated successfully' })
        }

        const index = policeRecord.laptopComplaints.indexOf(complaintId);

        if (index > -1) {
            policeRecord.laptopComplaints.splice(index, 1);
        } else {
            policeRecord.laptopComplaints.push(complaintId);
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
    const { policeId, complaintId } = req.body;

    try {
        const policeRecord = await policeComplaintsModel.findOne({ policeId });

        if (!policeRecord) {
            await policeComplaintsModel.create({
                policeId,
                bikeComplaints: [complaintId]
            })
            return res.status(200).json({ success: true, message: 'Complaint allocated successfully' })
        }

        const index = policeRecord.bikeComplaints.indexOf(complaintId);

        if (index > -1) {
            policeRecord.bikeComplaints.splice(index, 1);
        } else {
            policeRecord.bikeComplaints.push(complaintId);
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
    const { policeId, complaintId } = req.body;

    try {
        const policeRecord = await policeComplaintsModel.findOne({ policeId });

        if (!policeRecord) {
            await policeComplaintsModel.create({
                policeId,
                carComplaints: [complaintId]
            })
            return res.status(200).json({ success: true, message: 'Complaint allocated successfully' })
        }

        const index = policeRecord.carComplaints.indexOf(complaintId);

        if (index > -1) {
            policeRecord.carComplaints.splice(index, 1);
        } else {
            policeRecord.carComplaints.push(complaintId);
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
    const { policeId, complaintId } = req.body;

    try {
        const policeRecord = await policeComplaintsModel.findOne({ policeId });

        if (!policeRecord) {
            await policeComplaintsModel.create({
                policeId,
                goldComplaints: [complaintId]
            })
            return res.status(200).json({ success: true, message: "Complaint allocated successfully" });
        }

        const index = policeRecord.goldComplaints.indexOf(complaintId);

        if (index > -1) {
            policeRecord.goldComplaints.splice(index, 1);
        } else {
            policeRecord.goldComplaints.push(complaintId);
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
const getLaptopComplaintAllocations = async (req, res) => {
    try {
        const result = await policeComplaintsModel.aggregate([
            { $unwind: "$laptopComplaints" },
            {
                $group: {
                    _id: "$laptopComplaints",
                    policeIds: { $addToSet: "$policeId" }
                }
            },
            {
                $project: {
                    _id: 0,
                    laptopComplaintId: "$_id",
                    policeIds: 1
                }
            }
        ]);

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error fetching laptopo complaint allocations:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
const getBikeComplaintAllocations = async (req, res) => {
    try {
        const result = await policeComplaintsModel.aggregate([
            { $unwind: "$bikeComplaints" },
            {
                $group: {
                    _id: "$bikeComplaints",
                    policeIds: { $addToSet: "$policeId" }
                }
            },
            {
                $project: {
                    _id: 0,
                    bikeComplaintId: "$_id",
                    policeIds: 1
                }
            }
        ]);

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error fetching bike complaint allocations:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
const getCarComplaintAllocations = async (req, res) => {
    try {
        const result = await policeComplaintsModel.aggregate([
            { $unwind: "$carComplaints" },
            {
                $group: {
                    _id: "$carComplaints",
                    policeIds: { $addToSet: "$policeId" }
                }
            },
            {
                $project: {
                    _id: 0,
                    carComplaintId: "$_id",
                    policeIds: 1
                }
            }
        ]);

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error fetching bike complaint allocations:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
const getGoldComplaintAllocations = async (req, res) => {
    try {
        const result = await policeComplaintsModel.aggregate([
            { $unwind: "$goldComplaints" },
            {
                $group: {
                    _id: "$goldComplaints",
                    policeIds: { $addToSet: "$policeId" }
                }
            },
            {
                $project: {
                    _id: 0,
                    goldComplaintId: "$_id",
                    policeIds: 1
                }
            }
        ]);

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error fetching bike complaint allocations:", error);
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


// Resolved Complaints
const resolvedComplaintCountController = async (req, res) => {
    try {
        const allResolvedDocuments = await resolvedComplaintModel.find();

        let phoneCnt = 0;
        let laptopCnt = 0;
        let bikeCnt = 0;
        let carCnt = 0;
        let goldCnt = 0;

        allResolvedDocuments.forEach(doc => {
            phoneCnt += doc.cellComplaints ? doc.cellComplaints.length : 0;
            laptopCnt += doc.laptopComplaints ? doc.laptopComplaints.length : 0;
            bikeCnt += doc.bikeComplaints ? doc.bikeComplaints.length : 0;
            carCnt += doc.carComplaints ? doc.carComplaints.length : 0;
            goldCnt += doc.goldComplaints ? doc.goldComplaints.length : 0;
        });

        return res.status(200).json({
            success: true,
            message: "Resolved count fetched",
            phone: phoneCnt,
            laptop: laptopCnt,
            bike: bikeCnt,
            car: carCnt,
            gold: goldCnt
        });
    } catch (error) {
        console.error("Error fetching resolved complaint counts:", error); // Use console.error for errors
        return res.status(500).json({ success: false, message: "Internal server error: " + error.message });
    }
}

const resolvedPhoneComplaintController = async (req, res) => {
    try {
        const allResolvedDocuments = await resolvedComplaintModel.find({});

        let allComplaintIds = [];

        allResolvedDocuments.forEach(doc => {
            if (doc.cellComplaints && doc.cellComplaints.length > 0) {
                allComplaintIds = allComplaintIds.concat(doc.cellComplaints);
            }
        });

        if (allComplaintIds.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No resolved phone complaints found.",
                complaints: []
            });
        }

        const complaints = await cellphoneModel.find({ _id: { $in: [...allComplaintIds] } }).select("imei brand model lostLocation lostDate complaintDate isVerified")

        return res.status(200).json({
            success: true,
            message: "Resolved phone complaints fetched successfully.",
            complaints
        });

    } catch (error) {
        console.error("Error fetching resolved phone complaints:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
const resolvedLaptopComplaintController = async (req, res) => {
    try {
        const allResolvedDocuments = await resolvedComplaintModel.find({});

        let allComplaintIds = [];

        allResolvedDocuments.forEach(doc => {
            if (doc.laptopComplaints && doc.laptopComplaints.length > 0) {
                allComplaintIds = allComplaintIds.concat(doc.laptopComplaints);
            }
        });

        if (allComplaintIds.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No resolved Laptop complaints found.",
                complaints: []
            });
        }

        const complaints = await laptopModel.find({ _id: { $in: [...allComplaintIds] } }).select("serialNo brand model lostLocation lostDate complaintDate isVerified");

        return res.status(200).json({
            success: true,
            message: "Resolved laptop complaints fetched successfully.",
            complaints
        });

    } catch (error) {
        console.error("Error fetching resolved laptop complaints:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
const resolvedBikeComplaintController = async (req, res) => {
    try {
        const allResolvedDocuments = await resolvedComplaintModel.find({});

        let allComplaintIds = [];

        allResolvedDocuments.forEach(doc => {
            if (doc.bikeComplaints && doc.bikeComplaints.length > 0) {
                allComplaintIds = allComplaintIds.concat(doc.bikeComplaints);
            }
        });

        if (allComplaintIds.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No resolved bike complaints found.",
                complaints: []
            });
        }

        const complaints = await bikeModel.find({ _id: { $in: [...allComplaintIds] } }).select("registrationNo chasisNo engineNo brand model lostLocation lostDate complaintDate isVerified");

        return res.status(200).json({
            success: true,
            message: "Resolved bike complaints fetched successfully.",
            complaints
        });

    } catch (error) {
        console.error("Error fetching resolved bike complaint IDs:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
const resolvedCarComplaintController = async (req, res) => {
    try {
        const allResolvedDocuments = await resolvedComplaintModel.find({});

        let allComplaintIds = [];

        allResolvedDocuments.forEach(doc => {
            if (doc.carComplaints && doc.carComplaints.length > 0) {
                allComplaintIds = allComplaintIds.concat(doc.carComplaints);
            }
        });

        if (allComplaintIds.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No resolved car complaints found.",
                complaints: []
            });
        }

        const complaints = await carModel.find({ _id: { $in: [...allComplaintIds] } }).select("registrationNo chasisNo engineNo brand model lostLocation lostDate complaintDate isVerified");

        return res.status(200).json({
            success: true,
            message: "Resolved car complaints fetched successfully.",
            complaints
        });

    } catch (error) {
        console.error("Error fetching resolved car complaint IDs:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
const resolvedGoldComplaintController = async (req, res) => {
    try {
        const allResolvedDocuments = await resolvedComplaintModel.find({});

        let allComplaintIds = [];

        allResolvedDocuments.forEach(doc => {
            if (doc.goldComplaints && doc.goldComplaints.length > 0) {
                allComplaintIds = allComplaintIds.concat(doc.goldComplaints);
            }
        });

        if (allComplaintIds.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No resolved gold complaints found.",
                complaints: []
            });
        }

        const complaints = await goldModel.find({ _id: { $in: [...allComplaintIds] } }).select("weight lostLocation lostDate complaintDate uniqueFeature isVerified");

        return res.status(200).json({
            success: true,
            message: "Resolved gold complaints fetched successfully.",
            complaints
        });

    } catch (error) {
        console.error("Error fetching resolved gold complaint IDs:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Send mail
const sendNotificationMailController = async (req, res) => {
    try {
        const { title, description, id, type } = req.body;

        if (!title || !description || !id || !type) {
            return res.status(400).json({ success: false, message: "Missing required fields: title, description, id, or type." });
        }

        let model;
        switch (type) {
            case 'phone':
                model = cellphoneModel;
                break;
            case 'laptop':
                model = laptopModel;
                break;
            case 'bike':
                model = bikeModel;
                break;
            case 'car':
                model = carModel;
                break;
            case 'gold':
                model = goldModel;
                break;
            default:
                return res.status(400).json({ success: false, message: "Invalid 'type' provided. Supported types are 'phone', 'laptop', 'bike', 'car', 'gold'." });
        }

        const complaint = await model.findById(id);
        if (!complaint || !complaint.aadhaarNo) {
            return res.status(404).json({ success: false, message: `Complaint of type '${type}' with ID '${id}' not found or Aadhar number is missing.` });
        }

        const { aadhaarNo } = complaint;

        const userDetails = await aadhaarDetails.findOne({ aadhaarNo });
        if (!userDetails || !userDetails.email) {
            return res.status(404).json({ success: false, message: `User email not found for Aadhar number: ${aadhaarNo}.` });
        }

        const { email, name } = userDetails;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        // Enhanced HTML Email Template
        const htmlContent = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; background-color: #f9f9f9; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <h1 style="margin: 0; font-size: 24px;">${title}</h1>
                </div>
                <div style="padding: 20px 30px; color: #333333;">
                    <p style="font-size: 16px; line-height: 1.8;">Dear ${name.toUpperCase()},</p>
                    <p style="font-size: 16px; line-height: 1.8;">${description}</p>
                    <p style="font-size: 14px; color: #555;">
                        This notification is related to your complaint of type **${type}** with ID: **${id}**.
                    </p>
                    <p style="font-size: 14px; color: #777;">
                        Thank you for your patience.
                    </p>
                </div>
                <div style="background-color: #eeeeee; padding: 15px; text-align: center; font-size: 12px; color: #777777; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} THEFTTORY. All rights reserved.</p>
                    <p style="margin: 5px 0 0;">If you have any questions, please contact our support team.</p>
                </div>
            </div>
        `;

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: title,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: "Notification email sent successfully!" });

    } catch (error) {
        console.error("Error sending notification email:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    sendNotificationMailController,
    getGoldComplaintAllocations,
    getCarComplaintAllocations,
    getBikeComplaintAllocations,
    getLaptopComplaintAllocations,
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
    resolvedComplaintCountController,
    resolvedPhoneComplaintController,
    resolvedLaptopComplaintController,
    resolvedBikeComplaintController,
    resolvedCarComplaintController,
    resolvedGoldComplaintController
}