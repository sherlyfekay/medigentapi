const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const mArticles = require('../../api/models/article');

//get all articles
router.get('/', auth, (req, res, next)=>{
    mArticles.find((err, result)=>{
        res.render('articles', {
            data: { 
                nama: "Articles",
                articles: result
            }
        })
    })
})

//get one article
router.get('/getone/:paramsId', auth, (req, res, next)=>{
    var search = req.params.paramsId;
    mArticles.findById(search, (err, result)=>{
        res.render('articles-detail', {
            data: {
                nama: "Article Detail",
                article: result
            }            
        })
    })
})

//form create
router.get('/create', auth, (req, res, next)=>{
    res.render('articles-form', {
        data: {
            nama: "Form Create",
            action: "/w/articles/create",
            value: {
                _id: '',
                judul: '',
                sumber: '',
                link: '',
                gambar: ''
            }
        }
    })
})

//form update
router.get('/update/:paramsId', auth, (req, res, next)=>{
    mArticles.findById(req.params.paramsId, (err, result)=>{
        res.render('articles-form',{
            data: {
                nama: "Form Update",
                action: "/w/articles/update",
                value: result
            }
        })
    })
})

//action create
router.post('/create', auth, (req, res, next)=>{
    var newarticle = new mArticles({
        _id: new mongoose.Types.ObjectId(),
        judul: req.body.judul,
        sumber: req.body.sumber,
        link: req.body.link,
        gambar: req.body.gambar
    });

    newarticle.save().then((err, result)=>{
        res.redirect('/w/articles')
    });
})

//action update
router.post('/update', auth, (req, res, next)=>{
    var newarticle = {
        judul: req.body.judul,
        sumber: req.body.sumber,
        link: req.body.link,
        gambar: req.body.gambar
    };

    mArticles.findByIdAndUpdate(req.body._id, newarticle, (err, result)=>{
        res.redirect('/w/articles')
    });
})

//action delete
router.get('/deleteone/:paramsId', auth, (req, res, next)=>{
    mArticles.findByIdAndRemove(req.params.paramsId, (err, result)=>{
        res.redirect('/w/articles')
    })
})


module.exports = router;