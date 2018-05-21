const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    provinsi: { type: String, required: true},
    kota: { type: String, required: true },
    kecamatan: { type: String, required: true },
    desa: { type: String, required: true},
    alamat_lengkap: { type: String, required: true },
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Address', addressSchema);