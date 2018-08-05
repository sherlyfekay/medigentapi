const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const mRatings = require('../../api/models/rating');

//get all ratings
router.get('/', auth, (req, res, next)=>{
    mRatings.find((err, result)=>{
        res.render('ratings', {
            data: { 
                nama: "Ratings",
                ratings: result
            }
        })
    })
})

//get one rating
router.get('/getone/:paramsId', auth, (req, res, next)=>{
    var search = req.params.paramsId;
    mRatings.findById(search, (err, result)=>{
        res.render('ratings-detail', {
            data: {
                nama: "Rating Detail",
                rating: result
            }            
        })
    })
})

//form create
router.get('/create', auth, (req, res, next)=>{
    res.render('ratings-form', {
        data: {
            nama: "Form Create",
            action: "/w/ratings/create",
            value: {
                _id: '',
                rating: '',
                tgl: '',
                komentar: '',
                id_agent: '',
                id_orderoffer: ''
            }
        }
    })
})

//form update
router.get('/update/:paramsId', auth, (req, res, next)=>{
    mRatings.findById(req.params.paramsId, (err, result)=>{
        res.render('ratings-form',{
            data: {
                nama: "Form Update",
                action: "/w/ratings/update",
                value: result
            }
        })
    })
})

//action create
router.post('/create', auth, (req, res, next)=>{
    var newrating = new mRatings({
        _id: new mongoose.Types.ObjectId(),
        rating: req.body.rating,
        tgl: req.body.tgl,
        komentar: req.body.komentar,
        id_agent: req.body.id_agent,
        id_orderoffer: req.body.id_orderoffer
    });

    newrating.save().then((err, result)=>{
        res.redirect('/w/ratings')
    });
})

//action update
router.post('/update', auth, (req, res, next)=>{
    var newrating = {
        rating: req.body.rating,
        tgl: req.body.tgl,
        komentar: req.body.komentar,
        id_agent: req.body.id_agent,
        id_orderoffer: req.body.id_orderoffer
    };

    mRatings.findByIdAndUpdate(req.body._id, newrating, (err, result)=>{
        res.redirect('/w/ratings')
    });
})

//action delete
router.get('/deleteone/:paramsId', auth, (req, res, next)=>{
    mRatings.findByIdAndRemove(req.params.paramsId, (err, result)=>{
        res.redirect('/w/ratings')
    })
})


module.exports = router;