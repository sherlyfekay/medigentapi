const mongoose = require('mongoose');

const shiftSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    tgl_shift: { type: String, required: true},
    tindakan: { type: String, required: true},
    kondisi: { type: String, required: true },
    id_orderoffer: { type: mongoose.Schema.Types.ObjectId, ref: 'OrderOffer', required: true}
});

module.exports = mongoose.model('Shift', shiftSchema);