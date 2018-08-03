const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Agent = require('../models/agent');
const Role = require('../models/role');
const BASE_URL = 'https://sherly.jagopesan.com/';

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
                        status: 0,
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
                    'sherlycantik',
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
        .select("_id nama_lengkap email password telepon jk tgl_lahir judul alamat_lengkap tambahan lat lng rating spesialis sertifikat foto biaya status id_role")
        // .populate('id_role', 'nama_role')
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
                        judul: doc.judul,
                        alamat_lengkap: doc.alamat_lengkap,
                        tambahan: doc.tambahan,
                        lat: doc.lat,
                        lng: doc.lng,
                        rating: doc.rating,
                        spesialis: doc.spesialis,
                        sertifikat: doc.sertifikat,
                        foto: doc.foto,
                        biaya: doc.biaya,
                        status: doc.status,
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
            judul: req.body.judul,
            alamat_lengkap: req.body.alamat_lengkap,
            tambahan: req.body.tambahan,
            lat: req.body.lat,
            lng: req.body.lng,
            rating: req.body.rating,
            spesialis: req.body.spesialis,
            sertifikat: BASE_URL + 'uploads/' + req.files['sertifikat'][0].filename,
            foto: BASE_URL + 'uploads/' + req.files['foto'][0].filename,
            biaya: req.body.biaya,
            status: req.body.status,
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
                judul: result.judul,
                alamat_lengkap: result.alamat_lengkap,
                tambahan: result.tambahan,
                lat: result.lat,
                lng: result.lng,
                rating: result.rating,
                spesialis: result.spesialis,
                sertifikat: result.sertifikat,
                foto: result.foto,
                biaya: result.biaya,
                status: result.status,
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

exports.agents_get_agent = async (req, res, next) => {
    const id = req.params.agentId;

    let agent = await Agent
    .aggregate([
        {
            $match: {
                _id: new ObjectId(id)
            }
        },
        {
            $lookup: {
                from: 'roles',
                localField: 'id_role',
                foreignField: '_id',
                as: 'role'
            }
        },
        {
            $unwind: '$role'
        },
        {
            $project: {
                _id: 1,
                nama_lengkap: 1,
                email: 1,
                password: 1,
                telepon: 1,
                jk: 1,
                tgl_lahir: 1,
                judul: 1,
                alamat_lengkap: 1,
                tambahan: 1,
                lat: 1,
                lng: 1,
                rating: 1,
                spesialis: 1,
                sertifikat: 1,
                foto: 1,
                id_role: 1,
                biaya: 1,
                status: 1,
                nama_role: '$role.nama_role'
            }
        }
    ]);

    console.log(agent);
    res.status(200).json({agent: agent});

    // Agent.findById(id)
    //     .exec()
    //     .then(doc => {
    //         if(doc) {
    //             res.status(200).json({
    //                 _id: doc._id,
    //                 nama_lengkap: doc.nama_lengkap,
    //                 email: doc.email,
    //                 password: doc.password,
    //                 telepon: doc.telepon,
    //                 jk: doc.jk,
    //                 tgl_lahir: doc.tgl_lahir,
    //                 judul: doc.judul,
    //                 alamat_lengkap: doc.alamat_lengkap,
    //                 tambahan: doc.tambahan,
    //                 lat: doc.lat,
    //                 lng: doc.lng,
    //                 rating: doc.rating,
    //                 spesialis: doc.spesialis,
    //                 sertifikat: doc.sertifikat,
    //                 foto: doc.foto,
    //                 id_role: doc.id_role
    //             });
    //         }
    //         else {
    //             res.status(404).json({
    //                 message: 'Agent not found'
    //             });
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).json({
    //             error: err
    //         });
    //     });
};

exports.agents_get_agent_by_idrole = async (req, res, next) => {
    let id = req.params.roleId;

    let agent = await Agent
    .aggregate([
        {
            $match: {
                id_role: new ObjectId(id)
            }
        },
        {
            $project: {
                _id: 1,
                nama_lengkap: 1,
                email: 1,
                password: 1,
                telepon: 1,
                jk: 1,
                tgl_lahir: 1,
                judul: 1,
                alamat_lengkap: 1,
                tambahan: 1,
                lat: 1,
                lng: 1,
                rating: 1,
                spesialis: 1,
                sertifikat: 1,
                foto: 1,
                biaya: 1,
                status: 1,
                id_role: 1
            }
        }
    ]);

    console.log(agent);
    res.status(200).json({
        count: agent.length,
        status: "200",
        agents: agent
    });
};

exports.agents_update_agent = (req, res, next) => {
    const id = req.params.agentId;
    const updateOps = {};

    for(const ops of req.body) {
        updateOps[ops.field] = ops.value;
        console.log(ops.value);
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

exports.agents_update_latlng = (req, res, next) => {
    const id = req.params.agentId;
    const updateOps = {};

    for(const ops of req.body) {
        updateOps[ops.field] = ops.numValue;
        console.log(ops.value);
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

exports.agents_update_name = (req, res, next) => {
    const id = req.params.agentId;

    if(req.body.field === 'nama_lengkap') {
        Agent.updateOne({ _id: id}, { $set: {nama_lengkap: req.body.value}})
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
    else if(req.body.field === 'telepon') {
        Agent.updateOne({ _id: id}, { $set: {telepon: req.body.value}})
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
    else if(req.body.field === 'tgl_lahir') {
        Agent.updateOne({ _id: id}, { $set: {tgl_lahir: req.body.value}})
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
    else if(req.body.field === 'jk') {
        Agent.updateOne({ _id: id}, { $set: {jk: req.body.value}})
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