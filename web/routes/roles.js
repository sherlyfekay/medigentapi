const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const mRoles = require('../../api/models/role');

//get all roles
router.get('/', auth, (req, res, next)=>{
    mRoles.find((err, result)=>{
        res.render('roles', {
            data: { 
                nama: "Roles",
                roles: result
            }
        })
    })
})

//get one role
router.get('/getone/:paramsId', auth, (req, res, next)=>{
    var search = req.params.paramsId;
    mRoles.findById(search, (err, result)=>{
        res.render('roles-detail', {
            data: {
                nama: "Role Detail",
                role: result
            }            
        })
    })
})

//form create
router.get('/create', auth, (req, res, next)=>{
    res.render('roles-form', {
        data: {
            nama: "Form Create",
            action: "/w/roles/create",
            value: {
                _id: '',
                nama_role: '',
                desc: '',
                icon: ''
            }
        }
    })
})

//form update
router.get('/update/:paramsId', auth, (req, res, next)=>{
    mRoles.findById(req.params.paramsId, (err, result)=>{
        res.render('roles-form',{
            data: {
                nama: "Form Update",
                action: "/w/roles/update",
                value: result
            }
        })
    })
})

//action create
router.post('/create', auth, (req, res, next)=>{
    var newrole = new mRoles({
        _id: new mongoose.Types.ObjectId(),
        nama_role: req.body.nama_role,
        desc: req.body.desc,
        icon: req.body.icon
    });

    newrole.save().then((err, result)=>{
        res.redirect('/w/roles')
    });
})

//action update
router.post('/update', auth, (req, res, next)=>{
    var newrole = {
        nama_role: req.body.nama_role,
        desc: req.body.desc,
        icon: req.body.icon
    };

    mRoles.findByIdAndUpdate(req.body._id, newrole, (err, result)=>{
        res.redirect('/w/roles')
    });
})

//action delete
router.get('/deleteone/:paramsId', auth, (req, res, next)=>{
    mRoles.findByIdAndRemove(req.params.paramsId, (err, result)=>{
        res.redirect('/w/roles')
    })
})


module.exports = router;