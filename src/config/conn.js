const mysql = require('mysql2');
require('dotenv').config(); //Requerimos la dependencia .env
console.log(process.env.HOST, process.env.USER, process.env.DBPASS, process.env.DB);

//Creamos la conexion simple a BBDD, inicia una instancia de una conexion individual, abre y cierra las conexiones de a una a la vez
const db = mysql.createConnection({
    host: 'localhost', //process.env.HOST, 
    user: 'admin', //process.env.USER,
    password: 'admin', //process.env.DBPASS,
    database: 'funko_test', //process.env.DB,
	//port: process.env.DBPORT
});

db.connect(error => {
    if (error) {
        console.error('Error al conectar: ' + error.stack);
        return;
    }
    console.log('Conectado a la base de datos con el ID ' + db.threadId);
});
module.exports = db;

//Pool de conexiones a la BBDD, hasta 10 conexiones simultaneas
const pool = mysql.createPool({
    host: 'localhost', //process.env.HOST, 
    user: 'admin', //process.env.USER,
    password: 'admin', //process.env.DBPASS,
    database: 'funko_test', //process.env.DB,
	//port: process.env.DBPORT
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

//Exportamos la conexion como una promesa
module.exports = {
    conn: pool.promise()
};

