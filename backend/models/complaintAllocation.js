const mongoose = require('mongoose');

const policeComplaintSchema = new mongoose.Schema({
  policeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'policedetails',
    required: true
  },
  cellComplaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'cellphonecomplaints' }],
  laptopComplaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'laptopcomplaints' }],
  bikeComplaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'bikecomplaints' }],
  carComplaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'carcomplaints' }],
  goldComplaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'goldcomplaints' }]
}, { timestamps: true });

const policeComplaintsModel = mongoose.model('policecomplaints', policeComplaintSchema);

module.exports = policeComplaintsModel;
