// db.js
const mariadb = require('mariadb');
const config = require('./config.json'); // Import the config file

const pool = mariadb.createPool(config.database);

async function createComposer(composer) {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "INSERT INTO Composers (firstName, lastName, birthDate, deathDate) VALUES (?, ?, ?, ?)", [
      composer.firstName,
      composer.lastName,
      composer.birthDate,
      composer.deathDate
    ]);
    return result;
  } finally {
    if (conn) conn.end();
  }
}

async function getAllComposers() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM Composers");
    return rows;
  } finally {
    if (conn) conn.end();
  }
}

async function updateComposer(composerId, composer) {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "UPDATE Composers SET firstName = ?, lastName = ?, birthDate = ?, deathDate = ? WHERE composerID = ?", [
      composer.firstName,
      composer.lastName,
      composer.birthDate,
      composer.deathDate,
      composerId
    ]);
    return result;
  } finally {
    if (conn) conn.end();
  }
}

async function deleteComposer(composerId) {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM Composers WHERE composerID = ?", [composerId]);
    return result;
  } finally {
    if (conn) conn.end();
  }
}

module.exports = {
  createComposer,
  getAllComposers,
  updateComposer,
  deleteComposer
};

