const express=require('express');
const router=express.Router();
const passport=require('passport');
const localStreategy=require('passport-local');
const userConrtoller=require('../controllers/user');

router.route('/register')
    .get(userConrtoller.renderRegister)
    .post(userConrtoller.register)

router.route('/login')
    .get(userConrtoller.renderLogin)
    .post(userConrtoller.login)

router.get('/:userId/profile',userConrtoller.getProfile)

router.route('/:userId/profile/edit')
    .get(userConrtoller.renderProfileEdit)
    .patch(userConrtoller.editProfile)


module.exports=router;