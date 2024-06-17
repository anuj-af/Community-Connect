const joi = require('joi');

module.exports.communitySchema = joi.object({
    name:joi.string().required(),
    description:joi.string(),
    profileImg:joi.string()
});


module.exports.userSchema = joi.object({
    username:joi.string().required(),
    email:joi.string().required().email(),
    password:joi.string()
});