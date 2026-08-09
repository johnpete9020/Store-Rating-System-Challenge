const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400).required(),
  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[!@#\$%\^&\*]).{8,16}$/)
    .required()
    .messages({
      'string.pattern.base': 'Password must be 8-16 characters, include at least one uppercase letter and one special character.'
    })
});

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { validateUser };