const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const OrdersController = require('../controllers/orders');

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

//--GET /orders
router.get('/', checkAuth, OrdersController.orders_get_all);

//--POST /orders
router.post('/', checkAuth, upload.single('foto') , OrdersController.orders_create_order);

//--GET /orders/_id
router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

//--PATCH /orders/_id
router.patch('/:orderId', checkAuth, OrdersController.orders_update_order);

//--DELETE /orders/_id
router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);

module.exports = router;