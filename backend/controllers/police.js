const resolvedComplaintModel = require("../models/resolvedComplaints");
const statusModel = require("../models/status");

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
}

module.exports = { 
    resolveComplaintController,
    changeComplaintStatusController
};