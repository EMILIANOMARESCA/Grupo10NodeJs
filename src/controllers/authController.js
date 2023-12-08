const bcrypt = require('bcrypt');
const connect  = require('../config/conn'); // Asegúrate de que la ruta sea correcta
require('dotenv').config();

const authControllers = {

    getLogin: (req, res) => {
        // Renderiza la página de inicio de sesión
        res.render('login');
    },


    postLogin: async (req, res) => {
        const { email, password } = req.body;
        
        try {
            const db = await connect(); // Establecer la conexión
            const loginSql = `SELECT email, password FROM ${process.env.DB}.user WHERE email = ?`;
            const [results] = await db.query(loginSql, [email]);

            if (results.length > 0) {
                // Utilizar await con bcrypt.compare ya que es una operación asíncrona
                const match = await bcrypt.compare(password, results[0].password);
                if (match) {
                    res.redirect('/');
                } else {
                    res.status(400).send('Credenciales inválidas. <a href="/auth/login">Volver al inicio de sesión</a>');
                }
            } else {
                res.status(400).send('Usuario no encontrado. <a href="/auth/login">Volver al inicio de sesión</a>');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error en el servidor. <a href="/auth/login">Volver al inicio de sesión</a>');
        }
    },

    getRegister: (req, res) => {

        res.render('register');
    },

    postRegister: async (req, res) => {
        const { name, lastname, email, password } = req.body;
        
        try {
            const db = await connect(); // Establecer la conexión
            // Verificar si el usuario ya existe
            const userExistsQuery = `SELECT user_id FROM ${process.env.DB}.user WHERE email = ?`;
            console.log("Email buscado:", email);
            const [userExistsResult] = await db.query(userExistsQuery, [email]);
            console.log("Resultado de la consulta:", userExistsResult);
            //const userExistsResult = await db.query(userExistsQuery, [email]);
            if (userExistsResult.length > 0) {
                return res.status(400).send('El usuario ya existe');
            }

            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Preparar el nuevo usuario para la inserción
            const newUser = {
                name,
                lastname,
                email,
                password: hashedPassword,
                create_time: new Date() // Asegúrate de que el formato de la fecha sea compatible con tu DB
            };

            // Insertar el nuevo usuario en la base de datos
            const insertQuery = `INSERT INTO ${process.env.DB}.user SET ?`;
            await db.query(insertQuery, newUser);

            // Redirigir al usuario a la página de inicio de sesión u otra página relevante
            res.redirect('/');
            //res.redirect('/login');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error en el servidor');
        }
    },
};


//Exporto el modulo Controllers
module.exports = authControllers;