const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const PatientsController = require('../controllers/patients');

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

//--GET /patients
router.get('/', checkAuth, PatientsController.patients_get_all);

//--POST /patients
router.post('/', checkAuth, upload.single('foto'), PatientsController.patients_create_patient);

//--GET /patients/_id
router.get('/:patientId', checkAuth, PatientsController.patients_get_patient);

//--GET /patients/category/id_user
router.get('/category/:userId', checkAuth, PatientsController.patients_get_patients_by_iduser2);

//--PATCH /patients/_id
router.patch('/:patientId', checkAuth, PatientsController.patients_update_patient);

//--PATCH /patients/updatestat/_id
router.patch('/updatestat/:patientId', checkAuth, PatientsController.patients_update_status);

//--DELETE /patients/_id
router.delete('/:patientId', checkAuth, PatientsController.patients_delete_patient);

module.exports = router;