const joi = require('joi');

module.exports.communitySchema = joi.object({
    name:joi.string().required(),
    description:joi.string(),
    communityProfile:joi.string().allow(null).allow('')
});


module.exports.userSchema = joi.object({
    username:joi.string().required(),
    email:joi.string().required().email(),
    password:joi.string(),
    userImage:joi.string().allow(null).allow('')
});
