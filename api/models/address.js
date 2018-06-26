const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    judul: { type: String, required: true},
    alamat_lengkap: { type: String, required: true },
    tambahan: { type: String },
    lat: { type: Number, required: true},
    lng: { type: Number, required: true },
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Address', addressSchema);