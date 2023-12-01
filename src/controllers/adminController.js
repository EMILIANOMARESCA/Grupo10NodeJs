const db = require('../config/conn'); // Asegúrate de que la ruta sea correcta
const cquery = 'SELECT product_id, sku, product_name, licence_name FROM funko_test.product INNER JOIN funko_test.licence ON funko_test.licence.licence_id = funko_test.product.licence_id ORDER BY product_id'
const path = require('path');
const fs = require('fs');
const adminControllers = {
	
	admin: (req, res) => {
		console.log('Controlador de administración ejecutado');
		db.query(cquery, (error, results) => {
			if (error) {
				console.error('Error al obtener productos:', error);
				return res.send('Error al obtener productos');
			}
			console.log('Resultados de la consulta:', results);
			res.render('admin', { products: results });
		});
	},

    getCreate: (req, res) => res.send('Route for Create a product View'),
    
	postCreate: (req, res) => res.send('Route for Create a product View'),
    
	getEdit: (req, res) => res.send('Route for Edit a product View'),
    
	putEdit: (req, res) => res.send('Route for Edit a product View'),
    
	deleteEdit: (req, res) => res.send('Route for Delete a product View'),
	
	// Nueva función para servir páginas HTML dinámicas
    servePage: (req, res) => {
        const pageName = req.params.page;
        const filePath = path.join(__dirname, `../../public/pages/admin/${pageName}.html`);
        console.log(filePath);
		// Verifica si el archivo HTML existe
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).send('Página no encontrada'); // Maneja el caso en que la página no exista
        }
    }
};

// Exporto el módulo Controllers
module.exports = adminControllers;
