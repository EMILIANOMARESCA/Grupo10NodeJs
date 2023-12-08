const connect = require('../config/conn'); // Asegúrate de que la ruta sea correcta


const mainControllers = {

    index: async (req, res) => {
		console.log('Controlador de main ejecutado');
        let sqlProducts = "SELECT image_front, image_back, licence_name, product_name, price, CASE dues WHEN 3 THEN '3 CUOTAS SIN INTERES' WHEN 6 THEN '6 CUOTAS SIN INTERES' WHEN 9 THEN '9 CUOTAS CON INTERES' WHEN 12 THEN '12 CUOTAS CON INTERES' END 'dues' FROM funko_test.product INNER JOIN funko_test.licence ON funko_test.licence.licence_id = funko_test.product.licence_id ORDER BY product_id"
		let sqlLicences = 'SELECT licence_id, licence_name, licence_description, licence_image FROM funko_test.licence ORDER BY licence_id'
        try {
            const db = await connect(); // Establecer la conexión
			const [results] = await db.query(sqlProducts);
            console.log('Productos para el slider:', results);
            const [licencias] = await db.query(sqlLicences);
            console.log('Licencias para nuevos ingresos:', licencias);
            res.render('index', { productos: results, licencias : licencias });
		} catch (error) {
            console.error('Error al obtener productos:', error);
            return res.status(500).render('error', { error: 'Error al obtener productos' });
        }
    },
    
    contact: (req, res) => res.send('Route for Contact View'),
    about: (req, res) => res.send('Route for About View'),
    faqs: (req, res) => es.send('Route for Faqs View')
}



//Exporto el modulo Controllers
module.exports = mainControllers;