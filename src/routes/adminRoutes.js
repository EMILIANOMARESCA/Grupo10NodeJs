const express = require('express');
const router = express.Router(); //preparo el modulo de rutas de express para crear rutas
const adminControllers = require('../controllers/adminController');


//Creo las rutas que necesito para el admin
router.get('/', adminControllers.admin);
router.get('/create', adminControllers.getCreate);
router.post('/create', adminControllers.postCreate);
router.get('/edit/:id', adminControllers.getEdit);
router.put('/edit/:id', adminControllers.putEdit);
router.delete('/edit/:id', adminControllers.deleteEdit);



//Exporto el modulo Routers
module.exports = router;