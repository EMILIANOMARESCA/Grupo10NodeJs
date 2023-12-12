const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const mainRoutes = require('./src/routes/mainRoutes');
const shopRoutes = require('./src/routes/shopRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const authRoutes = require('./src/routes/authRoutes');
const methodOverride = require('method-override');
require('dotenv').config();
const multer = require('multer');
const bodyParser = require('body-parser');

// Configuración de express-session
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret', // Usa una variable de entorno para el secreto
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // En producción, deberías considerar usar 'true'
}));

// Resto de la configuración del servidor...

// Creo la carpeta public
app.use(express.static('public'));

// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));

// Multer, implementación
// ... Configuración de multer ...

// Convertimos los datos entrantes a formato que entiende el servidor mediante middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Usamos override para habilitar los metodos PUT y DELETE
app.use(methodOverride('_method'));

// Importo las rutas desde Routes
app.use('/', mainRoutes);
app.use('/shop', shopRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

// Middleware para manejar el error 404 y otros errores
// ... Middlewares de error ...

// Definimos puerto para el servidor
app.listen(process.env.PORT || 4000, () => console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 4000}`)); 
