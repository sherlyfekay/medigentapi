const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const OrdersOffersController = require('../controllers/ordersoffers');

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

//--GET /ordersoffers
router.get('/', checkAuth, OrdersOffersController.oo_get_all);

//--POST /ordersoffers/orders
router.post('/orders', checkAuth, upload.single('foto') , OrdersOffersController.oo_create_order);

//--POST /ordersoffers/offers
router.post('/offers', checkAuth, upload.single('foto') , OrdersOffersController.oo_create_offer);

//--GET /ordersoffers/category/userid
router.get('/category/:userId', checkAuth, OrdersOffersController.oo_get_oo_by_iduser);

//--GET /ordersoffers/ooid
router.get('/:ooId', checkAuth, OrdersOffersController.oo_get_oo_by_idoo);

// //--GET /orders/_id
// router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

//--PATCH /orders/_id
router.patch('/:orderId', checkAuth, OrdersOffersController.oo_update_oo);

//--DELETE /orders/_id
router.delete('/:ooId', checkAuth, OrdersOffersController.oo_delete_oo);

module.exports = router;