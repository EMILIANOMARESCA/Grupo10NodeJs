const express = require('express');
const router = express.Router(); //preparo el modulo de rutas de express para crear rutas
const authControllers = require('../controllers/authController');


//Creo las rutas que necesito para el autenticador
router.get('/login', authControllers.getLogin);
router.post('/login', authControllers.postLogin);
router.get('/register', authControllers.getRegister );
router.post('/register', authControllers.postRegister);
router.get('/logout', authControllers.postRegister);


//Exporto el modulo Routers
module.exports = router;