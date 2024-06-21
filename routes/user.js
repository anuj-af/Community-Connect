const express=require('express');
const router=express.Router();
const passport=require('passport');
const localStreategy=require('passport-local');
const userController=require('../controllers/user');

const User = require('../models/user');
const { storeReturnTo, validateUser } = require('../middleware');

router.route('/register')
    .get(userController.renderRegister)
    .post(validateUser,userController.register)

router.route('/login')
    .get(userController.renderLogin)
    .post(storeReturnTo,passport.authenticate('local', { failureRedirect:'/user/login', failureMessage: true }),userController.login)
    
// GitHub Authentication Routes
router.get('/login/github',passport.authenticate('github'));
router.get('/login/github/callback',storeReturnTo,passport.authenticate('github', { failureRedirect: '/user/login' }),userController.login);

// Google Authentication Routes
router.get('/login/google', passport.authenticate('google',{ scope: ['profile', 'email'] }));
router.get('/login/google/callback',storeReturnTo,passport.authenticate('google', { failureRedirect: '/user/login' }),userController.login);

router.get('/:userId/profile',userController.getProfile)

router.route('/:userId/profile/edit')
    .get(userController.renderProfileEdit)
    .patch(validateUser,userController.editProfile)


router.get('/logout',userController.logout)

module.exports=router;