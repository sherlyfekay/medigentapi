module.exports = (req, res, next) => {
    if(req.session.email == "admin@medigent.com" && req.session.password == "adminmedigent") {
        next();
    }
    else{
        res.redirect('/w/signin')
    }
};