const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const mOrdersoffers = require('../../api/models/orderoffer');

//get all ordersoffers
router.get('/', auth, (req, res, next)=>{
    mOrdersoffers.find((err, result)=>{
        res.render('ordersoffers', {
            data: { 
                nama: "Pemesanan dan Penawaran",
                ordersoffers: result
            }
        })
    })
})

//get one orderoffer
router.get('/getone/:paramsId', auth, (req, res, next)=>{
    var search = req.params.paramsId;
    mOrdersoffers.findById(search, (err, result)=>{
        res.render('ordersoffers-detail', {
            data: {
                nama: "Detail Pemesanan dan Penawaran",
                orderoffer: result
            }            
        })
    })
})

//form create
router.get('/create', auth, (req, res, next)=>{
    res.render('ordersoffers-form', {
        data: {
            nama: "Form Create",
            action: "/w/ordersoffers/create",
            value: {
                _id: '',
                jenis: '',
                id_user: '',
                id_address: '',
                id_patient: '',
                id_role: '',
                jk_agen: '',
                jml_shift: '',
                jml_agent: '',
                jns_layanan: '',
                biaya: '',
                info: '',
                created_at: '',
                status: '',
                id_agent: ''
            }
        }
    })
})

//form update
router.get('/update/:paramsId', auth, (req, res, next)=>{
    mOrdersoffers.findById(req.params.paramsId, (err, result)=>{
        res.render('ordersoffers-form',{
            data: {
                nama: "Form Update",
                action: "/w/ordersoffers/update",
                value: result
            }
        })
    })
})

//action create
router.post('/create', auth, (req, res, next)=>{
    var neworderoffer = new mOrdersoffers({
        _id: new mongoose.Types.ObjectId(),
        jenis: req.body.jenis,
        id_user: req.body.id_user,
        id_address: req.body.id_address,
        id_patient: req.body.id_patient,
        id_role: req.body.id_role,
        jk_agen: req.body.jk_agen,
        jml_shift: req.body.jml_shift,
        jml_agent: req.body.jml_agent,
        jns_layanan: req.body.jns_layanan,
        biaya: req.body.biaya,
        info: req.body.info,
        created_at: req.body.created_at,
        status: req.body.status,
        id_agent: req.body.id_agent
    });

    neworderoffer.save().then((err, result)=>{
        res.redirect('/w/ordersoffers')
    });
})

//action update
router.post('/update', auth, (req, res, next)=>{
    bcrypt.hash(req.body.password, 10, (err, hashing)=>{

        var neworderoffer = {
            jenis: req.body.jenis,
            id_user: req.body.id_user,
            id_address: req.body.id_address,
            id_patient: req.body.id_patient,
            id_role: req.body.id_role,
            jk_agen: req.body.jk_agen,
            jml_shift: req.body.jml_shift,
            jml_agent: req.body.jml_agent,
            jns_layanan: req.body.jns_layanan,
            biaya: req.body.biaya,
            info: req.body.info,
            created_at: req.body.created_at,
            status: req.body.status,
            id_agent: req.body.id_agent
        };

        mOrdersoffers.findByIdAndUpdate(req.body._id, neworderoffer, (err, result)=>{
            res.redirect('/w/ordersoffers')
        });

    });
})

//action delete
router.get('/deleteone/:paramsId', auth, (req, res, next)=>{
    mOrdersoffers.findByIdAndRemove(req.params.paramsId, (err, result)=>{
        res.redirect('/w/ordersoffers')
    })
})


module.exports = router;