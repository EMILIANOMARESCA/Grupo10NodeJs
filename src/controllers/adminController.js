const db = require('../config/conn'); // Asegúrate de que la ruta sea correcta
//const sqlProducts = 'SELECT product_id, sku, TRIM(product_name) AS product_name, TRIM(licence_name) as licence_name FROM funko_test.product INNER JOIN funko_test.licence ON funko_test.licence.licence_id = funko_test.product.licence_id ORDER BY product_id'
const path = require('path');
const fs = require('fs');

const adminControllers = {
	
	admin: (req, res) => {
		console.log('Controlador de administración ejecutado');
		let sqlProducts = 'SELECT product_id, sku, TRIM(product_name) AS product_name, TRIM(licence_name) as licence_name FROM funko_test.product INNER JOIN funko_test.licence ON funko_test.licence.licence_id = funko_test.product.licence_id ORDER BY product_id'
		db.query(sqlProducts, (error, results) => {
			if (error) {
				console.error('Error al obtener productos:', error);
                // En caso de error, puedes enviar un mensaje de error al cliente
				return res.status(500).render('error', { error: 'Error al obtener productos' });
				//console.error('Error al obtener productos:', error);
				//return res.send('Error al obtener productos');
			}
			console.log('Resultados de la consulta:', results);
			res.render('admin', { products: results });
		});
	},

	getCreate: (req, res) => {
        // Consultas para obtener categorías y licencias
        let sqlCategories = "SELECT category_name FROM funko_test.category";
        let sqlLicences = "SELECT licence_name FROM funko_test.licence";

        // Ejecutar la consulta para categorías
        db.query(sqlCategories, (error, categories) => {
            if (error) {
                console.error('Error al obtener categorías:', error);
                return res.status(500).send('Error al obtener categorías');
            }

            // Ejecutar la consulta para licencias
            db.query(sqlLicences, (error, licences) => {
                if (error) {
                    console.error('Error al obtener licencias:', error);
                    return res.status(500).send('Error al obtener licencias');
                }

                // Renderizar la plantilla EJS con los datos obtenidos
                res.render('create', { categories: categories, licences: licences });
            });
        });
    },
    
	postCreate: (req, res) => {
		const { product_name, product_description, sku, price, stock, discount, dues, categoria, licencia } = req.body;
	
		// Validación básica
		if (!product_name || !product_description || !sku || !price || isNaN(price) || !stock || isNaN(stock)) {
			return res.status(400).send('Datos inválidos.');
		}
	
		if (!req.files || req.files.length === 0) {
			return res.status(400).send('No se cargaron imágenes.');
		}
	
		const image_front = req.files[0] ? req.files[0].path : null;
		const image_back = req.files[1] ? req.files[1].path : null;
		const create_time = new Date().toISOString().slice(0, 19).replace('T', ' '); // Formato de fecha para MySQL
	
		const sqlLicence = "SELECT licence_id FROM funko_test.licence WHERE licence_name = ?";
		const sqlCategory = "SELECT category_id FROM funko_test.category WHERE category_name = ?";
	
		db.query(sqlLicence, [licencia], (error, licenceResults) => {
			if (error) {
				console.error('Error al obtener el ID de licencia:', error);
				return res.status(500).send('Error al obtener el ID de licencia');
			}
	
			if (licenceResults.length === 0) {
				return res.status(400).send('Licencia no encontrada');
			}
	
			const licence_id = licenceResults[0].licence_id;
	
			db.query(sqlCategory, [categoria], (error, categoryResults) => {
				if (error) {
					console.error('Error al obtener el ID de categoría:', error);
					return res.status(500).send('Error al obtener el ID de categoría');
				}
	
				if (categoryResults.length === 0) {
					return res.status(400).send('Categoría no encontrada');
				}
	
				const category_id = categoryResults[0].category_id;
	
				let sqlInsertProd = "INSERT INTO funko_test.product (product_name, product_description, price, stock, discount, sku, dues, image_front, image_back, create_time, licence_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
				db.query(sqlInsertProd, [product_name, product_description, price, stock, discount, sku, dues, image_front, image_back, create_time, licence_id, category_id], (error, results) => {
					if (error) {
						console.error('Error al insertar el producto:', error);
						return res.status(500).send('Error al insertar el producto');
					}
					res.send('Producto creado con éxito');
				});
			});
		});
	},
	
    
	getEdit: (req, res) => res.send('Route for Edit a product View'),
    
	putEdit: (req, res) => res.send('Route for Edit a product View'),
    
	//Lógica de la funcion que elimina un item de la BD
	deleteEdit: (req, res) => {
		const productId = req.params.id; // Obtener el ID del producto a eliminar desde los parámetros de la solicitud
		console.log('Product ID:', productId); // Verificar el ID del producto

		// Validar si el productId es inválido o no es un número
		if (!productId || isNaN(productId)) {
			return res.status(400).send('ID de producto no válido');
		}
	
		// Consulta SQL para eliminar el producto de la base de datos
		const sqlDeleteProduct = 'DELETE FROM funko_test.product WHERE product_id = ?';
	
		// Ejecutar la consulta de eliminación con el ID del producto
		db.query(sqlDeleteProduct, [productId], (error, results) => {
			if (error) {
				console.error('Error al eliminar el producto:', error);
				return res.status(500).send('Error al eliminar el producto');
			}
	
			// Verificar si no se encontró ningún producto con el ID proporcionado para eliminar
			if (results.affectedRows === 0) {
				return res.status(404).send('El producto no fue encontrado');
			}
	
			// Si se eliminó correctamente, muestra la pagina sin el producto eliminado
			res.redirect('/admin');
		});
	},
	
	searchProducts: (req, res) => {
		let searchTerm = req.query.term;
		console.log("Término de búsqueda recibido:", searchTerm); // Añade esto
	
		let searchPattern = `%${searchTerm}%`;
		console.log("Patrón de búsqueda:", searchPattern); // Y esto
		let sqlSearch = `SELECT product_id, sku, TRIM(product_name) AS product_name, TRIM(licence_name) as licence_name FROM funko_test.product INNER JOIN funko_test.licence ON funko_test.licence.licence_id = funko_test.product.licence_id WHERE product_name LIKE ? OR sku LIKE ? OR licence_name LIKE ? ORDER BY product_id`;

		db.query(sqlSearch, [searchPattern, searchPattern, searchPattern], (error, results) => {
            if (error) {
                console.error('Error al buscar productos:', error);
                return res.status(500).send('Error al buscar productos');
            }
            res.json(results);
        });
    },
	
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
