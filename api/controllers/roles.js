const mongoose = require('mongoose');

const Role = require('../models/role');
const BASE_URL = 'http://192.168.43.157:3000/';

exports.roles_get_all = (req, res, next) => {
    Role.find()
        .select("_id nama_role desc icon")
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                status: 200,
                roles: docs.map(doc => {
                    return {
                        _id: doc._id,
                        nama_role: doc.nama_role,
                        desc: doc.desc,
                        icon: doc.icon
                    }
                })
                
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.roles_create_role = (req, res, next) =>{
    const role = new Role({
        _id: new mongoose.Types.ObjectId(),
        nama_role: req.body.nama_role,
        desc: req.body.desc,
        icon: BASE_URL + 'uploads/' + req.file.filename
    });

    role
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created role successfully',
                status: 201,
                role: role
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.roles_get_role = (req, res, next) => {
    const id = req.params.roleId;

    Role.findById(id)
        .exec()
        .then(doc => {
            if(doc) {
                res.status(200).json({
                    _id: doc._id,
                    nama_role: doc.nama_role,
                    desc: doc.desc,
                    icon: doc.icon
                });
            }
            else {
                res.status(404).json({
                    message: 'Role not found'
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

exports.roles_update_role = (req, res, next) => {
    const id = req.params.roleId;
    const updateOps = {};

    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Role.update({ _id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Role updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.roles_delete_role = (req, res, next) => {
    const id = req.params.roleId;

    Role.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Role deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};