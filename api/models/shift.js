const mongoose = require('mongoose');

const shiftSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    tanggal: { type: String, required: true},
    jam: { type: String, required: true},
    tindakan: { type: String },
    kondisi: { type: String },
    id_orderoffer: { type: mongoose.Schema.Types.ObjectId, ref: 'OrderOffer', required: true}
});

module.exports = mongoose.model('Shift', shiftSchema);