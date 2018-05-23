const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BASE_URL = 'http://localhost:3000/';

exports.users_signup = (req, res, next) =>{
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if(user.length >= 1) {
            return res.status(200).json({
                message: 'Email already exist',
                status: '101'
            });
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    res.status(500).json({
                        error: err
                    });
                }
                else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        nama_lengkap: req.body.nama_lengkap,
                        email: req.body.email,
                        password: hash,
                        telepon: req.body.telepon,
                        // jk: req.body.jk,
                        // tgl_lahir: req.body.tgl_lahir,
                        // foto: BASE_URL + 'uploads/' + req.file.filename
                    });
                
                    user
                        .save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'User created successfully',
                                status: '100',
                                id_new_user: result._id
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            });
        }
    });
};

exports.users_login = (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if(user.length < 1) {
            return res.status(200).json({
                message: 'Email doesnt exist',
                status: "101",
                token: "null",
                id_user: "null"
            });
        }
        
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Auth failed',
                    status: "103",
                    token: "null",
                    id_user: "null"
                });
            }
            if(result) {
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    'sherlycantik',
                    {
                    }
                );
                return res.status(200).json({
                    message: 'Auth successful',
                    status: "100",
                    token: token,
                    id_user: user[0]._id
                });
            }
            return res.status(200).json({
                message: 'Password is incorrect',
                status: "102",
                token: "null",
                id_user: "null"
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.users_get_all = (req, res, next) => {
    User.find()
        .select("_id nama_lengkap email password telepon jk tgl_lahir foto")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                status: 200,
                users: docs.map(doc => {
                    return {
                        _id: doc._id,
                        nama_lengkap: doc.nama_lengkap,
                        email: doc.email,
                        password: doc.password,
                        telepon: doc.telepon,
                        jk: doc.jk,
                        tgl_lahir: doc.tgl_lahir,
                        foto: doc.foto

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

exports.users_get_user = (req, res, next) => {
    const id = req.params.userId;

    User.findById(id)
        .exec()
        .then(doc => {
            if(doc) {
                res.status(200).json({
                    _id: doc._id,
                    nama_lengkap: doc.nama_lengkap,
                    email: doc.email,
                    password: doc.password,
                    telepon: doc.telepon,
                    jk: doc.jk,
                    tgl_lahir: doc.tgl_lahir,
                    foto: doc.foto
                });
            }
            else {
                res.status(404).json({
                    message: 'User not found'
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

exports.users_update_user = (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};

    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    User.update({ _id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'User updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.users_update_name = (req, res, next) => {
    const id = req.params.userId;

    if(req.body.fieldUser === 'nama_lengkap') {
        User.updateOne({ _id: id}, { $set: {nama_lengkap: req.body.valueUser}})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Update nama lengkap berhasil',
                status : "100"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
    else if(req.body.fieldUser === 'telepon') {
        User.updateOne({ _id: id}, { $set: {telepon: req.body.valueUser}})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Update nomor telepon berhasil',
                "status": "100"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
    else if(req.body.fieldUser === 'tgl_lahir') {
        User.updateOne({ _id: id}, { $set: {tgl_lahir: req.body.valueUser}})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Update tanggal lahir telepon berhasil',
                "status": "100"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
    else if(req.body.fieldUser === 'jk') {
        User.updateOne({ _id: id}, { $set: {jk: req.body.valueUser}})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Update jenis kelamin berhasil',
                "status": "100"
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

exports.users_delete_user = (req, res, next) => {
    const id = req.params.userId;

    User.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};