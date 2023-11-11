const express = require('express');
const app = express();
const mainRoutes = require('./src/routes/mainRoutes');
const shopRoutes = require('./src/routes/shopRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const authRoutes = require('./src/routes/authRoutes');


//Creo la carpeta public
app.use(express.static('public')); 


//importo las rutas desde Routes
app.use('/', mainRoutes);
app.use('/shop', shopRoutes);
app.use('/admin', adminRoutes);
app.use('/admin', authRoutes);


//definimos puerto para el servidor
app.listen(4000, () => console.log("Servidor corriendo en http://localhost:4000")); 
