const mysql = require('mysql2/promise');
require('dotenv').config(); //Requerimos la dependencia .env
console.log(process.env.HOST, process.env.USER, process.env.PASS, process.env.DB);

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB,
    waitForConnections: true,
    connectionLimit: 10, // Ajusta este número según tus necesidades y capacidad
    queueLimit: 0
});

async function getConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Conectado a la base de datos con el ID ' + connection.threadId);
        return connection;
    } catch (error) {
        console.error('Error al conectar: ' + error.stack);
        throw error;
    }
}

module.exports = { 
    getConnection, 
    pool 
};