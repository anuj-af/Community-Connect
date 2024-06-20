const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community');
const {isLoggedIn, validateCommunity} = require('../middleware');
const Community = require('../models/community');
const Message = require('../models/message');

router.route('/new')
    .get(isLoggedIn,communityController.newForm)
    .post(isLoggedIn,validateCommunity,communityController.createCommunity);

router.delete('/:id',isLoggedIn,communityController.deleteCommunity);

router.get('/:id/' ,communityController.showCommunity);

router.route('/:id/edit')
    .get(isLoggedIn,communityController.editForm)
    .patch(validateCommunity,communityController.updateCommunity);

// Join a community
router.post('/:id/follow',isLoggedIn,communityController.follow);

// Send a message
router.post('/:id/messages', async (req, res) => {
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
});

// Get messages
router.get('/:id/messages', async (req, res) => {
    const { id } = req.params;
    const messages = await Message.find({ community: id }).populate('sender');
    res.json(messages);
});

// Get community chat page
router.get('/:id/chat', async (req, res) => {
    const { id } = req.params;
    const community = await Community.findById(id).populate('followers');
    const messages = await Message.find({ community: id }).populate('sender');
    console.log(community, messages);
    res.render('chat/chat', { community, messages });
});

module.exports = router;