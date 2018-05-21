const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const OffersController = require('../controllers/offers');

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

//--GET /offers
router.get('/', checkAuth, OffersController.offers_get_all);

//--POST /offers
router.post('/', checkAuth, upload.single('foto'), OffersController.offers_create_offer);

//--GET /offers/_id
router.get('/:offerId', checkAuth, OffersController.offers_get_offer);

//--PATCH /offers/_id
router.patch('/:offerId', checkAuth, OffersController.offers_update_offer);

//--DELETE /offers/_id
router.delete('/:offerId', checkAuth, OffersController.offers_delete_offer);

module.exports = router;