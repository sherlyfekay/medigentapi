const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const mAgents = require('../../api/models/agent');
const mRoles = require('../../api/models/role');

//get all agents
router.get('/', auth, (req, res, next)=>{
    mAgents.find((err, result)=>{
        res.render('agents', {
            data: { 
                nama: "Agents",
                agents: result
            }
        })
    })
})

//get one agent
router.get('/getone/:paramsId', auth, (req, res, next)=>{
    var search = req.params.paramsId;
    mAgents.findById(search, (err, result)=>{
        res.render('agents-detail', {
            data: {
                nama: "Agent Detail",
                agent: result
            }            
        })
    })
})

//form create
router.get('/create', auth, (req, res, next)=>{
    mRoles.find((err, result)=>{
        res.render('agents-form', {
            data: {
                nama: "Form Create",
                action: "/w/agents/create",
                value: {
                    _id: '',
                    nama_lengkap: '',
                    email: '',
                    password: '',
                    jk: '',
                    sertifikat: '',
                    foto: '',
                    id_role: '',
                    status: ''
                },
                roles: result
            }
        })
    })
})

//form update
router.get('/update/:paramsId', auth, (req, res, next)=>{
    mRoles.find((err, roles)=>{
        mAgents.findById(req.params.paramsId, (err, result)=>{
            res.render('agents-form',{
                data: {
                    nama: "Form Update",
                    action: "/w/agents/update",
                    value: result,
                    roles: roles
                }
            })
        })
    })
})

//action create
router.post('/create', auth, (req, res, next)=>{
    bcrypt.hash(req.body.password, 10, (err, hashing)=>{
        var newAgent = new mAgents({
            _id: new mongoose.Types.ObjectId(),
            nama_lengkap: req.body.nama_lengkap,
            email: req.body.email,
            password: hashing,
            jk: req.body.jk,
            sertifikat: req.body.sertifikat,
            foto: req.body.foto,
            id_role: req.body.id_role,
            status: 0
        });

        newAgent.save().then((err, result)=>{
            res.redirect('/w/agents')
        });
    });
})

//action update
router.post('/update', auth, (req, res, next)=>{
    bcrypt.hash(req.body.password, 10, (err, hashing)=>{

        var newAgent = {
            nama_lengkap: req.body.nama_lengkap,
            email: req.body.email,
            password: hashing,
            jk: req.body.jk,
            sertifikat: req.body.sertifikat,
            foto: req.body.foto,
            id_role: req.body.id_role,
            status: req.body.status
        };

        mAgents.findByIdAndUpdate(req.body._id, newAgent, (err, result)=>{
            res.redirect('/w/agents')
        });

    });
})

//action delete
router.get('/deleteone/:paramsId', auth, (req, res, next)=>{
    mAgents.findByIdAndRemove(req.params.paramsId, (err, result)=>{
        res.redirect('/w/agents')
    })
})

//action verifikasi
router.get('/verification/:paramsId', auth, (req, res, next)=>{
    var apdet = {"status": 1};
    mAgents.findByIdAndUpdate(req.params.paramsId, apdet, (err, result)=>{
        res.redirect('/w/agents');
    })
})

module.exports = router;