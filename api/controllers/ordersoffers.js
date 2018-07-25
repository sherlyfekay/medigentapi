const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const OrderOffer = require('../models/orderoffer');
const User = require('../models/user');
const Address = require('../models/address');
const Patient = require('../models/patient');
const Agent = require('../models/agent');
const Role = require('../models/role');
const BASE_URL = 'http://localhost:3000/';

exports.oo_get_all = (req, res, next) => {
    OrderOffer.find()
        .select("_id jenis id_user id_patient id_address jk_agen tgl_mulai jns_layanan jml_shift biaya info status created_at id_agent")
        .populate({path: 'id_agent', model: Agent, select: 'nama_lengkap id_role'})
        .populate({path: 'id_patient', model: Patient, select: 'nama_lengkap'})
        //.populate({path: 'id_patient', model: Patient, select: 'nama_lengkap id_user', populate: {path: 'id_user', model: User, select: 'nama_lengkap'}})
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                status: "100",
                ordersoffers: docs.map(doc => {
                    return {
                        _id: doc._id,
                        jenis: doc.jenis,
                        id_user: doc.id_user,
                        id_patient: doc.id_patient,
                        id_address: doc.id_address,
                        jk_agen: doc.jk_agen,
                        tgl_mulai: doc.tgl_mulai,
                        jns_layanan: doc.jns_layanan,
                        jml_shift: doc.jml_shift,
                        biaya: doc.biaya,
                        info: doc.info,
                        status: doc.status,
                        created_at: doc.created_at,
                        id_agent: doc.id_agent
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

exports.oo_create_order = async (req, res, next) =>{
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
        const orderoffer = new OrderOffer({
            _id: new mongoose.Types.ObjectId(),
            jenis: 1,
            id_user: req.body.id_user,
            id_patient: req.body.id_patient,
            id_address: req.body.id_address,
            jk_agen: req.body.jk_agen,
            tgl_mulai: req.body.tgl_mulai,
            jns_layanan: req.body.jns_layanan,
            jml_shift: req.body.jml_shift,
            // biaya: req.body.biaya,
            // info: req.body.info,
            status: req.body.status,
            created_at: req.body.created_at,
            id_agent: req.body.id_agent
        });

        orderoffer
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

exports.oo_create_offer = async (req, res, next) =>{
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
        const orderoffer = new OrderOffer({
            _id: new mongoose.Types.ObjectId(),
            jenis: 2,
            id_user: req.body.id_user,
            id_patient: req.body.id_patient,
            id_address: req.body.id_address,
            jk_agen: req.body.jk_agen,
            tgl_mulai: req.body.tgl_mulai,
            //jns_layanan: req.body.jns_layanan,
            jml_shift: req.body.jml_shift,
            biaya: req.body.biaya,
            info: req.body.info,
            status: req.body.status,
            created_at: req.body.created_at,
            id_agent: req.body.id_agent
        });

        orderoffer
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Offer created successfully',
                    status: '100',
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

exports.oo_get_oo_by_iduser23 = async (req, res, next) => {
    let id = req.params.userId;

    let history = await OrderOffer
    .aggregate([
        {
            $match: {
                id_user: new ObjectId(id),
                //status: { $or: [2, 3]}
                $or: [{status: 2}, {status: 3}]
            }
        },
        {
            $sort: {created_at: -1}
        },
        {
            $lookup: {
                from: 'patients',
                localField: 'id_patient',
                foreignField: '_id',
                as: 'patient'
            }
        },
        {
            $unwind: '$patient'
        },
        {
            $lookup: {
                from: 'agents',
                localField: 'id_agent',
                foreignField: '_id',
                as: 'agent'
            }
        },
        {
            $unwind: '$agent'
        },
        {
            $lookup: {
                from: 'roles',
                localField: 'agent.id_role',
                foreignField: '_id',
                as: 'role'
            }
        },
        {
            $unwind: '$role'
        },
        {
            $lookup: {
                from: 'addresses',
                localField: 'id_address',
                foreignField: '_id',
                as: 'address'
            }
        },
        {
            $unwind: '$address'
        },
        {
            $project: {
                _id: 1,
                status: 1,
                jenis:  {$cond: [{$eq:['$jenis', 1]}, 'Pemesanan', 'Penawaran']},
                nama_pasien: '$patient.nama_lengkap',
                diagnosa: '$patient.diagnosa',
                jml_shift: 1,
                created_at: 1,
                alamat_lengkap: '$address.alamat_lengkap',
                nama_agent: '$agent.nama_lengkap',
                role: '$role.nama_role'
            }
        }
    ]);

    console.log(history);
    res.status(200).json({
        count: history.length,
        status: "200",
        histories: history
    });
};

exports.oo_get_oo_by_iduser14 = async (req, res, next) => {
    let id = req.params.userId;

    let history = await OrderOffer
    .aggregate([
        {
            $match: {
                id_user: new ObjectId(id),
                //status: { $or: [2, 3]}
                $or: [{status: 1}, {status: 4}]
            }
        },
        {
            $sort: {created_at: -1}
        },
        {
            $lookup: {
                from: 'patients',
                localField: 'id_patient',
                foreignField: '_id',
                as: 'patient'
            }
        },
        {
            $unwind: '$patient'
        },
        {
            $lookup: {
                from: 'addresses',
                localField: 'id_address',
                foreignField: '_id',
                as: 'address'
            }
        },
        {
            $unwind: '$address'
        },
        {
            $project: {
                _id: 1,
                status: 1,
                jenis:  {$cond: [{$eq:['$jenis', 1]}, 'Pemesanan', 'Penawaran']},
                nama_pasien: '$patient.nama_lengkap',
                diagnosa: '$patient.diagnosa',
                alamat_lengkap: '$address.alamat_lengkap',
                jml_shift: 1,
                created_at: 1
            }
        }
    ]);

    console.log(history);
    res.status(200).json({
        count: history.length,
        status: "200",
        histories: history
    });
};

exports.oo_get_oo_by_idagent = async (req, res, next) => {
    let id = req.params.agentId;

    let history = await OrderOffer
    .aggregate([
        {
            $match: {
                id_agent: new ObjectId(id)
            }
        },
        {
            $sort: {created_at: -1}
        },
        {
            $lookup: {
                from: 'patients',
                localField: 'id_patient',
                foreignField: '_id',
                as: 'patient'
            }
        },
        {
            $unwind: '$patient'
        },
        {
            $lookup: {
                from: 'addresses',
                localField: 'id_address',
                foreignField: '_id',
                as: 'address'
            }
        },
        {
            $unwind: '$address'
        },
        {
            $project: {
                _id: 1,
                status: 1,
                jenis: {$cond: [{$eq:['$jenis', 1]}, 'Pemesanan', 'Penawaran']},
                nama_pasien: '$patient.nama_lengkap',
                alamat_lengkap: '$address.alamat_lengkap',
                created_at: 1
            }
        }
    ]);

    console.log(history);
    res.status(200).json({
        count: history.length,
        status: "200",
        histories: history
    });
};

exports.oo_get_oo_by_idoo = async (req, res, next) => {
    let id = req.params.ooId;

    let history = await OrderOffer
    .aggregate([
        {
            $match: {
                _id: new ObjectId(id)
            }
        },
        {
            $lookup: {
                from: 'patients',
                localField: 'id_patient',
                foreignField: '_id',
                as: 'patient'
            }
        },
        {
            $unwind: '$patient'
        },
        {
            $lookup: {
                from: 'agents',
                localField: 'id_agent',
                foreignField: '_id',
                as: 'agent'
            }
        },
        {
            $unwind: '$agent'
        },
        {
            $lookup: {
                from: 'roles',
                localField: 'agent.id_role',
                foreignField: '_id',
                as: 'role'
            }
        },
        {
            $unwind: '$role'
        },
        {
            $lookup: {
                from: 'addresses',
                localField: 'id_address',
                foreignField: '_id',
                as: 'address'
            }
        },
        {
            $unwind: '$address'
        },
        {
            $project: {
                _id: 1,
                status: 1,
                jenis: {$cond: [{$eq:['$jenis', 1]}, 'Pemesanan', 'Penawaran']},
                nama_pasien: '$patient.nama_lengkap',
                diagnosa: '$patient.diagnosa',
                jml_shift: 1,
                created_at: 1,
                nama_agent: '$agent.nama_lengkap',
                role: '$role.nama_role',
                lat: '$address.lat',
                lng: '$address.lng'
            }
        }
    ]);

    console.log(history);
    res.status(200).json(history[0]);
};

exports.oo_get_oo_by_idoo2 = async (req, res, next) => {
    let id = req.params.ooId;

    let history = await OrderOffer
    .aggregate([
        {
            $match: {
                _id: new ObjectId(id)
            }
        },
        {
            $lookup: {
                from: 'patients',
                localField: 'id_patient',
                foreignField: '_id',
                as: 'patient'
            }
        },
        {
            $unwind: '$patient'
        },
        {
            $lookup: {
                from: 'addresses',
                localField: 'id_address',
                foreignField: '_id',
                as: 'address'
            }
        },
        {
            $unwind: '$address'
        },
        {
            $project: {
                _id: 1,
                status: 1,
                jenis: {$cond: [{$eq:['$jenis', 1]}, 'Pemesanan', 'Penawaran']},
                nama_pasien: '$patient.nama_lengkap',
                diagnosa: '$patient.diagnosa',
                jml_shift: 1,
                created_at: 1,
                lat: '$address.lat',
                lng: '$address.lng',
                alamat_lengkap: '$address.alamat_lengkap'
            }
        }
    ]);

    console.log(history);
    res.status(200).json(history[0]);
};

exports.oo_get_daftaroo_filter_order = async (req, res, next) => {
    let id = req.params.agentId;

    let history = await OrderOffer
    .aggregate([
        {
            $match: {
               jenis: 1,
               status: 1,
               id_agent: new ObjectId(id)
            }
        },
        {
            $lookup: {
                from: 'patients',
                localField: 'id_patient',
                foreignField: '_id',
                as: 'patient'
            }
        },
        {
            $unwind: '$patient'
        },
        {
            $lookup: {
                from: 'addresses',
                localField: 'id_address',
                foreignField: '_id',
                as: 'address'
            }
        },
        {
            $unwind: '$address'
        },
        {
            $project: {
                _id: 1,
                status: 1,
                jenis: 1,
                nama_pasien: '$patient.nama_lengkap',
                jk: '$patient.jk',
                diagnosa: '$patient.diagnosa',
                alamat: '$address.alamat_lengkap',
                lat: '$address.lat',
                lng: '$address.lng'
            }
        }
    ]);

    console.log(history);
    res.status(200).json({
        count: history.length,
        status: "200",
        histories: history
    });
};

exports.oo_get_daftaroo_filter_offer = async (req, res, next) => {

    let history = await OrderOffer
    .aggregate([
        {
            $match: {
               jenis: 2,
               status: 1
            }
        },
        {
            $lookup: {
                from: 'patients',
                localField: 'id_patient',
                foreignField: '_id',
                as: 'patient'
            }
        },
        {
            $unwind: '$patient'
        },
        {
            $lookup: {
                from: 'addresses',
                localField: 'id_address',
                foreignField: '_id',
                as: 'address'
            }
        },
        {
            $unwind: '$address'
        },
        {
            $project: {
                _id: 1,
                status: 1,
                jenis: 1,
                nama_pasien: '$patient.nama_lengkap',
                jk: '$patient.jk',
                diagnosa: '$patient.diagnosa',
                alamat: '$address.alamat_lengkap',
                lat: '$address.lat',
                lng: '$address.lng'
            }
        }
    ]);

    console.log(history);
    res.status(200).json({
        count: history.length,
        status: "200",
        histories: history
    });
};

exports.oo_get_daftaroo = async (req, res, next) => {
    // let id = req.params.ooId;

    let history = await OrderOffer
    .aggregate([
        {
            $match: {
               $and: [
                   {status: 1},
                   {jenis: 1}
               ]
            }
        },
        {
            $lookup: {
                from: 'patients',
                localField: 'id_patient',
                foreignField: '_id',
                as: 'patient'
            }
        },
        {
            $unwind: '$patient'
        },
        {
            $lookup: {
                from: 'addresses',
                localField: 'id_address',
                foreignField: '_id',
                as: 'address'
            }
        },
        {
            $unwind: '$address'
        },
        {
            $project: {
                _id: 1,
                status: 1,
                jenis: 1,
                nama_pasien: '$patient.nama_lengkap',
                jk: '$patient.jk',
                diagnosa: '$patient.diagnosa',
                alamat: '$address.alamat_lengkap',
                lat: '$address.lat',
                lng: '$address.lng'
            }
        }
    ]);

    console.log(history);
    res.status(200).json({
        count: history.length,
        status: "200",
        orders: history
    });
};

exports.oo_delete_oo = (req, res, next) => {
    const id = req.params.ooId;

    OrderOffer.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'OrderOffer deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

// exports.orders_get_order = (req, res, next) => {
//     const id = req.params.orderId;

//     Order.findById(id)    
//         .populate({path: 'id_user', model: User, select: 'nama_lengkap'})
//         .populate({path: 'id_address', model: Address, select: 'alamat_lengkap'})
//         .populate({path: 'id_patient', model: Patient, select: 'nama_lengkap'})
//         .exec()
//         .then(doc => {
//             if(doc) {
//                 res.status(200).json({
//                     _id: doc._id,
//                     jk_agen: doc.jk_agen,
//                     jns_layanan: doc.jns_layanan,
//                     tgl_mulai: doc.tgl_mulai,
//                     id_user: doc.id_user,
//                     id_address: doc.id_address,
//                     id_patient: doc.id_patient
//                 });
//             }
//             else {
//                 res.status(404).json({
//                     message: 'Pemesanan tidak ditemukan'
//                 });
//             }
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// };

exports.oo_update_status = (req, res, next) => {
    const id = req.params.orderId;
    
    if(req.body.fieldUser === 'status') {
        OrderOffer.updateOne({ _id: id}, { $set: {status: req.body.valueInt}})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Berhasil'
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

exports.oo_update_agent = (req, res, next) => {
    const id = req.params.orderId;

    if(req.body.fieldUser === 'id_agent') {
        OrderOffer.updateOne({ _id: id}, { $set: {id_agent: req.body.valueUser}})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Berhasil'
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
