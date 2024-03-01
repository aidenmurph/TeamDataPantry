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
      ]
    );
    return result;
  } catch (err) {
    console.error('Error in createComposer:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

async function getAllComposers() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM Composers");
    return rows;
  } catch (err) {
    console.error('Error in getAllComposers:', err);
    throw err;
  } finally {
    if (conn) conn.release();
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
      ]
    );
    return result;
  } catch (err) {
    console.error('Error in updateComposer:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

async function deleteComposer(composerId) {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM Composers WHERE composerID = ?", [composerId]);
    return result;
  } catch (err) {
    console.error('Error in deleteComposer:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = {
  createComposer,
  getAllComposers,
  updateComposer,
  deleteComposer
};

