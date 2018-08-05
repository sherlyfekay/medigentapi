const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const mAddresses = require('../../api/models/address');

//get all addresses
router.get('/', auth, async (req, res, next)=>{
    let addresses = await mAddresses.aggregate([
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
                judul: 1,
                nama_user: '$user.nama_lengkap' 
            }
        }
        
    ])
    
    res.render('addresses', {
        data: { 
            nama: "Addresses",
            addresses: addresses
        }
    })
})

//get one address
router.get('/getone/:paramsId', auth, (req, res, next)=>{
    var search = req.params.paramsId;
    mAddresses.findById(search, (err, result)=>{
        res.render('addresses-detail', {
            data: {
                nama: "Address Detail",
                address: result
            }            
        })
    })
})

//form create
router.get('/create', auth, (req, res, next)=>{
    res.render('addresses-form', {
        data: {
            nama: "Form Create",
            action: "/w/addresses/create",
            value: {
                _id: '',
                judul: '',
                alamat_lengkap: '',
                tambahan: '',
                lat: '',
                lng: '',
                status: '',
                id_user: ''
            }
        }
    })
})

//form update
router.get('/update/:paramsId', auth, (req, res, next)=>{
    mAddresses.findById(req.params.paramsId, (err, result)=>{
        res.render('addresses-form',{
            data: {
                nama: "Form Update",
                action: "/w/addresses/update",
                value: result
            }
        })
    })
})

//action create
router.post('/create', auth, (req, res, next)=>{
    var newaddress = new mAddresses({
        _id: new mongoose.Types.ObjectId(),
        judul: req.body.judul,
        alamat_lengkap: req.body.alamat_lengkap,
        tambahan: req.body.tambahan,
        lat: req.body.lat,
        lng: req.body.lng,
        status: req.body.status,
        id_user: req.body.id_user
    });

    newaddress.save().then((err, result)=>{
        res.redirect('/w/addresses')
    });
})

//action update
router.post('/update', auth, (req, res, next)=>{
    var newaddress = {
        judul: req.body.judul,
        alamat_lengkap: req.body.alamat_lengkap,
        tambahan: req.body.tambahan,
        lat: req.body.lat,
        lng: req.body.lng,
        status: req.body.status,
        id_user: req.body.id_user
    };

    mAddresses.findByIdAndUpdate(req.body._id, newaddress, (err, result)=>{
        res.redirect('/w/addresses')
    });
})

//action delete
router.get('/deleteone/:paramsId', auth, (req, res, next)=>{
    mAddresses.findByIdAndRemove(req.params.paramsId, (err, result)=>{
        res.redirect('/w/addresses')
    })
})


module.exports = router;