const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community');

router.route('/new')
    .get(communityController.newForm)
    .post(communityController.createCommunity);

router.delete('/:id', communityController.deleteCommunity);

router.get('/:id/show', communityController.showCommunity);

router.route('/:id/edit')
    .get(communityController.editForm)
    .patch(communityController.updateCommunity);


module.exports = router;