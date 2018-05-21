const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    judul: { type: String, required: true},
    sumber: { type: String, required: true},
    link: { type: String, required: true},
    gambar: { type: String, required: true }
});

module.exports = mongoose.model('Article', articleSchema);