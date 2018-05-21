const mongoose = require('mongoose');

const History = require('../models/history');
const Order = require('../models/order');
const Offer = require('../models/offer');
const Agent = require('../models/agent');
const BASE_URL = 'http://localhost:3000/';

exports.histories_get_all = (req, res, next) => {
    History.find()
        .select("_id status id_agent id_order id_offer")
        .populate({path: 'id_agent', model: Agent, select: 'nama_lengkap id_role'})
        .populate({path: 'id_order', model: Order, select: 'id_address id_patient'})
        .populate({path: 'id_offer', model: Offer, select: 'id_address id_patient'})
        //.populate({path: 'id_patient', model: Patient, select: 'nama_lengkap id_user', populate: {path: 'id_user', model: User, select: 'nama_lengkap'}})
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                status: 200,
                histories: docs.map(doc => {
                    return {
                        _id: doc._id,
                        status: doc.status,
                        id_agent: doc.id_agent,
                        id_order: doc.id_order,
                        id_offer: doc.id_offer
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.histories_create_history = async (req, res, next) =>{
    let checkAgent = await Agent.findById(req.body.id_agent);
    let checkOrder = await Order.findById(req.body.id_order);
    let checkOffer = await Offer.findById(req.body.id_offer);

    if(checkOrder === null && checkOffer === null) {
        return res.status(404).json({
            message: 'Order and Offer cant be found'
        });
    }
    else {
        if(checkAgent === null) {
            return res.status(404).json({
                message: 'Agent cant be found'
            });
        }
        else {
            const history = new History({
                _id: new mongoose.Types.ObjectId(),
                status: req.body.status,
                id_agent: req.body.id_agent,
                id_order: req.body.id_order,
                id_offer: req.body.id_offer
            });
    
            history
                .save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'History created successfully'
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        }
    }
};

exports.histories_get_history = (req, res, next) => {
    const id = req.params.historyId;

    History.findById(id)    
        .populate({path: 'id_agent', model: Agent, select: 'nama_lengkap'})
        .populate({path: 'id_order', model: Order})
        .populate({path: 'id_offer', model: Offer})
        .exec()
        .then(doc => {
            if(doc) {
                res.status(200).json({
                    _id: doc._id,
                    status: doc.status,
                    id_agent: doc.id_agent,
                    id_order: doc.id_order,
                    id_offer: doc.id_offer
                });
            }
            else {
                res.status(404).json({
                    message: 'History tidak ditemukan'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.histories_get_histories_by_iduser = (req, res, next) => {
    const id = req.params.userId;

    History.find()
        // .where({histories: { 
        //             $or: [
        //                 {id_offer: {id_user: id}}, 
        //                 {id_order: {id_user: id}}
        //             ]
        //         }})    
        // .where({histories: {id_offer: {id_user: id}}}) 
        .where('histories.id_offer').elemMatch({'id_user': id})
        //.populate({path: 'id_agent', model: Agent, select: 'nama_lengkap'})
        //.populate({path: 'id_order', model: Order, match: {id_user: id}})
        //.populate({path: 'id_offer', model: Offer, match: {id_user: id}})
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                status: "200",
                histories: docs.map(doc => {
                    return {
                        _id: doc._id,
                        status: doc.status,
                        id_agent: doc.id_agent,
                        id_order: doc.id_order,
                        id_offer: doc.id_offer
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.histories_update_history = (req, res, next) => {
    const id = req.params.historyId;
    const updateOps = {};

    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    History.update({ _id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'History updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.histories_delete_history = (req, res, next) => {
    const id = req.params.historyId;

    History.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'History deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
