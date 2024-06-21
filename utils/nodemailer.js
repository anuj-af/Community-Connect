const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

const sendPasswordResetEmail = (to, token) => {
    const resetLink = `http://localhost:3000/user/reset/${token}`;
    const mailOptions = {
        to,
        from: process.env.GMAIL_USER,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
              `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
              `${resetLink}\n\n` +
              `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };
