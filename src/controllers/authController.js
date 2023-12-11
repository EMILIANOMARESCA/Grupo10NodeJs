const bcrypt = require('bcrypt');
const { getConnection } = require('../config/conn'); // Asegúrate de que la ruta sea correcta
require('dotenv').config();

const authControllers = {

    getLogin: (req, res) => {
        // Renderiza la página de inicio de sesión
        res.render('login');
    },

    postLogin: async (req, res) => {
        const { email, password } = req.body;
        
        let connection;
        try {
            connection = await getConnection();
            const loginSql = `SELECT email, password FROM ${process.env.DB}.user WHERE email = ?`;
            const [results] = await connection.query(loginSql, [email]);

            if (results.length > 0) {
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
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    getRegister: (req, res) => {
        res.render('register');
    },

    postRegister: async (req, res) => {
        const { name, lastname, email, password } = req.body;
        
        let connection;
        try {
            connection = await getConnection();
            const userExistsQuery = `SELECT user_id FROM ${process.env.DB}.user WHERE email = ?`;
            const [userExistsResult] = await connection.query(userExistsQuery, [email]);

            if (userExistsResult.length > 0) {
                return res.status(400).send('El usuario ya existe');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = {
                name,
                lastname,
                email,
                password: hashedPassword,
                create_time: new Date()
            };

            const insertQuery = `INSERT INTO ${process.env.DB}.user SET ?`;
            await connection.query(insertQuery, newUser);

            res.redirect('/');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error en el servidor');
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },
    
    logout: (req, res) => {
        // Implementa tu lógica de logout aquí
        res.send('Esta ruta desloguea');
    }
};

module.exports = authControllers;
