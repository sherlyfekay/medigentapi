const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const mUsers = require('../../api/models/user');

//get all users
router.get('/', auth, (req, res, next)=>{
    mUsers.find((err, result)=>{
        res.render('users', {
            data: { 
                nama: "Users",
                users: result
            }
        })
    })
})

//get one user
router.get('/getone/:paramsId', auth, (req, res, next)=>{
    var search = req.params.paramsId;
    mUsers.findById(search, (err, result)=>{
        res.render('users-detail', {
            data: {
                nama: "User Detail",
                user: result
            }            
        })
    })
})

//form create
router.get('/create', auth, (req, res, next)=>{
    res.render('users-form', {
        data: {
            nama: "Form Create",
            action: "/w/users/create",
            value: {
                _id: '',
                nama_lengkap: '',
                email: '',
                password: '',
                telepon: '',
                jk: '',
                tgl_lahir: '',
                foto: ''
            }
        }
    })
})

//form update
router.get('/update/:paramsId', auth, (req, res, next)=>{
    mUsers.findById(req.params.paramsId, (err, result)=>{
        res.render('users-form',{
            data: {
                nama: "Form Update",
                action: "/w/users/update",
                value: result
            }
        })
    })
})

//action create
router.post('/create', auth, (req, res, next)=>{
    bcrypt.hash(req.body.password, 10, (err, hashing)=>{
        var newUser = new mUsers({
            _id: new mongoose.Types.ObjectId(),
            nama_lengkap: req.body.nama_lengkap,
            email: req.body.email,
            password: hashing,
            telepon: req.body.telepon,
            jk: req.body.jk,
            tgl_lahir: req.body.tgl_lahir,
            foto: req.body.foto
        });

        newUser.save().then((err, result)=>{
            res.redirect('/w/users')
        });
    });
})

//action update
router.post('/update', auth, (req, res, next)=>{
    bcrypt.hash(req.body.password, 10, (err, hashing)=>{

        var newUser = {
            nama_lengkap: req.body.nama_lengkap,
            email: req.body.email,
            password: hashing,
            telepon: req.body.telepon,
            jk: req.body.jk,
            tgl_lahir: req.body.tgl_lahir,
            foto: req.body.foto
        };

        mUsers.findByIdAndUpdate(req.body._id, newUser, (err, result)=>{
            res.redirect('/w/users')
        });

    });
})

//action delete
router.get('/deleteone/:paramsId', auth, (req, res, next)=>{
    mUsers.findByIdAndRemove(req.params.paramsId, (err, result)=>{
        res.redirect('/w/users')
    })
})


module.exports = router;