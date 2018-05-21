const mongoose = require('mongoose');

const historySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    status: { type: Number, required: true},
    id_agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true},
    //id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    id_order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order'},
    id_offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer'}
});

module.exports = mongoose.model('History', historySchema);