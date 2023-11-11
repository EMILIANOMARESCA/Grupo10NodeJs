const express = require('express');
const router = express.Router(); //preparo el modulo de rutas de express para crear rutas
const mainControllers = require('../controllers/mainController');


//Creo las rutas que necesito
router.get('/home', mainControllers.home);
router.get('/contact', mainControllers.contact);
router.get('/about', mainControllers.about);
router.get('/faqs', mainControllers.faqs);


//Exporto el modulo Routers
module.exports = router;
