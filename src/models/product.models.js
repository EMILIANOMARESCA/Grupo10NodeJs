const { pool } = require ('../config/conn');

const getAll = async () => {

    try
    {
        const [rows] = await pool.query('SELECT productos.*, category.category_name, licence.licence_name FROM (product LEFT JOIN category ON product.category_id = category.category_id) LEFT JOIN licence ON product.licence_id = licence.licence_id;');
        
        return rows;
    }
    catch(error)
    {
        return{
            error: true,
            message: 'Hemos encontrado un error' + error
        }
    }
    finally
    {
        pool.releaseConnection();
    }
}

module.exports = {
    getAll
}