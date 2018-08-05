const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');

const mAgents = require('../../api/models/agent');
const mUsers = require('../../api/models/user');
const mPatients = require('../../api/models/patient');
const mAddresses = require('../../api/models/address');
const mOrders = require('../../api/models/orderoffer');
const mShifts = require('../../api/models/shift');
const mRatintgs = require('../../api/models/rating');
const mRoless = require('../../api/models/role');
const mArticles = require('../../api/models/article');

router.get('/', auth, async (req, res, next)=>{
    var dAgents = await mAgents.find({})
    var dUsers = await mUsers.find({})
    var dPatients = await mPatients.find({})
    var dAddresses = await mAddresses.find({})
    var dOrders = await mOrders.find({})
    var dShifts = await mShifts.find({})
    var dRatings = await mRatintgs.find({})
    var dRoles = await mRoless.find({})
    var dArticles = await mArticles.find({})
    res.render('dashboard', {
        data: { 
            nama: "Dashboard",
            session: req.session,
            dAgents: dAgents.length,
            dUsers: dUsers.length,
            dPatients: dPatients.length,
            dAddresses: dAddresses.length,
            dOrders: dOrders.length,
            dShifts: dShifts.length,
            dRatings: dRatings.length,
            dRoles: dRoles.length,
            dArticles: dArticles.length,
        }
    })
})

module.exports = router;