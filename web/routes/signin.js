const express = require('express');
const router = express.Router();
const multer = require('multer');

router.get('/', (req, res, next)=>{
    res.render('signin', {
        data: { 
            nama: "Signin",
            msg: "Start your session in medigent"
        }
    })
})

//action signin
router.post('/login', (req, res, next)=>{
    var email = req.body.email;
    var passw = req.body.password;
    
    if(email == "admin@medigent.com" && passw == "adminmedigent") {
        req.session.email = email;
        req.session.password = passw;
        res.redirect('/w/dashboard');
    }
    else{
        res.render('signin', {
            data: {
                nama: "Failed",
                msg: "Email or password incorrect!"
            }
        })
    }
})

router.get('/logout', (req, res, next)=>{
    req.session.destroy();
    res.redirect('/w/signin');
})

module.exports = router;