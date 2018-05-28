const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const RatingController = require('../controllers/ratings');

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

//--GET /ratings
router.get('/', checkAuth, RatingController.ratings_get_all);

//--POST /ratings
router.post('/', checkAuth, upload.single('foto'), RatingController.ratings_create_rating);

//--GET /ratings/_id
router.get('/:ratingId', checkAuth, RatingController.ratings_get_rating);

//--GET /ratings/category/id_agent
router.get('/category/:agentId', checkAuth, RatingController.ratings_get_ratings_by_idagent);

//--PATCH /ratings/_id
router.patch('/:ratingId', checkAuth, RatingController.ratings_update_rating);

//--DELETE /ratings/_id
router.delete('/:ratingId', checkAuth, RatingController.ratings_delete_rating);

module.exports = router;