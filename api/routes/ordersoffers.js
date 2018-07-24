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
router.get('/category23/:userId', checkAuth, OrdersOffersController.oo_get_oo_by_iduser23);

//--GET /ordersoffers/category/userid
router.get('/category14/:userId', checkAuth, OrdersOffersController.oo_get_oo_by_iduser14);

//--GET /ordersoffers/kategori/agentid
router.get('/kategori/:agentId', checkAuth, OrdersOffersController.oo_get_oo_by_idagent);

//--GET /ordersoffers/daftarorder
router.get('/daftarorder', checkAuth, OrdersOffersController.oo_get_daftaroo);

//--GET /ordersoffers/ooid
router.get('/:ooId', checkAuth, OrdersOffersController.oo_get_oo_by_idoo);

//--GET /ordersoffers/get/ooid
router.get('/get/:ooId', checkAuth, OrdersOffersController.oo_get_oo_by_idoo2);

// //--GET /orders/_id
// router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

//--PATCH /ordersoffers/updatestat/_id
router.patch('/updatestat/:orderId', checkAuth, OrdersOffersController.oo_update_status);

//--PATCH /ordersoffers/updatestat/_id
router.patch('/updateagent/:orderId', checkAuth, OrdersOffersController.oo_update_agent);

//--DELETE /orders/_id
router.delete('/:ooId', checkAuth, OrdersOffersController.oo_delete_oo);

module.exports = router;