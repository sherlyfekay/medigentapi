const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const RolesController = require('../controllers/roles');

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

//--GET /roles
router.get('/', RolesController.roles_get_all);

//--POST /roles
router.post('/', checkAuth, upload.single('icon'), RolesController.roles_create_role);

//--GET /roles/_id
router.get('/:roleId', checkAuth, RolesController.roles_get_role);

//--PATCH /roles/_id
router.patch('/:roleId', checkAuth, RolesController.roles_update_role);

//--DELETE /roles/_id
router.delete('/:roleId', checkAuth, RolesController.roles_delete_role);

module.exports = router;