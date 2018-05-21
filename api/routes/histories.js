const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const HistoriesController = require('../controllers/histories');

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

//--GET /histories
router.get('/', checkAuth, HistoriesController.histories_get_all);

//--POST /histories
router.post('/', checkAuth, upload.single('foto') , HistoriesController.histories_create_history);

//--GET /histories/_id
router.get('/:historyId', checkAuth, HistoriesController.histories_get_history);

//--GET /histories/category/userid
router.get('/category/:userId', checkAuth, HistoriesController.histories_get_histories_by_iduser);

//--PATCH /histories/_id
router.patch('/:historyId', checkAuth, HistoriesController.histories_update_history);

//--DELETE /histories/_id
router.delete('/:historyId', checkAuth, HistoriesController.histories_delete_history);

module.exports = router;