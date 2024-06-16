const User=require('../models/user');

//Registering :
module.exports.renderRegister=(req,res)=>{
    res.render('user/register');
}

module.exports.register=async (req,res) => {
    try{

        const {username,email,password} = req.body;
        const user = new User({username,email});
        const registerUser = await User.register(user,password);
        req.login(registerUser, err => {
            if (err) return next(err);
            res.redirect(`/user/${user._id}/profile`);
        })

    }catch(e){
        console.log(e);
    }
}

//login : 
module.exports.renderLogin=(req,res)=>{

    res.render('user/login');
}

module.exports.login=async(req,res)=>{

    const path = res.locals.returnTo || '/';
    res.redirect(path);

}

//Profile : 
module.exports.getProfile=async(req,res)=>{
    const {userId}= req.params;
    const user = await User.findById(userId);

    if(!user){
        res.send('Cannot find that user');
    }
    res.render('user/profile',{user});
}

module.exports.renderProfileEdit=async(req,res)=>{
    const {userId}=req.params;
    const user=await User.findById(userId);
    res.render('user/editProfile',{user});
}

module.exports.editProfile=async(req,res)=>{
    const {userId}= req.params;
    const user = await User.findByIdAndUpdate(userId,req.body, { runValidators: true, new: true });
    res.redirect(`/user/${userId}/profile`);
}

module.exports.logout=(req,res) => {

    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });    

}