const express = require('express');
const path = require('path');
const app = express();
const mainRoutes = require('./src/routes/mainRoutes');
const shopRoutes = require('./src/routes/shopRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const authRoutes = require('./src/routes/authRoutes');
const methodOverride = require('method-override');
require('dotenv').config(); //Requerimos la dependencia .env
const multer = require('multer');



//Leemos la constante
const PORT = process.env.PORT;


//Creo la carpeta public
app.use(express.static('public'));

//Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));

//Multer, implementacion
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads'); // Define la carpeta donde se guardarán los archivos subidos
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()); // Define el nombre del archivo
    }
  });
const upload = multer({ storage });


//Convertimos los datos entrantes a formato que entiende el servidor mediante middlewares
app.use(express.urlencoded());
app.use(express.json());


//Usamos override para habilitar los metodos PUT y DELETE
app.use(methodOverride('_method'));


//importo las rutas desde Routes
app.use('/', mainRoutes);
app.use('/shop', shopRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

//Middleware para manejar el error 404

app.use((req, res, next) => {
    console.log(`Ruta solicitada: ${req.url}`);
    next();
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal en el servidor!');
});

app.use((req, res, next) => {
    res.status(404).send('Recurso no encontrado');
});

//definimos puerto para el servidor
app.listen(4000, () => console.log("Servidor corriendo en http://localhost:4000")); 
