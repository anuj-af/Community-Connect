

module.exports.isLoggedIn = (req,res,next) => {
    
    if(!req.isAuthenticated()){

        req.session.returnTo = req.originalUrl;
        return res.redirect('/user/login');
        
    }
    next()
}


module.exports.storeReturnTo = (req, res, next) => {

    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();

}