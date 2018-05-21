const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Agent = require('../models/agent');
const Role = require('../models/role');
const BASE_URL = 'http://192.168.43.157:3000/';

exports.agents_signup = (req, res, next) =>{
    Agent.find({ email: req.body.email })
    .exec()
    .then(agent => {
        if(agent.length >= 1) {
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
                    const agent = new Agent({
                        _id: new mongoose.Types.ObjectId(),
                        nama_lengkap: req.body.nama_lengkap,
                        email: req.body.email,
                        password: hash,
                        telepon: req.body.telepon,
                        jk: req.body.jk,
                        tgl_lahir: req.body.tgl_lahir,
                        alamat: req.body.alamat,
                        spesialis: req.body.spesialis,
                        sertifikat: BASE_URL + 'uploads/' + req.files['sertifikat'][0].filename,
                        foto: BASE_URL + 'uploads/' + req.files['foto'][0].filename,
                        id_role: req.body.id_role
                    });
                
                    agent
                        .save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'Agent created successfully',
                                status: '100',
                                id_new_agent: result._id
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

exports.agents_login = (req, res, next) => {
    Agent.find({ email: req.body.email })
    .exec()
    .then(agent => {
        if(agent.length < 1) {
            return res.status(200).json({
                message: 'Email doesnt exist',
                status: "101",
                token: "null",
                id_agent: "null"
            });
        }
        
        bcrypt.compare(req.body.password, agent[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Auth failed',
                    status: "103",
                    token: "null",
                    id_agent: "null"
                });
            }
            if(result) {
                const token = jwt.sign(
                    {
                        email: agent[0].email,
                        agentId: agent[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                    }
                );
                return res.status(200).json({
                    message: 'Auth successful',
                    status: "100",
                    token: token,
                    id_agent: agent[0]._id
                });
            }
            return res.status(200).json({
                message: 'Password is incorrect',
                status: "102",
                token: "null",
                id_agent: "null"
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

exports.agents_get_all = (req, res, next) => {
    Agent.find()
        .select("_id nama_lengkap email password telepon jk tgl_lahir alamat spesialis sertifikat foto id_role")
        .populate('id_role', 'nama_role')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                status: 200,
                agents: docs.map(doc => {
                    return {
                        _id: doc._id,
                        nama_lengkap: doc.nama_lengkap,
                        email: doc.email,
                        password: doc.password,
                        telepon: doc.telepon,
                        jk: doc.jk,
                        tgl_lahir: doc.tgl_lahir,
                        alamat: doc.alamat,
                        spesialis: doc.spesialis,
                        sertifikat: doc.sertifikat,
                        foto: doc.foto,
                        id_role: doc.id_role
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

exports.agents_create_agent = (req, res, next) =>{
    Role.findById(req.body.id_role)
    .then(role => {
        if(!role) {
            return res.status(404).json({
                message: 'Role not found'
            });
        }

        const agent = new Agent({
            _id: new mongoose.Types.ObjectId(),
            nama_lengkap: req.body.nama_lengkap,
            email: req.body.email,
            password: req.body.password,
            telepon: req.body.telepon,
            jk: req.body.jk,
            tgl_lahir: req.body.tgl_lahir,
            alamat: req.body.alamat,
            spesialis: req.body.spesialis,
            sertifikat: BASE_URL + 'uploads/' + req.files['sertifikat'][0].filename,
            foto: BASE_URL + 'uploads/' + req.files['foto'][0].filename,
            id_role: req.body.id_role
        });
        return agent.save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Agent created successfully',
            agent: {
                _id: result._id,
                nama_lengkap: result.nama_lengkap,
                email: result.email,
                password: result.password,
                telepon: result.telepon,
                jk: result.jk,
                tgl_lahir: result.tgl_lahir,
                alamat: result.alamat,
                spesialis: result.spesialis,
                sertifikat: result.sertifikat,
                foto: result.foto,
                id_role: result.id_role
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

exports.agents_get_agent = (req, res, next) => {
    const id = req.params.agentId;

    Agent.findById(id)
        .populate('id_role', 'nama_role')
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
                    alamat: doc.alamat,
                    spesialis: doc.spesialis,
                    sertifikat: doc.sertifikat,
                    foto: doc.foto,
                    id_role: doc.id_role
                });
            }
            else {
                res.status(404).json({
                    message: 'Agent not found'
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

exports.agents_update_agent = (req, res, next) => {
    const id = req.params.agentId;
    const updateOps = {};

    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Agent.update({ _id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Agent updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.agents_delete_agent = (req, res, next) => {
    const id = req.params.agentId;

    Agent.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Agent deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};