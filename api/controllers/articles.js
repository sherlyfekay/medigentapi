const mongoose = require('mongoose');

const Article = require('../models/article');
const BASE_URL = 'http://192.168.43.157:3000/';

exports.articles_get_all = (req, res, next) => {
    Article.find()
        .select("_id judul sumber link gambar")
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                status: 200,
                articles: docs.map(doc => {
                    return {
                        _id: doc._id,
                        judul: doc.judul,
                        sumber: doc.sumber,
                        link: doc.link,
                        gambar: doc.gambar
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

exports.articles_create_article = (req, res, next) =>{
    const article = new Article({
        _id: new mongoose.Types.ObjectId(),
        judul: req.body.judul,
        sumber: req.body.sumber,
        link: req.body.link,
        gambar: BASE_URL + 'uploads/' + req.file.filename
    });

    article
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created article successfully',
                status: 201,
                article: article
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.articles_get_article = (req, res, next) => {
    const id = req.params.articleId;

    Article.findById(id)
        .exec()
        .then(doc => {
            if(doc) {
                res.status(200).json({
                    _id: doc._id,
                    judul: doc.judul,
                    sumber: doc.sumber,
                    link: doc.link,
                    gambar: doc.gambar
                });
            }
            else {
                res.status(404).json({
                    message: 'Article not found'
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

exports.articles_update_article = (req, res, next) => {
    const id = req.params.articleId;
    const updateOps = {};

    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Article.update({ _id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Article updated'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.articles_delete_article = (req, res, next) => {
    const id = req.params.articleId;

    Article.remove({ _id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Article deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};