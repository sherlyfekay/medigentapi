const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ArticlesController = require('../controllers/articles');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() +'_'+ file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(new Error('Not supported type of file'), false);
    }
};

const upload = multer({
    storage: storage, 
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
});

//--GET /articles
router.get('/', checkAuth, ArticlesController.articles_get_all);

//--POST /articles
router.post('/', checkAuth, upload.single('gambar'), ArticlesController.articles_create_article);

//--GET /articles/_id
router.get('/:articleId', checkAuth, ArticlesController.articles_get_article);

//--PATCH /articles/_id
router.patch('/:articleId', checkAuth, ArticlesController.articles_update_article);

//--DELETE /articles/_id
router.delete('/:articleId', checkAuth, ArticlesController.articles_delete_article);

module.exports = router;