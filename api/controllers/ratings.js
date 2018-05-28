const mongoose = require('mongoose');

const Rating = require('../models/rating');
const OrderOffer = require('../models/orderoffer');
const Agent = require('../models/agent');
const BASE_URL = 'http://localhost:3000/';

exports.ratings_get_all = (req, res, next) => {
    Rating.find()
        .select("_id rating tgl komentar id_agent id_orderoffer")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                status: "200",
                ratings: docs.map(doc => {
                    return {
                        _id: doc._id,
                        rating: doc.rating,
                        tgl: doc.tgl,
                        komentar: doc.komentar,
                        id_agent: doc.id_agent,
                        id_orderoffer: doc.id_orderoffer
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

exports.ratings_create_rating = async (req, res, next) =>{

    let checkAgent = await Agent.findById(req.body.id_agent);
    let checkOrderOffer = await OrderOffer.findById(req.body.id_orderoffer);

    if(checkAgent === null  || checkOrderOffer === null) {
        return res.status(201).json({
            message: 'Agent or OrderOffer cant be found',
            status: "101"
        });
    }
    else {
        const rating = new Rating({
            _id: new mongoose.Types.ObjectId(),
            rating: req.body.rating,
            tgl: req.body.tgl,
            komentar: req.body.komentar,
            id_agent: req.body.id_agent,
            id_orderoffer: req.body.id_orderoffer
        });

        rating
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Rating created successfully',
                    status: '100',
                    id_rating: result._id
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    }    
};

exports.ratings_get_rating = (req, res, next) => {
    const id = req.params.ratingId;

    Rating.findById(id)
        .exec()
        .then(doc => {
            if(doc) {
                res.status(200).json({
                    _id: doc._id,
                    rating: doc.rating,
                    tgl: doc.tgl,
                    komentar: doc.komentar,
                    id_agent: doc.id_agent,
                    id_orderoffer: doc.id_orderoffer
                });
            }
            else {
                res.status(404).json({
                    message: 'Rating not found'
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

exports.ratings_get_ratings_by_idagent = (req, res, next) => {
    const id = req.params.agentId;

    Rating.find()
        .where('id_agent').equals(id)
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                status: "200",
                ratings: docs.map(doc => {
                    return {
                        _id: doc._id,
                        rating: doc.rating,
                        tgl: doc.tgl,
                        komentar: doc.komentar,
                        id_agent: doc.id_agent,
                        id_orderoffer: doc.id_orderoffer
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

exports.ratings_update_rating = (req, res, next) => {
    const id = req.params.ratingId;
    const updateOps = {};

    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Rating.update({ _id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Rating updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.ratings_delete_rating = (req, res, next) => {
    const id = req.params.ratingId;

    Rating.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Rating deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};