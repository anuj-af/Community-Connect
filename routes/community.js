const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community');
const {isLoggedIn, validateCommunity} = require('../middleware');
const Community = require('../models/community');
const Message = require('../models/message');

router.route('/new')
    .get(isLoggedIn,communityController.newForm)
    .post(validateCommunity,communityController.createCommunity);

router.delete('/:id',isLoggedIn,communityController.deleteCommunity);

router.get('/:id/' ,communityController.showCommunity);

router.route('/:id/edit')
    .get(isLoggedIn,communityController.editForm)
    .patch(validateCommunity,communityController.updateCommunity);

// Join a community
router.post('/:id/join', async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const community = await Community.findById(id);
    community.members.push(userId);
    await community.save();
    res.redirect(`/community/${community._id}`);
});

// Send a message
router.post('/:id/messages', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    const message = new Message({ content, sender: userId, community: id });

    try {
        await message.save();
        const populatedMessage = await message.populate('sender');
        console.log(populatedMessage);
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
    const community = await Community.findById(id).populate('members');
    const messages = await Message.find({ community: id }).populate('sender');
    console.log(community, messages);
    res.render('chat/chat', { community, messages });
});


module.exports = router;