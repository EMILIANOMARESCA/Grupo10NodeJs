const adminControllers = {
    admin: (req, res) => res.send('Route for Admin View'),
    getCreate: (req, res) => res.send('Route for Create a product View'),
    postCreate: (req, res) => res.send('Route for Create a product View'),
    getEdit: (req, res) => res.send('Route for Edit a product View'),
    putEdit: (req, res) => res.send('Route for Edit a product View'),
    deleteEdit: (req, res) => res.send('Route for Delete a product View')
}

//Exporto el modulo Controllers
module.exports = adminControllers;