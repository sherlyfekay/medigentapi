const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nama_lengkap: { type: String, required: true},
    jk: { type: String, required: true },
    tgl_lahir: { type: String, required: true },
    berat: { type: String, required: true},
    tinggi: { type: String, required: true},
    hubungan: { type: String, required: true },
    alat: { type: String, required: true },
    diagnosa: { type: String, required: true },
    kondisi: { type: String, required: true },
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Patient', patientSchema);