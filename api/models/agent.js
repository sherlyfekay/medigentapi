const mongoose = require('mongoose');

const agentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nama_lengkap: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    telepon: { type: String},
    jk: { type: String, required: true },
    tgl_lahir: { type: String},
    biaya: { type: String},
    judul: { type: String},
    alamat_lengkap: { type: String},
    tambahan: { type: String },
    lat: { type: Number},
    lng: { type: Number},
    spesialis: { type: String },
    sertifikat: { type: String, required: true },
    foto: { type: String, required: true },
    status: { type: Number, required: true},
    id_role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true}
    //rating: { type: String }
});

module.exports = mongoose.model('Agent', agentSchema);