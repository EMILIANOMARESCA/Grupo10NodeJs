const express = require('express');
const router = express.Router(); //preparo el modulo de rutas de express para crear rutas
const shopControllers = require('../controllers/shopController');


//Creo las rutas que necesito para el shop
router.get('/', shopControllers.shop );
router.get('/item/:id', shopControllers.getItem);
router.post('/item/:id/add', shopControllers.addItem );
router.get('/cart', shopControllers.viewCart);
router.get('/product/:id',shopControllers.product);
router.post('/cart', shopControllers.checkout );
// router.post('/cart/remove/:productId', shopControllers.removeCartItem);
// router.post('/cart/update', shopControllers.updateCartItem);


//Exporto el modulo Routers
module.exports = router;