const express = require('express');
const session = require('express-session');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();

const app = express();
const mainRoutes = require('./src/routes/mainRoutes');
const shopRoutes = require('./src/routes/shopRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const authRoutes = require('./src/routes/authRoutes');

const port = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);

// Configuración de express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 2
    }
  })
);

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));

// Middlewares de parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Habilitar PUT y DELETE
app.use(methodOverride('_method'));

// Rutas
app.use('/', mainRoutes);
app.use('/shop', shopRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('404');
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled application error:', error);
  res.status(500).render('error', {
    error: 'Ocurrió un error inesperado. Intentá nuevamente más tarde.'
  });
});

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
}

module.exports = app;
