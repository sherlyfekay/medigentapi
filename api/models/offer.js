const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    jk_agen: { type: String, required: true},
    jml_shift: { type: Number, required: true},
    tgl_mulai: { type: String, required: true},
    biaya: { type: String, required: true},
    info: { type: String, required: true },
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    id_address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true},
    id_patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true}
});

module.exports = mongoose.model('Offer', offerSchema);