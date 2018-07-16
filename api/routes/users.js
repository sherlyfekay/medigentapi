const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const UsersController = require('../controllers/users');

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

//--POST /users/signup
router.post('/signup', UsersController.users_signup);

//--POST /users/login
router.post('/login', UsersController.users_login);

//--POST /users/updatefoto/_id
router.post('/updatefoto/:userId', UsersController.users_update_foto);

//--GET /users
router.get('/', checkAuth, UsersController.users_get_all);

//--GET /users/_id
router.get('/:userId', checkAuth, UsersController.users_get_user);

//--PATCH /users/_id
router.patch('/:userId', checkAuth, UsersController.users_update_name);

//--DELETE /users/_id
router.delete('/:userId', checkAuth, UsersController.users_delete_user);

module.exports = router;