const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const AddressesController = require('../controllers/addresses');

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

//--GET /addresses
router.get('/', checkAuth, AddressesController.addresses_get_all);

//--POST /addresses
router.post('/', checkAuth, upload.single('foto'), AddressesController.addresses_create_address);

//--GET /addresses/_id
router.get('/:addressId', checkAuth, AddressesController.addresses_get_address);

//--GET /addresses/category/iduser
router.get('/category/:userId', checkAuth, AddressesController.addresses_get_addresses_by_iduser);

//--PATCH /addresses/_id
router.patch('/:addressId', checkAuth, AddressesController.addresses_update_address);

//--DELETE /addresses/_id
router.delete('/:addressId', checkAuth, AddressesController.addresses_delete_address);

module.exports = router;