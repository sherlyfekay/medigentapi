const mongoose = require('mongoose');

const agentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nama_lengkap: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    telepon: { type: String, required: true},
    jk: { type: String, required: true },
    tgl_lahir: { type: String, required: true },
    alamat: { type: String, required: true },
    spesialis: { type: String },
    sertifikat: { type: String, required: true },
    foto: { type: String, required: true },
    id_role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true}
    //rating: { type: String }
});

module.exports = mongoose.model('Agent', agentSchema);