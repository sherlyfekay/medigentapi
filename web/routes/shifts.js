const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const mShifts = require('../../api/models/shift');

//get all shifts
router.get('/', auth, (req, res, next)=>{
    mShifts.find((err, result)=>{
        res.render('shifts', {
            data: { 
                nama: "Shifts",
                shifts: result
            }
        })
    })
})

//get one shift
router.get('/getone/:paramsId', auth, (req, res, next)=>{
    var search = req.params.paramsId;
    mShifts.findById(search, (err, result)=>{
        res.render('shifts-detail', {
            data: {
                nama: "Shift Detail",
                shift: result
            }            
        })
    })
})

//form create
router.get('/create', auth, (req, res, next)=>{
    res.render('shifts-form', {
        data: {
            nama: "Form Create",
            action: "/w/shifts/create",
            value: {
                _id: '',
                tanggal: '',
                jam: '',
                status: '',
                tindakan: '',
                kondisi: '',
                id_orderoffer: ''
            }
        }
    })
})

//form update
router.get('/update/:paramsId', auth, (req, res, next)=>{
    mShifts.findById(req.params.paramsId, (err, result)=>{
        res.render('shifts-form',{
            data: {
                nama: "Form Update",
                action: "/w/shifts/update",
                value: result
            }
        })
    })
})

//action create
router.post('/create', auth, (req, res, next)=>{
    var newshift = new mShifts({
        _id: new mongoose.Types.ObjectId(),
        tanggal: req.body.tanggal,
        jam: req.body.jam,
        status: req.body.status,
        tindakan: req.body.tindakan,
        kondisi: req.body.kondisi,
        id_orderoffer: req.body.id_orderoffer
    });

    newshift.save().then((err, result)=>{
        res.redirect('/w/shifts')
    });
})

//action update
router.post('/update', auth, (req, res, next)=>{
    var newshift = {
        tanggal: req.body.tanggal,
        jam: req.body.jam,
        status: req.body.status,
        tindakan: req.body.tindakan,
        kondisi: req.body.kondisi,
        id_orderoffer: req.body.id_orderoffer
    };

    mShifts.findByIdAndUpdate(req.body._id, newshift, (err, result)=>{
        res.redirect('/w/shifts')
    });
})

//action delete
router.get('/deleteone/:paramsId', auth, (req, res, next)=>{
    mShifts.findByIdAndRemove(req.params.paramsId, (err, result)=>{
        res.redirect('/w/shifts')
    })
})


module.exports = router;