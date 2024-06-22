const path = require('path');
const { cloudinary } = require('../cloudinary');
const Community = require('../models/community');
const User = require('../models/user');
const CustomError=require('../utils/CustomError');
const catchAsync=require('../utils/catchAsync');

module.exports.newForm = (req,res) => {
    res.render('community/new');
}
module.exports.createCommunity = catchAsync(async (req,res,next) => {
        try{

            // console.log(req.body);

            const {name,description,category} = req.body;
            const admin = req.user;
            const community = await new Community({name,description,admin,category});
            if(req.file){
                const {path,filename}=req.file;
                community.image = {url : path,filename : filename};
            }
            // console.log(community);
            await community.save();
            res.redirect(`/community/${community._id}`);

        }
        catch(e){
            next(new CustomError('Unable to create community :( ',400));
        }
     
})

module.exports.showCommunity = catchAsync(async (req,res,next) => {
    try{
        const community = await Community.findById(req.params.id).populate({
            path:'posts',
            populate:{
                path:'author'   
            }
        }).populate('admin').populate('requests');
        res.render('community/show', {community});
    }
    catch(e){
        next(new CustomError("Unable to find the community :( ",400));
    }

})

module.exports.deleteCommunity = catchAsync(async (req,res,next) => {
    try{
        const community = await Community.findByIdAndDelete(req.params.id).populate({
            path : 'posts',
            populate : {
                path : 'image'
            }
        });
        res.redirect('/');
    }
    catch(e){
        next(new CustomError("Unable to delete the community :( ",400));

    }
})

module.exports.editForm = catchAsync(async (req,res,next) => {
    try{
        const community = await Community.findById(req.params.id);
        res.render('community/edit', {community});
    }
    catch(e){
        next(new CustomError("Unable to find the community :( ",400));
    }
})
module.exports.updateCommunity =catchAsync(async (req,res,next) => {
    try{
        const community = await Community.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });
        const file = community.image.filename;
        if(req.file){
            
            await cloudinary.uploader.destroy(file);

            const {path,filename}=req.file;
            community.image = {url : path,filename : filename};
            community.save();
        }
        
        
        res.redirect(`/community/${community._id}`);
    }
    catch(e){
        next(new CustomError("Unable to update the community :( ",400));
    }

})

module.exports.follow = async (req, res, next) => {

    try {
        const {id} = req.params;
        const userId = req.user._id;
        const community=await Community.findById(id);
        const user = await User.findById(userId);

        const userFollowed = community.followers.includes(userId);

        if (userFollowed) {
            community.followers = community.followers.filter(follows => follows.toString() !== userId.toString());
            user.followings = user.followings.filter(following => following.toString() !== id.toString());
        } else {
            community.followers.push(userId);
            user.followings.push(id);
        }

        await community.save();
        await user.save();

        res.redirect(`/community/${id}`);

    } catch (e) {
        next(new CustomError("Unable to follow :(", 400));
    }
}