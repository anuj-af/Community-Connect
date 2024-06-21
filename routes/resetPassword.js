const express = require('express');
const crypto = require('crypto');
const User = require('../models/user');
const { sendPasswordResetEmail } = require('../utils/nodemailer');
const router = express.Router();

// Route to request password reset
router.post('/forgot', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        // req.flash('error', 'No account with this email address exists.');
        console.log('error', 'No account with this email address exists.');
        return res.redirect('/user/forgot');
    }

    // Generate a token and set expiration time
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send the email
    console.log(email, token);
    await sendPasswordResetEmail(email, token);
    // req.flash('info', `An e-mail has been sent to ${email} with further instructions.`);
    console.log('info', `An e-mail has been sent to ${email} with further instructions.`);
    res.redirect('/user/forgot');
});

// Route to render forget form
router.get('/forgot', (req,res) => {
    res.render('password/forgot');
})

// Route to render reset form
router.get('/reset/:token', async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        console.log('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/user/forgot');
    }
    res.render('password/reset', { token: req.params.token });
});

// Route to handle password reset
router.post('/reset/:token', async (req, res) => {
    const { password, confirm } = req.body;
    if (password !== confirm) {
        console.log('error', 'Passwords do not match.');
        return res.redirect(`/user/reset/${req.params.token}`);
    }

    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        console.log('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/user/forgot');
    }

    user.setPassword(password, async (err) => {
        if (err) {
            console.log('error', 'An error occurred while resetting your password.');
            return res.redirect('/user/forgot');
        }
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        req.logIn(user, (err) => {
            console.log('success', 'Your password has been changed.');
            res.redirect('/');
        });
    });
});

module.exports = router;
