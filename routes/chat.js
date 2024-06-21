const express = require('express');
const chatController = require('../controllers/chat');
const { isLoggedIn, followsCommunity } = require('../middleware');
const router = express.Router({mergeParams:true})


// Send a message
router.post('/messages',isLoggedIn,followsCommunity,chatController.saveMessage);


// Get messages
router.get('/messages',isLoggedIn,followsCommunity,chatController.getMessage);


// Get community chat page
router.get('/chat',isLoggedIn,followsCommunity,chatController.renderChat);

module.exports = router;