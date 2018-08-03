const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ShiftsController = require('../controllers/shifts');

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

//--GET /shifts
router.get('/', checkAuth, ShiftsController.shifts_get_all);

//--POST /shifts
router.post('/', checkAuth, upload.single('foto'), ShiftsController.shifts_create_shift);

//--GET /shifts/_id
router.get('/:shiftId', checkAuth, ShiftsController.shifts_get_shift);

//status 1 = sudah ditangani
//--GET /shifts/category/id_orderoffer
router.get('/category/:orderofferId', checkAuth, ShiftsController.shifts_get_shifts_by_idoo);

//status 0 = belum ditangani
//--GET /shifts/kategori/id_orderoffer
router.get('/kategori/:orderofferId', checkAuth, ShiftsController.shifts_get_shifts_by_idoo2);

//--PATCH /shifts/_id
router.patch('/:shiftId', checkAuth, ShiftsController.shifts_update_shift);

//--DELETE /shifts/_id
router.delete('/:shiftId', checkAuth, ShiftsController.shifts_delete_shift);

module.exports = router;