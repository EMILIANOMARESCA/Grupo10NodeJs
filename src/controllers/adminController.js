const connect = require('../config/conn'); // Asegúrate de que la ruta sea correcta
const path = require('path');
const fs = require('fs');

const adminControllers = {
	
	admin: async (req, res) => {
		console.log('Controlador de administración ejecutado');
		let sqlProducts = 'SELECT product_id, sku, TRIM(product_name) AS product_name, TRIM(licence_name) as licence_name FROM funko_test.product INNER JOIN funko_test.licence ON funko_test.licence.licence_id = funko_test.product.licence_id ORDER BY product_id'
		try {
            const db = await connect(); // Establecer la conexión
			const [results] = await db.query(sqlProducts);
            console.log('Resultados de la consulta:', results);
            res.render('admin', { products: results });
		} catch (error) {
            console.error('Error al obtener productos:', error);
            return res.status(500).render('error', { error: 'Error al obtener productos' });
        }
    },		

    getCreate: async (req, res) => {
        let sqlCategories = "SELECT category_name FROM funko_test.category";
        let sqlLicences = "SELECT licence_name FROM funko_test.licence";

        try {
            const db = await connect(); // Establecer la conexión

            // Ejecutar la consulta para categorías
            const [categories] = await db.query(sqlCategories);

            // Ejecutar la consulta para licencias
            const [licences] = await db.query(sqlLicences);

            // Renderizar la plantilla EJS con los datos obtenidos
            res.render('create', { categories: categories, licences: licences });
        } catch (error) {
            console.error('Error en el controlador getCreate:', error);
            return res.status(500).send('Error al procesar la solicitud');
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

        const sqlLicence = "SELECT licence_id FROM funko_test.licence WHERE licence_name = ?";
        const sqlCategory = "SELECT category_id FROM funko_test.category WHERE category_name = ?";

        try {
            const db = await connect(); // Establecer la conexión

            // Obtener el ID de licencia
            const [licenceResults] = await db.query(sqlLicence, [licencia]);
            if (licenceResults.length === 0) {
                return res.status(400).send('Licencia no encontrada');
            }
            const licence_id = licenceResults[0].licence_id;

            // Obtener el ID de categoría
            const [categoryResults] = await db.query(sqlCategory, [categoria]);
            if (categoryResults.length === 0) {
                return res.status(400).send('Categoría no encontrada');
            }
            const category_id = categoryResults[0].category_id;

            // Insertar el producto
            let sqlInsertProd = "INSERT INTO funko_test.product (product_name, product_description, price, stock, discount, sku, dues, image_front, image_back, create_time, licence_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            await db.query(sqlInsertProd, [product_name, product_description, price, stock, discount, sku, dues, image_front, image_back, create_time, licence_id, category_id]);

			res.redirect('/admin'); // Redirigir al usuario a la página de administración
        } catch (error) {
            console.error('Error al crear el producto:', error);
            return res.status(500).send('Error al procesar la solicitud');
        }
    },
	
    
   //Procedimiento para editar un producto del sitio
    getEdit: async (req, res) => {
        const productId = req.params.id; // Obtiene el ID del producto desde los parámetros de la solicitud
        console.log('Product ID:', productId); // Verifica el ID del producto, para ver si se ve

        // Valida si el productId es inválido o no es un número
        if (!productId || isNaN(productId)) {
            return res.status(400).send('ID de producto no válido');
        }

        // Consulta SQL para obtener los detalles del producto por su ID con sus tablas de union a licence y category
        let sqlGetProduct = "SELECT product_id, product_name, product_description, price, stock, discount, sku, CASE dues WHEN 3 THEN '3 CUOTAS SIN INTERES' WHEN 6 THEN '6 CUOTAS SIN INTERES' WHEN 9 THEN '9 CUOTAS CON INTERES' WHEN 12 THEN '12 CUOTAS CON INTERES' END 'dues', image_front, image_back, licence_name, category_name FROM funko_test.product INNER JOIN funko_test.licence ON funko_test.product.licence_id = funko_test.licence.licence_id INNER JOIN funko_test.category ON funko_test.product.category_id = funko_test.category.category_id WHERE product_id = ?";
        let sqlCategories = "SELECT category_name FROM funko_test.category";
        let sqlLicences = "SELECT licence_name FROM funko_test.licence";

        try {
            const db = await connect(); // Establece la conexión a la BD

            // Ejecuta la consulta para obtener los detalles del producto por su ID
            const [productDetails] = await db.query(sqlGetProduct, [productId]);
            // Ejecutar la consulta para categorías
            const [categories] = await db.query(sqlCategories);
            // Ejecutar la consulta para licencias
            const [licences] = await db.query(sqlLicences);

            // Verifica si no se encontró ningún producto con el ID proporcionado
            if (productDetails.length === 0) {
                return res.status(404).render('error', { message: 'El producto no fue encontrado' });
            }

            // Renderizamos edit.ejs con los detalles del producto obtenido
            res.render('edit', { product: productDetails[0], categories: categories, licences: licences });
        } catch (error) {
            console.error('Error al obtener detalles del producto:', error);
            return res.status(500).send('Error al obtener detalles del producto');
        }
    },

    //Procedimiento para salvar los cambios del getEdit
    postEdit: async (req, res) => {
        const productId = req.params.id; // Obtiene el ID del producto desde los parámetros de la solicitud
        console.log('Product ID:', productId); // Verifica el ID del producto a ver si es correcto y se ve
        console.log(req.body);
    
        // Valida si el productId es inválido o no es un número
        if (!productId || isNaN(productId)) {
            return res.status(400).send('ID de producto no válido');
        }
    
        // Se extraen los datos actualizados del cuerpo de la solicitud
        const { product_name, product_description, sku, price, stock, discount, dues, categoria, licencia } = req.body;
    
        // Validación básica
        if (!product_name || !product_description || !sku || !price || isNaN(price) || !stock || isNaN(stock)) {
            return res.status(400).send('Datos inválidos.');
        }
    
        try {
            const db = await connect(); // Establece la conexión a la BD
    
            // Obtener category_id basado en categoria
            const categoryQuery = "SELECT category_id FROM funko_test.category WHERE category_name = ?";
            const [[categoryResult]] = await db.query(categoryQuery, [categoria]);
            const category_id = categoryResult ? categoryResult.category_id : null;         

            // Verifica si se encontró un category_id
            if (!category_id) {
                return res.status(400).send('Categoría no encontrada.');
            }
    
            // Obtener licence_id basado en licencia
            const licenceQuery = "SELECT licence_id FROM funko_test.licence WHERE licence_name = ?";
            const [[licenceResult]] = await db.query(licenceQuery, [licencia]);
            const licence_id = licenceResult ? licenceResult.licence_id : null;
    
            // Verifica si se encontró un licence_id
            if (!licence_id) {
                return res.status(400).send('Licencia no encontrada.');
            }
    
            // Preparar la consulta de actualización del producto
            const sqlUpdateProduct = `UPDATE funko_test.product SET product_name = ?, product_description = ?, price = ?, stock = ?, discount = ?, sku = ?, dues = ?, licence_id = ?, category_id = ? WHERE product_id = ?`;
    
            // Ejecutar la consulta de actualización
            await db.query(sqlUpdateProduct, [
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
    
            res.redirect('/admin'); // Redirige al usuario a la página de administración después de la actualización exitosa
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            return res.status(500).send('Error al procesar la solicitud de actualización');
        }
    },
    
    
    deleteEdit: async (req, res) => {
        const productId = req.params.id; // Obtener el ID del producto a eliminar desde los parámetros de la solicitud
        console.log('Product ID:', productId); // Verificar el ID del producto

        // Validar si el productId es inválido o no es un número
        if (!productId || isNaN(productId)) {
            return res.status(400).send('ID de producto no válido');
        }

        // Consulta SQL para eliminar el producto de la base de datos
        const sqlDeleteProduct = 'DELETE FROM funko_test.product WHERE product_id = ?';

        try {
            const db = await connect(); // Establecer la conexión

            // Ejecutar la consulta de eliminación con el ID del producto
            const [results] = await db.query(sqlDeleteProduct, [productId]);

            // Verificar si no se encontró ningún producto con el ID proporcionado para eliminar
            if (results.affectedRows === 0) {
                return res.status(404).send('El producto no fue encontrado');
            }

            // Si se eliminó correctamente, muestra la pagina sin el producto eliminado
            res.redirect('/admin');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            return res.status(500).send('Error al eliminar el producto');
        }
    },
	
    searchProducts: async (req, res) => {
        let searchTerm = req.query.term;
        console.log("Término de búsqueda recibido:", searchTerm);

        let searchPattern = `%${searchTerm}%`;
        console.log("Patrón de búsqueda:", searchPattern);
        let sqlSearch = `SELECT product_id, sku, TRIM(product_name) AS product_name, TRIM(licence_name) as licence_name FROM funko_test.product INNER JOIN funko_test.licence ON funko_test.licence.licence_id = funko_test.product.licence_id WHERE product_name LIKE ? OR sku LIKE ? OR licence_name LIKE ? ORDER BY product_id`;

        try {
            const db = await connect(); // Establecer la conexión

            const [results] = await db.query(sqlSearch, [searchPattern, searchPattern, searchPattern]);
            res.json(results);
        } catch (error) {
            console.error('Error al buscar productos:', error);
            return res.status(500).send('Error al buscar productos');
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
