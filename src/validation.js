const Joi = require('@hapi/joi');

const registerValidation = data => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().min(10).max(11),
    coordinates: Joi.array().ordered(
      Joi.number().min(-90).max(90).required(),
      Joi.number().min(-180).max(180).required()
    ).description("Please use this format [ longitude, latitude ]"),
  });

  return schema.validate(data);
};

const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const forgotPasswordValidation = data => {
  const schema = Joi.object({
    email: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const resetPasswordValidation = data => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.forgotPasswordValidation = forgotPasswordValidation;
module.exports.resetPasswordValidation = resetPasswordValidation;
