const { getConnection } = require('../config/conn'); // Asegúrate de que la ruta sea correcta
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const adminControllers = {
	
	admin: async (req, res) => {
		console.log('Controlador de administración ejecutado');
		let sqlProducts = `SELECT product_id, sku, TRIM(product_name) AS product_name, TRIM(licence_name) as licence_name FROM ${process.env.DB}.product INNER JOIN ${process.env.DB}.licence ON ${process.env.DB}.licence.licence_id = ${process.env.DB}.product.licence_id ORDER BY product_id`;

		let connection;
		try {
			connection = await getConnection();
			const [results] = await connection.query(sqlProducts);
			console.log('Resultados de la consulta:', results);
			res.render('admin', { products: results });
		} catch (error) {
			console.error('Error al obtener productos:', error);
			return res.status(500).render('error', { error: 'Error al obtener productos' });
		} finally {
			if (connection) {
				connection.release();
			}
		}
	},

	getCreate: async (req, res) => {
		let sqlCategories = `SELECT category_name FROM ${process.env.DB}.category`;
		let sqlLicences = `SELECT licence_name FROM ${process.env.DB}.licence`;

		let connection;
		try {
			connection = await getConnection();
			const [categories] = await connection.query(sqlCategories);
			const [licences] = await connection.query(sqlLicences);
			res.render('create', { categories: categories, licences: licences });
		} catch (error) {
			console.error('Error en el controlador getCreate:', error);
			return res.status(500).send('Error al procesar la solicitud');
		} finally {
			if (connection) {
				connection.release();
			}
		}
	},

    postCreate: async (req, res) => {
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

        const sqlLicence = `SELECT licence_id FROM ${process.env.DB}.licence WHERE licence_name = ?`;
        const sqlCategory = `SELECT category_id FROM ${process.env.DB}.category WHERE category_name = ?`;

        let connection;
        try {
            connection = await getConnection();

            // Obtener el ID de licencia
            const [licenceResults] = await connection.query(sqlLicence, [licencia]);
            if (licenceResults.length === 0) {
                return res.status(400).send('Licencia no encontrada');
            }
            const licence_id = licenceResults[0].licence_id;

            // Obtener el ID de categoría
            const [categoryResults] = await connection.query(sqlCategory, [categoria]);
            if (categoryResults.length === 0) {
                return res.status(400).send('Categoría no encontrada');
            }
            const category_id = categoryResults[0].category_id;

            // Insertar el producto
            let sqlInsertProd = `INSERT INTO ${process.env.DB}.product (product_name, product_description, price, stock, discount, sku, dues, image_front, image_back, create_time, licence_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            await connection.query(sqlInsertProd, [product_name, product_description, price, stock, discount, sku, dues, image_front, image_back, create_time, licence_id, category_id]);

            res.redirect('/admin'); // Redirigir al usuario a la página de administración
        } catch (error) {
            console.error('Error al crear el producto:', error);
            return res.status(500).send('Error al procesar la solicitud');
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },
	
    
   //Procedimiento para editar un producto del sitio
    getEdit: async (req, res) => {
        const productId = req.params.id;

        if (!productId || isNaN(productId)) {
            return res.status(400).send('ID de producto no válido');
        }

        let sqlGetProduct = `SELECT product_id, product_name, product_description, price, stock, discount, sku, CASE dues WHEN 3 THEN '3 CUOTAS SIN INTERES' WHEN 6 THEN '6 CUOTAS SIN INTERES' WHEN 9 THEN '9 CUOTAS CON INTERES' WHEN 12 THEN '12 CUOTAS CON INTERES' END 'dues', image_front, image_back, licence_name, category_name FROM ${process.env.DB}.product INNER JOIN ${process.env.DB}.licence ON ${process.env.DB}.product.licence_id = ${process.env.DB}.licence.licence_id INNER JOIN ${process.env.DB}.category ON ${process.env.DB}.product.category_id = ${process.env.DB}.category.category_id WHERE product_id = ?`;
        let sqlCategories = `SELECT category_name FROM ${process.env.DB}.category`;
        let sqlLicences = `SELECT licence_name FROM ${process.env.DB}.licence`;

        let connection;
        try {
            connection = await getConnection();
            const [productDetails] = await connection.query(sqlGetProduct, [productId]);
            const [categories] = await connection.query(sqlCategories);
            const [licences] = await connection.query(sqlLicences);

            if (productDetails.length === 0) {
                return res.status(404).render('error', { message: 'El producto no fue encontrado' });
            }

            res.render('edit', { product: productDetails[0], categories: categories, licences: licences });
        } catch (error) {
            console.error('Error al obtener detalles del producto:', error);
            return res.status(500).send('Error al obtener detalles del producto');
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    //Procedimiento para salvar los cambios del getEdit
    postEdit: async (req, res) => {
        const productId = req.params.id;
        const { product_name, product_description, sku, price, stock, discount, dues, categoria, licencia } = req.body;

        if (!productId || isNaN(productId)) {
            return res.status(400).send('ID de producto no válido');
        }

        if (!product_name || !product_description || !sku || !price || isNaN(price) || !stock || isNaN(stock)) {
            return res.status(400).send('Datos inválidos.');
        }

        let connection;
        try {
            connection = await getConnection();

            const categoryQuery = `SELECT category_id FROM ${process.env.DB}.category WHERE category_name = ?`;
            const [[categoryResult]] = await connection.query(categoryQuery, [categoria]);
            const category_id = categoryResult ? categoryResult.category_id : null;         

            if (!category_id) {
                return res.status(400).send('Categoría no encontrada.');
            }

            const licenceQuery = `SELECT licence_id FROM ${process.env.DB}.licence WHERE licence_name = ?`;
            const [[licenceResult]] = await connection.query(licenceQuery, [licencia]);
            const licence_id = licenceResult ? licenceResult.licence_id : null;

            if (!licence_id) {
                return res.status(400).send('Licencia no encontrada.');
            }

            const sqlUpdateProduct = `UPDATE ${process.env.DB}.product SET product_name = ?, product_description = ?, price = ?, stock = ?, discount = ?, sku = ?, dues = ?, licence_id = ?, category_id = ? WHERE product_id = ?`;

            await connection.query(sqlUpdateProduct, [
                product_name,
                product_description,
                price,
                stock,
                discount,
                sku,
                dues,
                licence_id,
                category_id,
                productId
            ]);

            res.redirect('/admin');
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            return res.status(500).send('Error al procesar la solicitud de actualización');
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },
    
    
    deleteEdit: async (req, res) => {
        const productId = req.params.id;

        if (!productId || isNaN(productId)) {
            return res.status(400).send('ID de producto no válido');
        }

        const sqlDeleteProduct = `DELETE FROM ${process.env.DB}.product WHERE product_id = ?`;

        let connection;
        try {
            connection = await getConnection();

            const [results] = await connection.query(sqlDeleteProduct, [productId]);

            if (results.affectedRows === 0) {
                return res.status(404).send('El producto no fue encontrado');
            }

            res.redirect('/admin');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            return res.status(500).send('Error al eliminar el producto');
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },
	
    searchProducts: async (req, res) => {
        let searchTerm = req.query.term;
        console.log("Término de búsqueda recibido:", searchTerm);

        let searchPattern = `%${searchTerm}%`;
        console.log("Patrón de búsqueda:", searchPattern);
        let sqlSearch = `SELECT product_id, sku, TRIM(product_name) AS product_name, TRIM(licence_name) as licence_name FROM ${process.env.DB}.product INNER JOIN ${process.env.DB}.licence ON ${process.env.DB}.licence.licence_id = ${process.env.DB}.product.licence_id WHERE product_name LIKE ? OR sku LIKE ? OR licence_name LIKE ? ORDER BY product_id`;

        let connection;
        try {
            connection = await getConnection();

            const [results] = await connection.query(sqlSearch, [searchPattern, searchPattern, searchPattern]);
            res.json(results);
        } catch (error) {
            console.error('Error al buscar productos:', error);
            return res.status(500).send('Error al buscar productos');
        } finally {
            if (connection) {
                connection.release();
            }
        }
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