const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const AgentsController = require('../controllers/agents');

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

const agentUpload = upload.fields([{ name: 'sertifikat', maxCount: 1}, {name: 'foto', maxCount: 1}]);

//--POST /agents/signup
router.post('/signup', agentUpload, AgentsController.agents_signup);

//--POST /agents/login
router.post('/login', AgentsController.agents_login);

//--GET /agents
router.get('/', checkAuth, AgentsController.agents_get_all);

//--POST /agents
router.post('/', checkAuth, agentUpload, AgentsController.agents_create_agent);

//--GET /agents/_id
router.get('/:agentId', checkAuth, AgentsController.agents_get_agent);

//--PATCH /agents/_id
router.patch('/:agentId', checkAuth, AgentsController.agents_update_name);

//--DELETE /agents/_id
router.delete('/:agentId', checkAuth, AgentsController.agents_delete_agent);

module.exports = router;