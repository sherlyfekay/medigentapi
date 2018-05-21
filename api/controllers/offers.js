const mongoose = require('mongoose');

const Offer = require('../models/offer');
const User = require('../models/user');
const Address = require('../models/address');
const Patient = require('../models/patient');
const BASE_URL = 'http://localhost:3000/';

exports.offers_get_all = (req, res, next) => {
    Offer.find()
        .select("_id jk_agen jml_shift tgl_mulai biaya info id_user id_address id_patient")
        .populate({path: 'id_user', model: User, select: 'nama_lengkap'})
        .populate({path: 'id_address', model: Address, select: 'alamat_lengkap'})
        .populate({path: 'id_patient', model: Patient, select: 'nama_lengkap'})
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                status: "100",
                offers: docs.map(doc => {
                    return {
                        _id: doc._id,
                        jk_agen: doc.jk_agen,
                        jml_shift: doc.jml_shift,
                        tgl_mulai: doc.tgl_mulai,
                        biaya: doc.biaya,
                        info: doc.info,
                        id_user: doc.id_user,
                        id_address: doc.id_address,
                        id_patient: doc.id_patient
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

exports.offers_create_offer = async (req, res, next) =>{
    let checkUser = await User.findById(req.body.id_user);
    let checkAddress = await Address.findById(req.body.id_address);
    let checkPatient = await Patient.findById(req.body.id_patient);

    if(checkUser === null || checkAddress === null || checkPatient === null) {
        return res.status(201).json({
            message: 'User, Address, or Patient cant be found',
            status: "101"
        });
    }
    else {
        const offer = new Offer({
            _id: new mongoose.Types.ObjectId(),
            jk_agen: req.body.jk_agen,
            jml_shift: req.body.jml_shift,
            tgl_mulai: req.body.tgl_mulai,
            biaya: req.body.biaya,
            info: req.body.info,
            id_user: req.body.id_user,
            id_address: req.body.id_address,
            id_patient: req.body.id_patient
        });
    
        offer
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Offer created successfully',
                    status: "100",
                    id_offer: result._id
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

exports.offers_get_offer = (req, res, next) => {
    const id = req.params.offerId;

    Offer.findById(id)
        .populate({path: 'id_user', model: User, select: 'nama_lengkap'})
        .populate({path: 'id_address', model: Address, select: 'alamat_lengkap'})
        .populate({path: 'id_patient', model: Patient, select: 'nama_lengkap'})
        .exec()
        .then(doc => {
            if(doc) {
                res.status(200).json({
                    _id: doc._id,
                    jk_agen: doc.jk_agen,
                    jml_shift: doc.jml_shift,
                    tgl_mulai: doc.tgl_mulai,
                    biaya: doc.biaya,
                    info: doc.info,
                    id_user: doc.id_user,
                    id_address: doc.id_address,
                    id_patient: doc.id_patient
                });
            }
            else {
                res.status(404).json({
                    message: 'Penawaran tidak ditemukan'
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

exports.offers_update_offer = (req, res, next) => {
    const id = req.params.offerId;
    const updateOps = {};

    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Offer.update({ _id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Offer updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.offers_delete_offer = (req, res, next) => {
    const id = req.params.offerId;

    Offer.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Offer deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};