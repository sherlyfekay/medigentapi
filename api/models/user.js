const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nama_lengkap: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    telepon: { type: String, required: true},
    jk: { type: String},
    tgl_lahir: { type: String},
    foto: { type: String}
});

module.exports = mongoose.model('User', userSchema);