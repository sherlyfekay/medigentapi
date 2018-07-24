const mongoose = require('mongoose');

const Address = require('../models/address');
const User = require('../models/user');
const BASE_URL = 'http://localhost:3000/';

exports.addresses_get_all = (req, res, next) => {
    Address.find()
        .select("_id judul alamat_lengkap tambahan lat lng status id_user")
        .populate('id_user', 'nama_lengkap')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                status: 200,
                addresses: docs.map(doc => {
                    return {
                        _id: doc._id,
                        judul: doc.judul,
                        alamat_lengkap: doc.alamat_lengkap,
                        tambahan: doc.tambahan,
                        lat: doc.lat,
                        lng: doc.lng,
                        status: doc.status,
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
            judul: req.body.judul,
            alamat_lengkap: req.body.alamat_lengkap,
            tambahan: req.body.tambahan,
            lat: req.body.lat,
            lng: req.body.lng,
            status: 1,
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
                judul: result.judul,
                alamat_lengkap: result.alamat_lengkap,
                tambahan: result.tambahan,
                lat: result.lat,
                lng: result.lng,
                status: result.status,
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
                    judul: doc.judul,
                    alamat_lengkap: doc.alamat_lengkap,
                    tambahan: doc.tambahan,
                    lat: doc.lat,
                    lng: doc.lng,
                    status: doc.status,
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

exports.addresses_get_addresses_by_iduser2 = async (req, res, next) => {
    let id = req.params.userId;

    let address = await Address
    .aggregate([
        {
            $match: {
                id_user: new ObjectId(id),
                status: 1
                //$or: [{status: 2}, {status: 3}]
            }
        },
        {
            $project: {
                _id: 1,
                judul: 1,
                alamat_lengkap: 1,
                tambahan: 1,
                lat: 1,
                lng: 1,
                status: 1,
                id_user: 1
            }
        }
    ]);

    console.log(address);
    res.status(200).json({
        count: address.length,
        status: "200",
        addresses: address
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
                        judul: doc.judul,
                        alamat_lengkap: doc.alamat_lengkap,
                        tambahan: doc.tambahan,
                        lat: doc.lat,
                        lng: doc.lng,
                        status: doc.status,
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

// exports.addresses_update_address = (req, res, next) => {
//     const id = req.params.addressId;
//     const updateOps = {};

//     for(const ops of req.body) {
//         updateOps[ops.propName] = ops.value;
//     }

//     Address.update({ _id: id}, { $set: updateOps})
//         .exec()
//         .then(result => {
//             console.log(result);
//             res.status(200).json({
//                 message: 'Address updated'
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// };

exports.addresses_update_address = (req, res, next) => {
    const id = req.params.addressId;

    if(req.body.fieldUser === 'tambahan') {
        Address.updateOne({ _id: id}, { $set: {tambahan: req.body.valueUser}})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Update informasi tambahan berhasil'
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