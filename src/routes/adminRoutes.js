const express = require('express');
const router = express.Router(); //preparo el modulo de rutas de express para crear rutas
const adminControllers = require('../controllers/adminController');
const path = require('path');
const multer = require('multer');
const isAuthenticated = require('../middlewares/autenticar').isAuthenticated;


// Configuración de Multer para la carga de imágenes
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/img/uploads/'); // Asegúrate de que este directorio exista
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Usando timestamp para evitar nombres duplicados
    }
});

const upload = multer({ storage: storage });

router.get('/', isAuthenticated, adminControllers.admin);
router.get('/create', isAuthenticated, adminControllers.getCreate);
router.post('/create', isAuthenticated, upload.array('images', 2), adminControllers.postCreate);
router.get('/edit/:id', isAuthenticated, adminControllers.getEdit);
router.post('/edit/:id', isAuthenticated, adminControllers.postEdit);
router.post('/delete/:id', isAuthenticated, adminControllers.deleteEdit);
router.get('/search-products', isAuthenticated, adminControllers.searchProducts);


// Ruta dinámica para servir páginas HTML estaticas
router.get('/:page', adminControllers.servePage);

//Exporto el modulo Routers
module.exports = router;