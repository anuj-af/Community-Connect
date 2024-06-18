const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community');
const {isLoggedIn, validateCommunity} = require('../middleware');

router.route('/new')
    .get(isLoggedIn,communityController.newForm)
    .post(validateCommunity,communityController.createCommunity);

router.delete('/:id',isLoggedIn,communityController.deleteCommunity);

router.get('/:id/', communityController.showCommunity);

router.route('/:id/edit')
    .get(isLoggedIn,communityController.editForm)
    .patch(validateCommunity,communityController.updateCommunity);


module.exports = router;