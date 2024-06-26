const {communitySchema, userSchema} = require('./schemas');
const CustomError = require('./utils/CustomError');


module.exports.validateCommunity = (req,res,next) => {

    const { error } = communitySchema.validate(req.body);
    if (error) {

        const msg = error.details.map(el => el.message).join(',')
        throw new CustomError(msg, 400);
    }
    else {
        next()
    }
}

module.exports.validateUser = (req,res,next) => {

    const { error } = userSchema.validate(req.body);
    if (error) {

        const msg = error.details.map(el => el.message).join(',')
        throw new CustomError(msg, 400);
    }
    else {
        next()
    }

}

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

module.exports.followsCommunity = (req,res,next) => {

    const {id} = req.params;
    const user = req.user;

    const present = user.followings.includes(id.toString());

    if(!present){
        next(new CustomError("you need to join community first !!",400));
    }
    else{
        next();
    }

}