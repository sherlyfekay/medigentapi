const mongoose = require('mongoose');

const Order = require('../models/order');
const User = require('../models/user');
const Address = require('../models/address');
const Patient = require('../models/patient');
const BASE_URL = 'http://localhost:3000/';

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select("_id jk_agen jns_layanan tgl_mulai id_user id_address id_patient")
        .populate({path: 'id_user', model: User, select: 'nama_lengkap'})
        .populate({path: 'id_address', model: Address, select: 'alamat_lengkap'})
        .populate({path: 'id_patient', model: Patient, select: 'nama_lengkap'})
        //.populate({path: 'id_patient', model: Patient, select: 'nama_lengkap id_user', populate: {path: 'id_user', model: User, select: 'nama_lengkap'}})
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                status: 200,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        jk_agen: doc.jk_agen,
                        jns_layanan: doc.jns_layanan,
                        tgl_mulai: doc.tgl_mulai,
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

exports.orders_create_order = async (req, res, next) =>{
    let checkUser = await User.findById(req.body.id_user);
    let checkAddress = await Address.findById(req.body.id_address);
    let checkPatient = await Patient.findById(req.body.id_patient);

    if(checkUser === null  || checkAddress === null || checkPatient === null) {
        return res.status(201).json({
            message: 'User, Address, or Patient cant be found',
            status: "101"
        });
    }
    else {
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            jk_agen: req.body.jk_agen,
            jns_layanan: req.body.jns_layanan,
            tgl_mulai: req.body.tgl_mulai,
            id_user: req.body.id_user,
            id_address: req.body.id_address,
            id_patient: req.body.id_patient
        });

        order
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Order created successfully',
                    status: '100',
                    id_order: result._id
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

exports.orders_get_order = (req, res, next) => {
    const id = req.params.orderId;

    Order.findById(id)    
        .populate({path: 'id_user', model: User, select: 'nama_lengkap'})
        .populate({path: 'id_address', model: Address, select: 'alamat_lengkap'})
        .populate({path: 'id_patient', model: Patient, select: 'nama_lengkap'})
        .exec()
        .then(doc => {
            if(doc) {
                res.status(200).json({
                    _id: doc._id,
                    jk_agen: doc.jk_agen,
                    jns_layanan: doc.jns_layanan,
                    tgl_mulai: doc.tgl_mulai,
                    id_user: doc.id_user,
                    id_address: doc.id_address,
                    id_patient: doc.id_patient
                });
            }
            else {
                res.status(404).json({
                    message: 'Pemesanan tidak ditemukan'
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

exports.orders_update_order = (req, res, next) => {
    const id = req.params.orderId;
    const updateOps = {};

    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Order.update({ _id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Order updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.orders_delete_order = (req, res, next) => {
    const id = req.params.orderId;

    Order.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};