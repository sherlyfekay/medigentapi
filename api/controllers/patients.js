const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const Patient = require('../models/patient');
const User = require('../models/user');
const BASE_URL = 'http://localhost:3000/';

exports.patients_get_all = (req, res, next) => {
    Patient.find()
        .select("_id nama_lengkap jk tgl_lahir berat tinggi hubungan alat diagnosa kondisi status id_user")
        .populate('id_user', 'nama_lengkap')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                status: 200,
                patients: docs.map(doc => {
                    return {
                        _id: doc._id,
                        nama_lengkap: doc.nama_lengkap,
                        jk: doc.jk,
                        tgl_lahir: doc.tgl_lahir,
                        berat: doc.berat,
                        tinggi: doc.tinggi,
                        hubungan: doc.hubungan,
                        alat: doc.alat,
                        diagnosa: doc.diagnosa,
                        kondisi: doc.kondisi,
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

exports.patients_create_patient = (req, res, next) =>{
    User.findById(req.body.id_user)
    .then(user => {
        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const patient = new Patient({
            _id: new mongoose.Types.ObjectId(),
            nama_lengkap: req.body.nama_lengkap,
            jk: req.body.jk,
            tgl_lahir: req.body.tgl_lahir,
            berat: req.body.berat,
            tinggi: req.body.tinggi,
            hubungan: req.body.hubungan,
            alat: req.body.alat,
            diagnosa: req.body.diagnosa,
            kondisi: req.body.kondisi,
            status: 1,
            id_user: req.body.id_user
        });

        return patient.save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Patient created successfully',
            status: '100',
            id_patient: result._id
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.patients_get_patient = (req, res, next) => {
    const id = req.params.patientId;

    Patient.findById(id)
        .exec()
        .then(doc => {
            if(doc) {
                res.status(200).json({
                    _id: doc._id,
                    nama_lengkap: doc.nama_lengkap,
                    jk: doc.jk,
                    tgl_lahir: doc.tgl_lahir,
                    berat: doc.berat,
                    tinggi: doc.tinggi,
                    hubungan: doc.hubungan,
                    alat: doc.alat,
                    diagnosa: doc.diagnosa,
                    kondisi: doc.kondisi,
                    status: doc.status,
                    id_user: doc.id_user
                });
            }
            else {
                res.status(404).json({
                    message: 'Patient not found'
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

exports.patients_get_patients_by_iduser = (req, res, next) => {
    const id = req.params.userId;

    Patient.find()
        .where('id_user').equals(id)
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                status: "200",
                patients: docs.map(doc => {
                    return {
                        _id: doc._id,
                        nama_lengkap: doc.nama_lengkap,
                        jk: doc.jk,
                        tgl_lahir: doc.tgl_lahir,
                        berat: doc.berat,
                        tinggi: doc.tinggi,
                        hubungan: doc.hubungan,
                        alat: doc.alat,
                        diagnosa: doc.diagnosa,
                        kondisi: doc.kondisi,
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

exports.patients_get_patients_by_iduser2 = (req, res, next) => {
    let id = req.params.userId;

    let patient = await Patient
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
                nama_lengkap: 1,
                jk: 1,
                tgl_lahir: 1,
                berat: 1,
                tinggi: 1,
                hubungan: 1,
                alat: 1,
                diagnosa: 1,
                kondisi: 1,
                status: 1,
                id_user: 1

            }
        }
    ]);

    console.log(patient);
    res.status(200).json({
        count: patient.length,
        status: "200",
        patients: patient
    });
};

exports.patients_update_status = (req, res, next) => {
    const id = req.params.patientId;

    if(req.body.fieldUser === 'status') {
        Patient.updateOne({ _id: id}, { $set: {status: req.body.valueInt}})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Data pasien berhasil dihapus'
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


exports.patients_update_patient = (req, res, next) => {
    const id = req.params.patientId;
    const updateOps = {};

    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Patient.update({ _id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Patient updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.patients_delete_patient = (req, res, next) => {
    const id = req.params.patientId;

    Patient.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Patient deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};