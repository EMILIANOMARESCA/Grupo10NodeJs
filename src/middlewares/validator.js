const { body, validationResult } = require('express-validator');

const validateLogin = [
  body('email').trim().isEmail().withMessage('Ingresá un email válido.'),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres.')
];

const validateRegister = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio.'),
  body('lastname').trim().notEmpty().withMessage('El apellido es obligatorio.'),
  body('email').trim().isEmail().withMessage('Ingresá un email válido.'),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres.')
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    errors: errors.array().map((error) => ({
      field: error.path,
      message: error.msg
    }))
  });
};

module.exports = {
  validateLogin,
  validateRegister,
  handleValidation
};
