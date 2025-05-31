const aadhaarDetails = require('../models/aadhaarDetails')
const otpModel = require('../models/otp')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const adminModel = require('../models/admin')
const policeModel = require('../models/police')

// admin and public details
const fetchDetailsController = async (req, res) => {
    const { aadhaarNo } = req.params;
    try {
        const { name, dob } = await aadhaarDetails.findOne({ aadhaarNo })
        return res.status(200).json({ success: true, message: "Details fetched successfully.", data: { name, dob } })
    } catch (error) {
        console.error(`Error in fetching details ${str(error)}`)
        return res.status(500).json({ success: false, message: error.message })
    }
}
// police details
const policeDetailsController = async (req, res) => {
    const { policeId } = req.params
    try {
        const police = await policeModel.findOne({ policeId })
        if (!police || !police.hasAccess) {
            return res.status(401).json({ success: false, message: "You have don't have access to the complaints." })
        }
        const { name, dob } = await aadhaarDetails.findOne({ aadhaarNo: police.aadhaarNo })
        return res.status(200).json({ success: true, message: "Details fetched successfully.", data: { name, dob, aadhaarNo: police.aadhaarNo } })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

const generateOTPController = async (req, res) => {
    const { aadhaarNo } = req.params;
    try {
        await otpModel.findOneAndDelete({ aadhaarNo })
        const { email } = await aadhaarDetails.findOne({ aadhaarNo })
        if (!email) {
            return res.status(404).json({ success: false, message: "Aadhaar Number don't exists in the database." })
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("OTP", otp)
        const hashed = bcrypt.hashSync(otp, 10)
        const config = {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        };
        const transporter = nodemailer.createTransport(config);
        const message = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Thefttory Login - OTP Verification',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Thefttory Login Verification</h2>
                    <p>Your one-time password (OTP) for Thefttory login is:</p>
                    <div style="background: #f4f4f4; padding: 10px; margin: 15px 0; 
                        font-size: 24px; font-weight: bold; letter-spacing: 2px; 
                        text-align: center;">
                        ${otp}
                    </div>
                    <p>This OTP is valid for 1 minute only.</p>
                    <p>If you didn't request this OTP, please ignore this email or contact support.</p>
                    <hr>
                    <p style="font-size: 12px; color: #777;">regards, Thefttory Security Team</p>
                </div>
            `,
        };
        await transporter.sendMail(message);
        await otpModel.create({
            aadhaarNo,
            otp: hashed
        })
        return res.status(200).json({ success: true, message: "OTP sent successfully." });
    } catch (error) {
        console.error(`error in sending otp ${error}`)
        return res.status(500).json({ success: false, message: error.message })
    }
}
const verifyOTPController = async (req, res) => {
    const { aadhaarNo, otp } = req.body;
    try {
        const otpData = await otpModel.findOne({ aadhaarNo });
        if (!otpData) {
            return res.status(404).json({ success: false, message: "Generate otp before verification." })
        }
        const isVerified = bcrypt.compareSync(otp, otpData.otp);
        if (!isVerified || Date.now() > otpData.expiresAt.getTime()) {
            return res.status(401).json({ success: false, message: "Invalid or expired OTP." })
        }
        const adminDetails = await adminModel.findOne({ aadhaarNo });
        let isAdmin = false
        if (adminDetails) {
            isAdmin = true
        }
        const token = jwt.sign({ _id: aadhaarNo, isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({ success: true, message: 'OTP verification successful.', token });
    } catch (error) {
        console.error('failed to verify otp', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Admin login and registration
const AdminRegisterController = async (req, res) => {
    const { aadhaarNo, password } = req.body;
    try {
        const existing = await adminModel.findOne({ aadhaarNo });
        if (existing) {
            return res.status(200).json({ success: false, message: 'Already registered.' });
        }
        const hashed = bcrypt.hashSync(password, 10);
        await adminModel.create({
            aadhaarNo,
            password: hashed
        })
        return res.status(201).json({ success: false, message: 'Registration successful.' });
    } catch (error) {
        console.error('failed to register', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
const AdminLoginController = async (req, res) => {
    const { aadhaarNo, password } = req.body;
    try {
        const existing = await adminModel.findOne({ aadhaarNo });
        if (!existing) {
            return res.status(404).json({ success: false, message: "Register before login." });
        }
        const compared = bcrypt.compareSync(password, existing.password);
        if (!compared) {
            return res.status(500).json({ success: false, message: "Invalid credentials." });
        }
        return res.status(200).json({ success: true, message: "Login successful." });
    } catch (error) {
        console.error('Login failed', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    fetchDetailsController,
    generateOTPController,
    verifyOTPController,
    AdminRegisterController,
    AdminLoginController,
    policeDetailsController
}