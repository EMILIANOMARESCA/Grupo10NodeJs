const mainControllers = {
    home: (req, res) => res.send('Route for Home View from Controller'),
    contact: (req, res) => res.send('Route for Contact View'),
    about: (req, res) => res.send('Route for About View'),
    faqs: (req, res) => es.send('Route for Faqs View')
}

//Exporto el modulo Controllers
module.exports = mainControllers;