const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    rating: { type: Number, required: true},
    tgl: { type: String, required: true},
    komentar: { type: String },
    id_agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true},
    id_orderoffer: { type: mongoose.Schema.Types.ObjectId, ref: 'OrderOffer', required: true}
});

module.exports = mongoose.model('Rating', ratingSchema);