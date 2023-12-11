const connect = require('../config/conn'); // Asegúrate de que la ruta sea correcta
require('dotenv').config();

const shopControllers = {
    shop: (req, res) => res.send('Route for Shop View'),

    getItem: async (req, res) => {
        const productId = req.params.id; // Obtiene el ID del producto desde los parámetros de la solicitud
    
        // Verifica si el productId es inválido o no es un número
        if (!productId || isNaN(productId)) {
            return res.status(400).send('ID de producto no válido');
        }
    
        // Consulta SQL para obtener los detalles del producto por su ID
        let sql = `SELECT product_id, image_front, licence_name, product_name, product_description, price, 
                   CASE dues 
                     WHEN 3 THEN '3 CUOTAS SIN INTERES' 
                     WHEN 6 THEN '6 CUOTAS SIN INTERES' 
                     WHEN 9 THEN '9 CUOTAS CON INTERES' 
                     WHEN 12 THEN '12 CUOTAS CON INTERES' 
                   END 'dues' 
                   FROM ${process.env.DB}.product 
                   INNER JOIN ${process.env.DB}.licence ON ${process.env.DB}.product.licence_id = ${process.env.DB}.licence.licence_id 
                   WHERE product_id = ?`;

        let relatedProductsSql = `SELECT product_id, image_front, image_back, licence_name, product_name, product_description, price, 
                                    CASE dues 
                                    WHEN 3 THEN '3 CUOTAS SIN INTERES' 
                                    WHEN 6 THEN '6 CUOTAS SIN INTERES' 
                                    WHEN 9 THEN '9 CUOTAS CON INTERES' 
                                    WHEN 12 THEN '12 CUOTAS CON INTERES' 
                                    END 'dues' 
                                    FROM ${process.env.DB}.product  
                                    INNER JOIN ${process.env.DB}.licence ON ${process.env.DB}.product.licence_id = ${process.env.DB}.licence.licence_id 
                                    WHERE licence_name = ? AND product_id != ? `;
        

        try {
            const db = await connect(); // Establece la conexión a la base de datos
    
            // Ejecuta la consulta para obtener los detalles del producto por su ID
            const [productDetails] = await db.query(sql, [productId]);
    
            // Verifica si no se encontró ningún producto con el ID proporcionado
            if (productDetails.length === 0) {
                return res.status(404).send('Producto no encontrado');
            }
            const licenceName = productDetails[0].licence_name;
            const [relatedProducts] = await db.query(relatedProductsSql, [licenceName, productId]);
   
            // Renderiza la vista 'item.ejs' con los detalles del producto
            res.render('item', { product: productDetails[0], relatedProducts: relatedProducts });
        } catch (error) {
            console.error('Error al obtener detalles del producto:', error);
            return res.status(500).send('Error al obtener detalles del producto');
        }
    },


    addItem: (req, res) => res.send('Route for add the current item to the Shop cart View'),
    viewCart: (req, res) => res.send('Route for Cart View'),
    checkout: (req, res) => res.send('Route for got to checkout View')

}

//Exporto el modulo Controllers
module.exports = shopControllers;