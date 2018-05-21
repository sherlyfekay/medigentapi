const mongoose = require('mongoose');

const Address = require('../models/address');
const User = require('../models/user');
const BASE_URL = 'http://localhost:3000/';

exports.addresses_get_all = (req, res, next) => {
    Address.find()
        .select("_id provinsi kota kecamatan desa alamat_lengkap id_user")
        .populate('id_user', 'nama_lengkap')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                status: 200,
                addresses: docs.map(doc => {
                    return {
                        _id: doc._id,
                        provinsi: doc.provinsi,
                        kota: doc.kota,
                        kecamatan: doc.kecamatan,
                        desa: doc.desa,
                        alamat_lengkap: doc.alamat_lengkap,
                        id_user: doc.id_user
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

exports.addresses_create_address = (req, res, next) =>{
    User.findById(req.body.id_user)
    .then(user => {
        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const address = new Address({
            _id: new mongoose.Types.ObjectId(),
            provinsi: req.body.provinsi,
            kota: req.body.kota,
            kecamatan: req.body.kecamatan,
            desa: req.body.desa,
            alamat_lengkap: req.body.alamat_lengkap,
            id_user: req.body.id_user
        });
    
        return address.save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Address created successfully',
            address: {
                _id: result._id,
                provinsi: result.provinsi,
                kota: result.kota,
                kecamatan: result.kecamatan,
                desa: result.desa,
                alamat_lengkap: result.alamat_lengkap,
                id_user: result.id_user
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });      
};

exports.addresses_get_address = (req, res, next) => {
    const id = req.params.addressId;

    Address.findById(id)
        .populate('id_user', 'nama_lengkap')
        .exec()
        .then(doc => {
            if(doc) {
                res.status(200).json({
                    _id: doc._id,
                    provinsi: doc.provinsi,
                    kota: doc.kota,
                    kecamatan: doc.kecamatan,
                    desa: doc.desa,
                    alamat_lengkap: doc.alamat_lengkap,
                    id_user: doc.id_user
                });
            }
            else {
                res.status(404).json({
                    message: 'Address not found'
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

exports.addresses_get_addresses_by_iduser = (req, res, next) => {
    const id = req.params.userId;

    Address.find()
        .where('id_user').equals(id)
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                status: "200",
                addresses: docs.map(doc => {
                    return {
                        _id: doc._id,
                        provinsi: doc.provinsi,
                        kota: doc.kota,
                        kecamatan: doc.kecamatan,
                        desa: doc.desa,
                        alamat_lengkap: doc.alamat_lengkap,
                        id_user: doc.id_user
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

exports.addresses_update_address = (req, res, next) => {
    const id = req.params.addressId;
    const updateOps = {};

    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Address.update({ _id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Address updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.addresses_delete_address = (req, res, next) => {
    const id = req.params.addressId;

    Address.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Address deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};