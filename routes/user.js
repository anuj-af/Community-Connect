const express=require('express');
const router=express.Router();
const passport=require('passport');
const localStreategy=require('passport-local');
const userController=require('../controllers/user');

const User = require('../models/user');
const { storeReturnTo } = require('../middleware');

router.route('/register')
    .get(userController.renderRegister)
    .post(userController.register)

router.route('/login')
    .get(userController.renderLogin)
    .post(storeReturnTo,passport.authenticate('local', { failureRedirect:'/user/login', failureMessage: true }),userController.login)

router.get('/:userId/profile',userController.getProfile)

router.route('/:userId/profile/edit')
    .get(userController.renderProfileEdit)
    .patch(userController.editProfile)

router.get('/logout',userController.logout)

module.exports=router;