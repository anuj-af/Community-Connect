const Community = require('../models/community');

module.exports.newForm = (req,res) => {
    res.render('community/new');
}
module.exports.createCommunity = (req,res) => {
    const community = new Community(req.body);
    community.save();
    res.redirect(`/community/${community._id}/show`);
}

module.exports.showCommunity = async (req,res) => {
    const community = await Community.findById(req.params.id);
    res.render('community/show', {community});
}

module.exports.deleteCommunity = async (req,res) => {
    const community = await Community.findByIdAndDelete(req.params.id);
    res.redirect('/');
}

module.exports.editForm = async (req,res) => {
    const community = await Community.findById(req.params.id);
    res.render('community/edit', {community});
}
module.exports.updateCommunity = async (req,res) => {
    const community = await Community.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });
    res.redirect(`/community/${community._id}/show`);
}