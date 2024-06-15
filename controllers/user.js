const User=require('../models/user');

//Registering :
module.exports.renderRegister=(req,res)=>{
    res.render('user/register');
}
module.exports.register=async(req,res)=>{
    const {username , email,password} = req.body;
    const user=await new User({username,email,password});
    await user.save();
    res.redirect(`/user/${user._id}/profile`);

}

//login : 
module.exports.renderLogin=(req,res)=>{
    res.render('user/login');
}
module.exports.login=async(req,res)=>{
    const {username,password} = req.body;
    const user=await User.findOne({username});
    
    if(!user){
        return res.send("Cannot find user with that username");
    }

    if( (password != user.password)){
        return res.redirect('/user/login'); 
    }
    res.redirect(`/user/${user._id}/profile`);
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