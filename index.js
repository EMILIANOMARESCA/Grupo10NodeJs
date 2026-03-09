const express = require('express');
const session = require('express-session');
const path = require('path');
const methodOverride = require('method-override');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const mainRoutes = require('./src/routes/mainRoutes');
const shopRoutes = require('./src/routes/shopRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const authRoutes = require('./src/routes/authRoutes');

const port = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

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

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));

app.use('/', mainRoutes);
app.use('/shop', shopRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

app.use((req, res) => {
  res.status(404).render('404', {
    view: {
      title: '404'
    }
  });
});

app.use((error, req, res, _next) => {
  console.error('Unhandled application error:', error);
  res.status(500).render('error', {
    error: 'Ocurrió un error inesperado. Intentá nuevamente más tarde.'
  });
});

if (require.main === module && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
}

module.exports = app;
