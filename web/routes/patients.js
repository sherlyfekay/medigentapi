const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const mPatients = require('../../api/models/patient');
const mUsers = require('../../api/models/user');

//get all patients
router.get('/', auth, async (req, res, next)=>{
    let patients = await mPatients.aggregate([
        {
    
            $lookup: {
                from: 'users',
                localField: 'id_user',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $project: {
                _id: 1,
                nama_lengkap: 1,
                nama_user: '$user.nama_lengkap' 
            }
        }
        
    ])
    
    res.render('patients', {
        data: { 
            nama: "Patients",
            patients: patients
        }
    })
})

//get one patient
router.get('/getone/:paramsId', auth, (req, res, next)=>{
    var search = req.params.paramsId;
    mPatients.findById(search, (err, result)=>{
        res.render('patients-detail', {
            data: {
                nama: "Patient Detail",
                patient: result
            }            
        })
    })
})

//form create
router.get('/create', auth, (req, res, next)=>{
    res.render('patients-form', {
        data: {
            nama: "Form Create",
            action: "/w/patients/create",
            value: {
                _id: '',
                nama_lengkap: '',
                jk: '',
                tgl_lahir: '',
                berat: '',
                tinggi: '',
                hubungan: '',
                alat: '',
                diagnosa: '',
                kondisi: '',
                status: '',
                id_user: ''
            }
        }
    })
})

//form update
router.get('/update/:paramsId', auth, (req, res, next)=>{
    mPatients.findById(req.params.paramsId, (err, result)=>{
        res.render('patients-form',{
            data: {
                nama: "Form Update",
                action: "/w/patients/update",
                value: result
            }
        })
    })
})

//action create
router.post('/create', auth, (req, res, next)=>{
    var newpatient = new mPatients({
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
        status: req.body.status,
        id_user: req.body.id_user
    });

    newpatient.save().then((err, result)=>{
        res.redirect('/w/patients')
    });
})

//action update
router.post('/update', auth, (req, res, next)=>{
    bcrypt.hash(req.body.password, 10, (err, hashing)=>{

        var newpatient = {
            nama_lengkap: req.body.nama_lengkap,
            jk: req.body.jk,
            tgl_lahir: req.body.tgl_lahir,
            berat: req.body.berat,
            tinggi: req.body.tinggi,
            hubungan: req.body.hubungan,
            alat: req.body.alat,
            diagnosa: req.body.diagnosa,
            kondisi: req.body.kondisi,
            status: req.body.status,
            id_user: req.body.id_user
        };

        mPatients.findByIdAndUpdate(req.body._id, newpatient, (err, result)=>{
            res.redirect('/w/patients')
        });

    });
})

//action delete
router.get('/deleteone/:paramsId', auth, (req, res, next)=>{
    mPatients.findByIdAndRemove(req.params.paramsId, (err, result)=>{
        res.redirect('/w/patients')
    })
})


module.exports = router;