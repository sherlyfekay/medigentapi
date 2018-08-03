const mongoose = require('mongoose');

const orderofferSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    jenis: { type: Number, required: true},
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    id_address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true},
    id_patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true},
    id_role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true},
    jk_agen: { type: String, required: true},
    jml_shift: { type: Number, required: true},
    jml_agent: { type: Number, required: true},
    jns_layanan: { type: String},
    biaya: { type: String},
    info: { type: String},
    status: { type: Number, required: true},
    created_at: { type: String, required: true},
    id_agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent'}
});

module.exports = mongoose.model('OrderOffer', orderofferSchema);