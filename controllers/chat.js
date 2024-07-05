const Message = require("../models/message");
const catchAsync = require("../utils/catchAsync");
const Community = require('../models/community');


module.exports.saveMessage =  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    const message = new Message({ content, sender: userId, community: id });

    try {
        await message.save();
        const populatedMessage = await message.populate('sender');
        res.status(201).json(populatedMessage);
    } catch (e) {
        res.status(505).json({ error: 'Message could not be saved' });
    }
})

module.exports.getMessage = catchAsync(async (req, res) => {
    const { id } = req.params;
    const messages = await Message.find({ community: id }).populate('sender');
    res.json(messages);
})

module.exports.renderChat = catchAsync(async (req, res) => {
    const { id } = req.params;
    const communities = await Community.find({});
    const community = await Community.findById(id).populate('followers');
    const messages = await Message.find({ community: id }).populate('sender');
    // console.log(community, messages);
    res.render('chat/chat', { community, messages,communities});
})