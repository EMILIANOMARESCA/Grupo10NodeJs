const { getConnection } = require('../config/conn'); // Asegúrate de que la ruta sea correcta
require('dotenv').config();

const mainControllers = {

    index: async (req, res) => {
        console.log('Controlador de main ejecutado');
        let sqlProducts = `SELECT product_id, image_front, image_back, licence_name, product_name, price, CASE dues WHEN 3 THEN '3 CUOTAS SIN INTERES' WHEN 6 THEN '6 CUOTAS SIN INTERES' WHEN 9 THEN '9 CUOTAS CON INTERES' WHEN 12 THEN '12 CUOTAS CON INTERES' END 'dues' FROM ${process.env.DB}.product INNER JOIN ${process.env.DB}.licence ON ${process.env.DB}.licence.licence_id = ${process.env.DB}.product.licence_id ORDER BY product_id DESC LIMIT 5`;
        let sqlLicences = `SELECT licence_id, licence_name, licence_description, licence_image FROM ${process.env.DB}.licence ORDER BY licence_id`;

        let connection;
        try {
            connection = await getConnection();
            const [results] = await connection.query(sqlProducts);
            console.log('Productos para el slider:', results);
            const [licencias] = await connection.query(sqlLicences);
            console.log('Licencias para nuevos ingresos:', licencias);
            res.render('index', { productos: results, licencias : licencias });
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return res.status(500).render('error', { error: 'Error al obtener productos' });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },
    
    contact: (req, res) => res.render(path.resolve(__dirname, '../views/components/contact.ejs'),
    {
        view:{
            title: 'Contacto'
        }
    }),
    
    about: (req, res) => res.send('Route for About View'),
    faqs: (req, res) => res.send('Route for Faqs View')
};

module.exports = mainControllers;
