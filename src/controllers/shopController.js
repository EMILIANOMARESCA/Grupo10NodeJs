const path = require('path');
//const conn = require('../config/conn'); // Asegúrate de que la ruta sea correcta
const { getAll } = require('../models/product.models');
require('dotenv').config();

const shopControllers = {
    /* shop: (req, res) => res.send('Route for Shop View'), */
    
    shop: async (req, res) => {
        
        const dbdata = await getAll();

        if(dbdata.error)
        {
            res.render(path.resolve(__dirname, '../views/components/404.ejs'),
            {
                view:{
                    title: 'Shop'
                }
            })
        }
        else
        {
            res.render(path.resolve(__dirname, '../views/shop/shop.ejs'),
            {
                view:{
                    title: 'Shop'
                },
                items: dbdata
            });
        }
        
    },
    getItem: (req, res) => res.send('Route for find and retrieve a product from an ID View'),
    addItem: (req, res) => res.send('Route for add the current item to the Shop  cart View'),
    viewCart: (req, res) => res.send('Route for Cart View'),
    checkout: (req, res) => res.send('Route for got to checkout View')

}

//Exporto el modulo Controllers
module.exports = shopControllers;