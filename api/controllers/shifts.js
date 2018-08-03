const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const Shift = require('../models/shift');
const OrderOffer = require('../models/orderoffer');
const BASE_URL = 'http://localhost:3000/';

exports.shifts_get_all = (req, res, next) => {
    Shift.find()
        .select("_id tanggal jam status tindakan kondisi id_orderoffer")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                status: "200",
                shifts: docs.map(doc => {
                    return {
                        _id: doc._id,
                        tanggal: doc.tanggal,
                        jam: doc.jam,
                        status: doc.status,
                        tindakan: doc.tindakan,
                        kondisi: doc.kondisi,
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

exports.shifts_create_shift = (req, res, next) =>{
    OrderOffer.findById(req.body.id_orderoffer)
    .then(orderoffer => {
        if(!orderoffer) {
            return res.status(404).json({
                message: 'Order or Offer not found'
            });
        }

        const shift = new Shift({
            _id: new mongoose.Types.ObjectId(),
            tanggal: req.body.tanggal,
            jam: req.body.jam,
            status: req.body.status,
            id_orderoffer: req.body.id_orderoffer
        });
    
        return shift.save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Shift created successfully'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });      
};

exports.shifts_get_shift = (req, res, next) => {
    const id = req.params.shiftId;

    Shift.findById(id)
        .exec()
        .then(doc => {
            if(doc) {
                res.status(200).json({
                    _id: doc._id,
                    tanggal: doc.tanggal,
                    jam: doc.jam,
                    status: doc.status,
                    tindakan: doc.tindakan,
                    kondisi: doc.kondisi,
                    id_orderoffer: doc.id_orderoffer
                });
            }
            else {
                res.status(404).json({
                    message: 'Shift not found'
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

exports.shifts_get_shifts_by_idoo = async (req, res, next) => {
    const id = req.params.orderofferId;

    let shift = await Shift
    .aggregate([
        {
            $match: {
               status: 1,
               id_orderoffer: new ObjectId(id)
            }
        },
        {
            $project: {
                _id: 1,
                tanggal: 1,
                jam: 1,
                status: 1,
                tindakan: 1,
                kondisi: 1,
                id_orderoffer: 1
            }
        }
    ]);

    console.log(shift);
    res.status(200).json({
        count: shift.length,
        status: "200",
        shifts: shift
    });

    // Shift.find()
    //     .where('id_orderoffer').equals(id)
    //     .exec()
    //     .then(docs => {
    //         const response = {
    //             count: docs.length,
    //             status: "200",
    //             shifts: docs.map(doc => {
    //                 return {
    //                     _id: doc._id,
    //                     tanggal: doc.tanggal,
    //                     jam: doc.jam,
    //                     status: doc.status,
    //                     tindakan: doc.tindakan,
    //                     kondisi: doc.kondisi,
    //                     id_orderoffer: doc.id_orderoffer
    //                 }
    //             })
    //         };
    //         res.status(200).json(response);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).json({
    //             error: err
    //         });
    //     });
};

exports.shifts_get_shifts_by_idoo2 = async (req, res, next) => {
    const id = req.params.orderofferId;

    let shift = await Shift
    .aggregate([
        {
            $match: {
               status: 0,
               id_orderoffer: new ObjectId(id)
            }
        },
        {
            $project: {
                _id: 1,
                tanggal: 1,
                jam: 1,
                status: 1,
                tindakan: 1,
                kondisi: 1,
                id_orderoffer: 1
            }
        }
    ]);

    console.log(shift);
    res.status(200).json({
        count: shift.length,
        status: "200",
        shifts: shift
    });
};

exports.shifts_update_shift = (req, res, next) => {
    const id = req.params.shiftId;
    const updateOps = {};

    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Shift.update({ _id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Shift updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.shifts_delete_shift = (req, res, next) => {
    const id = req.params.shiftId;

    Shift.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Shift deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};