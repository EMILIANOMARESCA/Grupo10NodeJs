const { getConnection } = require('../config/conn'); // Asegúrate de que la ruta sea correcta
require('dotenv').config();

const shopControllers = {
    shop: (req, res) => res.send('Route for Shop View'),

    getItem: async (req, res) => {
        const productId = req.params.id;

        if (!productId || isNaN(productId)) {
            return res.status(400).send('ID de producto no válido');
        }

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
                                    WHERE licence_name = ? AND product_id != ?`;

        let connection;
        try {
            connection = await getConnection();

            const [productDetails] = await connection.query(sql, [productId]);

            if (productDetails.length === 0) {
                return res.status(404).send('Producto no encontrado');
            }
            const licenceName = productDetails[0].licence_name;
            const [relatedProducts] = await connection.query(relatedProductsSql, [licenceName, productId]);
   
            res.render('item', { product: productDetails[0], relatedProducts: relatedProducts });
        } catch (error) {
            console.error('Error al obtener detalles del producto:', error);
            return res.status(500).send('Error al obtener detalles del producto');
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    addItem: async (req, res) => {
        const { product_id, product_name, licence_name, quantity, price, image } = req.body;
        //console.log(req.body)
        // Validaciones básicas
        if (!product_id || isNaN(quantity) || isNaN(price)) {
            return res.status(400).send('Datos de producto no válidos');
        }

        // Asegurar que la sesión del carrito existe
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Agregar o actualizar el producto en el carrito
        const existingProductIndex = req.session.cart.findIndex(item => item.product_id === product_id);
        if (existingProductIndex > -1) {
            // El producto ya está en el carrito, actualizar la cantidad
            req.session.cart[existingProductIndex].quantity += quantity;
        } else {
            // El producto es nuevo en el carrito
            req.session.cart.push({ product_id, product_name, licence_name, quantity, price, image });
        }

        // Redirigir a la vista del carrito o devolver una respuesta
        res.redirect('/shop/cart'); 
    },
    
    viewCart: (req, res) => {
        // Asegurarse de que hay un carrito en la sesión
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Calcular el total del carrito
        let subtotal = 0;
        let qtdtotal = 0;
        let envio = 0;
        let totalGeneral = 0;

        req.session.cart.forEach(item => {
            subtotal += parseInt(item.quantity, 10) * item.price;
            qtdtotal += parseInt(item.quantity, 10);
        });

        totalGeneral = subtotal + envio

        // Renderizar la vista del carrito con los datos del carrito y el total
        res.render('cart', { cart: req.session.cart, qtdtotal: qtdtotal, subtotal: subtotal, envio: envio, totalGeneral: totalGeneral });
    },
    
    removeCartItem: (req, res) => {
        const productId = req.params.productId;

        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Filtra el carrito para eliminar el producto con el productId especificado
        req.session.cart = req.session.cart.filter(item => item.product_id !== productId);

        // Redirige de vuelta a la vista del carrito
        res.redirect('/shop/cart');
    },

    checkout: async (req, res) => {
        // Asegurarse de que hay un carrito en la sesión
        if (!req.session.cart || req.session.cart.length === 0) {
            return res.status(400).send('No hay productos en el carrito');
        }

        // Aquí iría la lógica para procesar la compra
        // Por ejemplo, validar la disponibilidad de los productos, aplicar descuentos, calcular envío, etc.

        // Simularemos que el proceso fue exitoso
        let orderSuccessful = true; 

        if (orderSuccessful) {
            // Limpiar el carrito tras una compra exitosa
            req.session.cart = [];
            res.redirect('/');
        } else {
            // Manejar el caso de que la compra no sea exitosa
            res.status(500).send('Hubo un problema al procesar su compra. Por favor, inténtelo de nuevo.');
        }
    },

    updateCartItem: (req, res) => {
        const { productId, quantity } = req.body;

        if (!req.session.cart) {
            req.session.cart = [];
        }

        let qtdtotal = 0;
        let subtotal = 0;
        let envio = 0;
        let totalPerItem = 0;
        let totalGeneral = 0;

        // Encuentra el producto en el carrito y actualiza su cantidad
        const productIndex = req.session.cart.findIndex(item => item.product_id === productId);
        if (productIndex !== -1) {
            req.session.cart[productIndex].quantity = quantity;
            totalPerItem = req.session.cart[productIndex].price * quantity;
        }

        // Calcula el total general del carrito
        req.session.cart.forEach(item => {
                                subtotal += parseInt(item.quantity, 10) * item.price;
                                qtdtotal += parseInt(item.quantity, 10);
                            });

        totalGeneral = subtotal + envio

        res.json({
            qtdtotal: qtdtotal,
            subtotal: subtotal,  
            totalPerItem: totalPerItem,
            totalGeneral: totalGeneral
        });
    },

};

module.exports = shopControllers;
