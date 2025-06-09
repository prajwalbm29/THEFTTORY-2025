const policeComplaintsModel = require("../models/complaintAllocation");
const resolvedComplaintModel = require("../models/resolvedComplaints");
const statusModel = require("../models/status");
const mongoose = require('mongoose')
const updateTipsModel = require('../models/updates')

const resolveComplaintController = async (req, res) => {
    const { policeId, complaintId, type } = req.body;

    const complaintFields = {
        phone: 'cellComplaints',
        laptop: 'laptopComplaints',
        bike: 'bikeComplaints',
        car: 'carComplaints',
        gold: 'goldComplaints'
    };

    const field = complaintFields[type];
    if (!field) {
        return res.status(400).json({ success: false, message: "Invalid complaint type" });
    }

    try {
        const policeRecord = await resolvedComplaintModel.findOne({ policeId });
        if (!policeRecord) {
            await resolvedComplaintModel.create({
                policeId,
                [field]: [complaintId]
            });
            return res.status(200).json({ success: true, message: "Complaint resolved successfully." });
        }

        const alreadyResolved = policeRecord[field].includes(complaintId);
        if (alreadyResolved) {
            return res.status(200).json({ success: false, message: "Complaint already resolved." });
        }

        policeRecord[field].push(complaintId);
        await policeRecord.save();

        return res.status(200).json({ success: true, message: "Complaint resolved successfully." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const changeComplaintStatusController = async (req, res) => {
    try {
        const { complaintId, status, description } = req.body
        const complaint = await statusModel.findOne({ complaintId })
        if (!complaint) {
            const newComplaint = await statusModel.create({
                complaintId,
                status: ['Registration', status],
                description: ['Complaint registered successfully.', description]
            })
            newComplaint.status.push(status)
            newComplaint.description.push(description)
            return res.status(200).json({ success: true, message: 'status updated successfully.' })
        }
        complaint.status.push(status)
        complaint.description.push(description)
        await complaint.save()
        return res.status(200).json({ success: true, message: 'status updated successfully.' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
};

const allotedComplaintsController = async (req, res) => {
    try {
        const { policeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(policeId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid policeId.',
            });
        }

        const allotedComplaints = await policeComplaintsModel.findOne({ policeId })
            .populate({
                path: 'cellComplaints',
                select: 'imei brand model complaintDate status isVerified',
            })
            .populate({
                path: 'bikeComplaints',
                select: 'registrationNo brand model complaintDate status isVerified',
            })
            .populate({
                path: 'carComplaints',
                select: 'registrationNo brand model complaintDate status isVerified',
            })
            .populate({
                path: 'laptopComplaints',
                select: 'serialNo brand model lostDate status isVerified',
            })
            // .populate({
            //     path: 'goldComplaints',
            //     select: 'weight uniqueFeature complaintDate status isVerified',
            // })
            .lean();

        if (!allotedComplaints) {
            return res.status(404).json({
                success: false,
                message: 'No complaints allotted to this police officer.',
            });
        }

        // Filter non-null and isVerified complaints
        const filterVerifiedComplaints = (complaints) =>
            complaints ? complaints.filter(comp => comp && comp.isVerified) : [];

        const phone = filterVerifiedComplaints(allotedComplaints.cellComplaints);
        const laptop = filterVerifiedComplaints(allotedComplaints.laptopComplaints);
        const bike = filterVerifiedComplaints(allotedComplaints.bikeComplaints);
        const car = filterVerifiedComplaints(allotedComplaints.carComplaints);
        const gold = filterVerifiedComplaints(allotedComplaints.goldComplaints);

        return res.status(200).json({
            success: true,
            message: 'Verified complaints fetched successfully.',
            data: { phone, laptop, bike, car, gold },
        });

    } catch (error) {
        console.error('Error in alloted-complaints:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.',
            error: error.message,
        });
    }
};

const getResolvedComplaints = async (req, res) => {
    const { policeId } = req.params;

    try {
        const resolved = await resolvedComplaintModel.findOne({ policeId });
        let resolvedComplaints = [];

        resolvedComplaints.push(
            ...resolved.cellComplaints || [],
            ...resolved.laptopComplaints || [],
            ...resolved.bikeComplaints || [],
            ...resolved.carComplaints || [],
            ...resolved.goldComplaints || [],
        );

        return res.status(200).json({ success: true, message: 'Resolved Complaints fetched successfully.', resolvedComplaints });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error?.message });
    }
}

const getUpdatesController = async (req, res) => {
    try {
        const policeUpdates = await updateTipsModel.find({}, "update").sort({ createdAt: -1 })
        return res.status(200).json({ success: true, message: "Police updates fetched successfully", policeUpdates });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = {
    resolveComplaintController,
    changeComplaintStatusController,
    allotedComplaintsController,
    getResolvedComplaints,
    getUpdatesController
};