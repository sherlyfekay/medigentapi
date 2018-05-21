const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nama_role: { type: String, required: true},
    desc: { type: String, required: true},
    icon: { type: String, required: true }
});

module.exports = mongoose.model('Role', roleSchema);