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

// Folow a community
router.post('/:id/follow',isLoggedIn,communityController.follow);

module.exports = router;