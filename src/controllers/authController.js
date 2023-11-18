const authControllers = {
    getLogin: (req, res) => res.send('Route for Login View from Controller'),
    postLogin: (req, res) => res.send('Route for user login View'),
    getRegister: (req, res) => res.send('Route for Register an user View'),
    postRegister: (req, res) => res.send('Route for Register an user View')
}

//Exporto el modulo Controllers
module.exports = authControllers;