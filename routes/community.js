const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community');
const {isLoggedIn} = require('../middleware');

router.route('/new')
    .get(isLoggedIn,communityController.newForm)
    .post(communityController.createCommunity);

router.delete('/:id',isLoggedIn,communityController.deleteCommunity);

router.get('/:id/show', communityController.showCommunity);

router.route('/:id/edit')
    .get(isLoggedIn,communityController.editForm)
    .patch(communityController.updateCommunity);


module.exports = router;