const mysql = require('mysql2');
require('dotenv').config(); //Requerimos la dependencia .env

//Creamos la conexion simple a BBDD, inicia una instancia de una conexion individual, abre y cierra las conexiones de a una a la vez
const connection = mysql.createConnection({
    host: process.env.HOST, //USAMOS LAS VARIABLES DE ENTORNO
    user: process.env.USER,
    password: process.env.DBPASS,
    database: process.env.DB
});

connection.connect();
module.exports = connection;

//Pool de conexiones a la BBDD, hasta 10 conexiones simultaneas
const pool = mysql.createPool({
    host: 'localhost',
    user: 'useradmin',
    password: 'useradmin',
    database: 'funkoshop',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

//Exportamos la conexion como una promesa
module.exports = {
    conn: pool.promise()
};

