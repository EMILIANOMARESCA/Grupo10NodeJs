const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authControllers = require('../controllers/authController');
const {
  validateLogin,
  validateRegister,
  handleValidation
} = require('../middlewares/validator');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Demasiados intentos, por favor intentá nuevamente más tarde.'
});

router.get('/login', authControllers.getLogin);
router.post('/login', authLimiter, validateLogin, handleValidation, authControllers.postLogin);
router.get('/register', authControllers.getRegister);
router.post('/register', authLimiter, validateRegister, handleValidation, authControllers.postRegister);
router.get('/logout', authControllers.logout);

module.exports = router;
