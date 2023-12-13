function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        // Redirigir al usuario a la página de login con un mensaje
        res.redirect('/auth/login');
    }
}

module.exports.isAuthenticated = isAuthenticated;
