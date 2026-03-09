const { pool } = require('../config/conn');

const getItems = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM items;');
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getItems
};
