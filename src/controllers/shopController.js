const shopControllers = {
    shop: (req, res) => res.send('Route for Shop View'),
    getItem: (req, res) => res.send('Route for find and retrieve a product from an ID View'),
    addItem: (req, res) => res.send('Route for add the current item to the Shop  cart View'),
    viewCart: (req, res) => res.send('Route for Cart View'),
    checkout: (req, res) => res.send('Route for got to checkout View')

}

//Exporto el modulo Controllers
module.exports = shopControllers;