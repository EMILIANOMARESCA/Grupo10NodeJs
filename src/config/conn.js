const mysql = require('mysql2/promise');
require('dotenv').config(); //Requerimos la dependencia .env
console.log(process.env.HOST, process.env.USER, process.env.PASS, process.env.DB);

async function db() {
    try {
        const db = await mysql.createConnection({
            host: process.env.HOST, 
            user: process.env.USER,
            password: process.env.PASS,
            database: process.env.DB,
            });

            console.log('Conectado a la base de datos con el ID ' + db.threadId);
            return db;
        } catch (error) {
            console.error('Error al conectar: ' + error.stack);
            throw error; // Lanza el error para manejarlo más arriba en la cadena
        }
}

module.exports = db;


//module.exports = connect;

//Creamos la conexion simple a BBDD, inicia una instancia de una conexion individual, abre y cierra las conexiones de a una a la vez
//const db = await mysql.createConnection({
//    host: process.env.HOST, 
//    user: process.env.USER,
//    password: process.env.PASS,
//    database: process.env.DB,
//});

//db.connect(error => {
//    if (error) {
//        console.error('Error al conectar: ' + error.stack);
//        return;
//    }
 //   console.log('Conectado a la base de datos con el ID ' + db.threadId);
//});


//Pool de conexiones a la BBDD, hasta 10 conexiones simultaneas
/*
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
*/
