const cellphoneModel = require("../models/cellphone");
const laptopModel = require('../models/laptop');
const bikeModel = require('../models/bike');
const carModel = require('../models/car');
const goldModel = require('../models/gold');
const aadhaarDetails = require('../models/aadhaarDetails');
const nodemailer = require('nodemailer');
const policeModel = require("../models/police");
const resolvedComplaintModel = require("../models/resolvedComplaints");
const statusModel = require("../models/status");

const sendUpdateMailController = async (req, res) => {
    try {
        const { complaintId, status, description, type } = req.body
        let userEmail = ''
        let userName = ''
        let brand_ = ''
        let model_ = ''

        switch (type) {
            case 'phone':
                try {
                    const { aadhaarNo, brand, model } = await cellphoneModel.findById(complaintId);
                    if (!aadhaarNo) {
                        return res.status(404).json({ success: false, message: 'Complaint Not Found.' })
                    }
                    const { email, name } = await aadhaarDetails.findOne({ aadhaarNo });
                    userEmail = email
                    userName = name
                    brand_ = brand
                    model_ = model
                    break
                } catch (error) {
                    console.error(error)
                    return res.status(500).json({ success: false, message: error.message })
                }
            case 'laptop':
                try {
                    const { aadhaarNo, model, brand } = await laptopModel.findById(complaintId);
                    if (!aadhaarNo) {
                        return res.status(404).json({ success: false, message: 'Complaint Not Found.' })
                    }
                    const { email, name } = await aadhaarDetails.findOne({ aadhaarNo });
                    userEmail = email
                    userName = name
                    model_ = model
                    brand_ = brand
                    break
                } catch (error) {
                    console.error(error)
                    return res.status(500).json({ success: false, message: error.message })
                }
            case 'bike':
                try {
                    const { aadhaarNo, brand, model } = await bikeModel.findById(complaintId);
                    if (!aadhaarNo) {
                        return res.status(404).json({ success: false, message: 'Complaint Not Found.' })
                    }
                    const { email, name } = await aadhaarDetails.findOne({ aadhaarNo });
                    userEmail = email
                    userName = name
                    brand_ = brand
                    model_ = model
                    break
                } catch (error) {
                    console.error(error)
                    return res.status(500).json({ success: false, message: error.message })
                }
            case 'car':
                try {
                    const { aadhaarNo, brand, model } = await carModel.findById(complaintId);
                    if (!aadhaarNo) {
                        return res.status(404).json({ success: false, message: 'Complaint Not Found.' })
                    }
                    const { email, name } = await aadhaarDetails.findOne({ aadhaarNo });
                    userEmail = email
                    userName = name
                    brand_ = brand
                    model_ = model
                    break
                } catch (error) {
                    console.error(error)
                    return res.status(500).json({ success: false, message: error.message })
                }
            default:
                try {
                    const { aadhaarNo, weight } = await goldModel.findById(complaintId);
                    if (!aadhaarNo) {
                        return res.status(404).json({ success: false, message: 'Complaint Not Found.' })
                    }
                    const { email, name } = await aadhaarDetails.findOne({ aadhaarNo });
                    userEmail = email
                    userName = name
                    brand_ = `${weight} grams`
                    model_ = 'gold'
                    break
                } catch (error) {
                    console.error(error)
                    return res.status(500).json({ success: false, message: error.message })
                }
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        // Email content
        const message = {
            from: process.env.EMAIL,
            to: userEmail,
            subject: `Complaint Status Update - ${complaintId}`,
            html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
                <div style="background: #1e90ff; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Complaint Registered</h1>
                </div>
                
                <div style="padding: 20px;">
                <p><strong>Dear ${userName},</strong></p>

                <p>Your complaint status regarding your <strong>${brand_} ${model_}</strong> 
                 has been updated successfully with the following details:</p>
                
                <div style="background: #f8f9fa; border-left: 4px solid #1e90ff; padding: 15px; margin: 15px 0;">
                    <p><strong>Complaint ID:</strong> ${complaintId}</p>
                    <p><strong>Updated Status:</strong> ${status}</p>
                    <p><strong>Updated Description:</strong> ${description}</p>
                </div>

                <p>You can track the status of your complaint through our mobile application at any time.</p>

                <p>Our team will review your complaint and update you on any developments.</p>

                <p style="margin-top: 30px;">Best regards,<br/>
                <strong>The Thefttory Team</strong></p>
                </div>
                
                <div style="background: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #666;">
                <p>This is an automated message. Please do not reply directly to this email.</p>
                </div>
            </div>
            `
        };
        await transporter.sendMail(message);
        return res.status(200).json({ success: true, message: 'Notification sent successfully.' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

const cellComplaintController = async (req, res) => {
    try {
        const { complaintDetails } = req.body
        const existingComplaint = await cellphoneModel.findOne({ imei: complaintDetails.imei })
        if (existingComplaint) {
            return res.status(200).json({ success: false, message: "Complaint already registered." })
        }
        const details = await aadhaarDetails.findOne({ aadhaarNo: complaintDetails.aadhaarNo })
        if (!details) {
            return res.status(404).json({ success: false, message: "Aadhaar number does not exist in database." })
        }
        const complaint = await cellphoneModel.create(complaintDetails)
        return res.status(200).json({ success: true, message: "Complaint registered successfully.", complaintId: complaint._id })
    } catch (error) {
        console.error('complaint registration failed', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
const laptopComplaintController = async (req, res) => {
    try {
        const { complaintDetails } = req.body
        const existingComplaint = await laptopModel.findOne({ serialNo: complaintDetails.serialNo })
        if (existingComplaint) {
            return res.status(200).json({ success: false, message: "Complaint already registered." })
        }
        const details = await aadhaarDetails.findOne({ aadhaarNo: complaintDetails.aadhaarNo })
        if (!details) {
            return res.status(404).json({ success: false, message: "Aadhaar number does not exist in database." })
        }
        const complaint = await laptopModel.create(complaintDetails)
        return res.status(200).json({ success: true, message: "Complaint registered successfully.", complaintId: complaint._id })
    } catch (error) {
        console.error('complaint registration failed', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
const bikeComplaintController = async (req, res) => {
    try {
        const complaintDetails = req.body
        const existingComplaint = await bikeModel.findOne({
            $or: [
                { registrationNo: complaintDetails.registrationNo },
                { chasisNo: complaintDetails.chasisNo },
                { engineNo: complaintDetails.engineNo }
            ]
        });
        if (existingComplaint) {
            return res.status(200).json({ success: false, message: "Complaint already registered." })
        }
        const details = await aadhaarDetails.findOne({ aadhaarNo: complaintDetails.aadhaarNo })
        if (!details) {
            console.log('AahaarNo',complaintDetails.aadhaarNo)
            return res.status(404).json({ success: false, message: "Aadhaar number does not exist in database." })
        }
        const complaint = await bikeModel.create(complaintDetails)
        return res.status(200).json({ success: true, message: "Complaint registered successfully.", complaintId: complaint._idF })
    } catch (error) {
        console.error('complaint registration failed', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
const carComplaintController = async (req, res) => {
    try {
        const { complaintDetails } = req.body
        const existingComplaint = await bikeModel.findOne({
            $or: [
                { registrationNo: complaintDetails.registrationNo },
                { chasisNo: complaintDetails.chasisNo },
                { engineNo: complaintDetails.engineNo }
            ]
        });
        if (existingComplaint) {
            return res.status(200).json({ success: false, message: "Complaint already registered." })
        }
        const details = await aadhaarDetails.findOne({ aadhaarNo: complaintDetails.aadhaarNo })
        if (!details) {
            return res.status(404).json({ success: false, message: "Aadhaar number does not exist in database." })
        }
        const complaint = await carModel.create(complaintDetails)
        return res.status(200).json({ success: true, message: "Complaint registered successfully.", complaintId: complaint._id })
    } catch (error) {
        console.error('complaint registration failed', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
const goldComplaintController = async (req, res) => {
    try {
        const { complaintDetails } = req.body
        const existingComplaint = await goldModel.findOne({ aadhaarNo: complaintDetails.aadhaarNo })
        if (existingComplaint) {
            return res.status(200).json({ success: false, message: "Complaint already registered." })
        }
        const details = await aadhaarDetails.findOne({ aadhaarNo: complaintDetails.aadhaarNo })
        if (!details) {
            return res.status(404).json({ success: false, message: "Aadhaar number does not exist in database." })
        }
        const complaint = await goldModel.create(complaintDetails)
        return res.status(200).json({ success: true, message: "Complaint registered successfully.", complaintId: complaint._id })
    } catch (error) {
        console.error('complaint registration failed', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
const getCountController = async (req, res) => {
    try {
        const type = req.params.type;

        const models = {
            phone: cellphoneModel,
            laptop: laptopModel,
            bike: bikeModel,
            car: carModel,
            gold: goldModel
        };

        const model = models[type];

        if (!model) {
            return res.status(400).json({ success: false, message: 'Invalid type parameter' });
        }

        const count = await model.countDocuments();
        return res.status(200).json({ success: true, count });

    } catch (error) {
        console.error('Error in getCountController:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
const getResolvedComplaints = async (req, res) => {
    try {
        const allPolice = await resolvedComplaintModel.find({});
        let resolvedComplaints = [];

        allPolice.forEach(police => {
            resolvedComplaints.push(
                ...police.cellComplaints || [],
                ...police.laptopComplaints || [],
                ...police.bikeComplaints || [],
                ...police.carComplaints || [],
                ...police.goldComplaints || []
            );
        });

        return res.status(200).json({
            success: true,
            message: 'Complaints fetched successfully',
            resolvedComplaints
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// access status
const complaintStatusController = async (req, res) => {
    try {
        const { complaintId } = req.params
        const complaint = await statusModel.findOne({ complaintId })
        if (!complaint) {
            return res.status(404).json({ success: false, message: 'complaint not found.' })
        }
        return res.status(200).json({ success: true, message: 'complaint status fetched successfully.', complaint })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

// details about one
const phoneDetailsController = async (req, res) => {
    try {
        const { id } = req.params
        const phone = await cellphoneModel.findById(id).select('isVerified imei brand model lostLocation lostDescription lostDate complaintDate')
        if (!phone) {
            return res.status(404).json({ success: false, message: 'Phone details not found.' })
        }
        return res.status(200).json({ success: true, message: 'Details fetched successfully.', phone })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
const laptopDetailsController = async (req, res) => {
    try {
        const { id } = req.params
        const laptop = await laptopModel.findById(id).select('isVerified serialNo brand model lostLocation lostDescription lostDate complaintDate')
        if (!laptop) {
            return res.status(404).json({ success: false, message: 'Laptop details not found.' })
        }
        return res.status(200).json({ success: true, message: 'Details fetched successfully.', laptop })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
const bikeDetailsController = async (req, res) => {
    try {
        const { id } = req.params
        const bike = await bikeModel.findById(id).select('isVerified registrationNo chasisNo engineNo brand model color description lostLocation lostDescription lostDate complaintDate')
        if (!bike) {
            return res.status(404).json({ success: false, message: 'Bike details not found.' })
        }
        return res.status(200).json({ success: true, message: 'Details fetched successfully.', bike })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
const carDetailsController = async (req, res) => {
    try {
        const { id } = req.params
        const car = await carModel.findById(id).select('isVerified registrationNo chasisNo engineNo brand model color description lostLocation lostDescription lostDate complaintDate')
        if (!car) {
            return res.status(404).json({ success: false, message: 'Car details not found.' })
        }
        return res.status(200).json({ success: true, message: 'Details fetched successfully.', car })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
const goldDetailsController = async (req, res) => {
    try {
        const { id } = req.params
        const gold = await goldModel.findById(id).select('isVerified weight lostLocation lostDescription lostDate complaintDate uniqueFeature witness')
        if (!gold) {
            return res.status(404).json({ success: false, message: 'gold details not found.' })
        }
        return res.status(200).json({ success: true, message: 'Details fetched successfully.', gold })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

// invoice
const phoneInvoiceController = async (req, res) => {
    try {
        const { id } = req.params
        const { invoice } = await cellphoneModel.findById(id).select('invoice')
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found.' })
        }
        return res.status(200).json({ success: true, invoice })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
const laptopInvoiceController = async (req, res) => {
    try {
        const { id } = req.params
        const { invoice } = await laptopModel.findById(id).select('invoice')
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found.' })
        }
        return res.status(200).json({ success: true, invoice })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}
const goldPhotoController = async (req, res) => {
    try {
        const { id } = req.params
        const { photo } = await goldModel.findById(id).select('photo')
        if (!photo) {
            return res.status(404).json({ success: false, message: 'Photo not found.' })
        }
        return res.status(200).json({ success: true, photo })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}


module.exports = {
    cellComplaintController,
    laptopComplaintController,
    bikeComplaintController,
    carComplaintController,
    goldComplaintController,
    getCountController,
    getResolvedComplaints,
    phoneDetailsController,
    complaintStatusController,
    laptopDetailsController,
    bikeDetailsController,
    carDetailsController,
    goldDetailsController,
    phoneInvoiceController,
    laptopInvoiceController,
    goldPhotoController,
    sendUpdateMailController
}