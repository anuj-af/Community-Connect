const User = require('../models/user');
const CustomError = require('../utils/CustomError');
const catchAsync = require('../utils/catchAsync');
const {cloudinary} = require('../cloudinary/index');

//Registering :
module.exports.renderRegister = (req, res) => {
    res.render('user/register');
}

module.exports.register = catchAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registerUser = await User.register(user, password);
        
        if(req.file){
            const {path,filename}=req.file;
            user.image = {url : path,filename : filename};
        }
        await user.save();
        req.login(registerUser, err => {
            if (err) return next(err);
            res.redirect(`/user/${user._id}/profile`);
        })

    } catch (e) {
        next(new CustomError("Unable to register :(", 400));
    }
})

//login : 
module.exports.renderLogin = (req, res) => {
    res.render('user/login');
}

module.exports.login = async (req, res) => {

    const path = res.locals.returnTo || '/';
    res.redirect(path);

}

//Profile : 
module.exports.getProfile = catchAsync(async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('followings');
        res.render('user/profile', { user });
    }
    catch (e) {
        next(new CustomError('User not found :(', 400));
    }
})

module.exports.renderProfileEdit = catchAsync(async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        res.render('user/editProfile', { user });
    }
    catch (e) {
        next(new CustomError('User not found :(', 400));
    }
})

module.exports.editProfile = catchAsync(async (req, res,next) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(userId, req.body, { runValidators: true, new: true });
        const file = user.image.filename;

        if(req.file){
            
            if(file){
                await cloudinary.uploader.destroy(file);
            }

            const {path,filename}=req.file;
            user.image = {url : path,filename : filename};
        }
        await user.save();
        req.login(user, err => {
            if (err) return next(err);
            res.redirect(`/user/${user._id}/profile`);
        })
    }
    catch (e) {
        next(new CustomError('User not found :(', 400));
    }
})

module.exports.logout = (req, res) => {

    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });

}