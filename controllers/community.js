const Community = require('../models/community');
const CustomError=require('../utils/CustomError');
const catchAsync=require('../utils/catchAsync');

module.exports.newForm = (req,res) => {
    res.render('community/new');
}
module.exports.createCommunity = catchAsync(async (req,res,next) => {
        try{
            const{name,description} = req.body;
            const admin = req.user;
            const community = await new Community({name,description,admin}); 
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
        });
        res.render('community/show', {community});
    }
    catch(e){
        next(new CustomError("Unable to find the community :( ",400));
    }

})

module.exports.deleteCommunity = catchAsync(async (req,res,next) => {
    try{
        const community = await Community.findByIdAndDelete(req.params.id);
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
        res.redirect(`/community/${community._id}`);
    }
    catch(e){
        next(new CustomError("Unable to update the community :( ",400));
    }

})