// Import database pool
import pool from '../db.mjs';
import { formatSQL } from '../modules/utilities.mjs'

function createComposer(composer) {
  const query = formatSQL(`
    INSERT INTO Composers (
      firstName, 
      lastName, 
      birthDate, 
      deathDate
    ) VALUES (?, ?, ?, ?)`);
  const params = [
    composer.firstName,
    composer.lastName,
    composer.birthDate,
    composer.deathDate === '' ? null : composer.deathDate
  ];

  return pool.getConnection()
  .then(conn => {
    const resultPromise = conn.query(query, params);
    resultPromise.finally(() => conn.release());
    return resultPromise;
  })
  .then(result => {
    return result;
  })
  .catch(err => {
    console.error('Error in createComposer:', err);
    throw err;
  });
}

function retrieveComposers() {
  const query = `SELECT * FROM Composers`

  return pool.getConnection()
    .then(conn => {
      const resultPromise = conn.query(query);
      resultPromise.finally(() => conn.release());
      return resultPromise;
    })
    .then(rows => {
      return rows;
    })
    .catch(err => {
      console.error('Error in retrieveComposers:', err);
      throw err;
    });
}

function retrieveComposerID(composer) {
  const query = formatSQL(`
    SELECT composerID 
    FROM Composers 
    WHERE firstName = ? AND lastName = ?`);
  const params = [
    composer.firstName,
    composer.lastName
  ]

  return pool.getConnection()
    .then(conn => {
      const resultPromise = conn.query(query, params);
      resultPromise.finally(() => conn.release());
      return resultPromise;
    })
    .then(rows => {
      return rows;
    })
    .catch(err => {
      console.error('Error in retrieveComposerID:', err);
      throw err;
    });
}

function retrieveComposerByID(composerID) {
  const query = `SELECT * FROM Composers WHERE composerID = ?`;
  params = [composerID];

  return pool.getConnection()
    .then(conn => {
      const resultPromise = conn.query(query, params);
      resultPromise.finally(() => conn.release());
      return resultPromise;
    })
    .then(rows => {
      return rows;
    })
    .catch(err => {
      console.error('Error in retrieveComposerByID:', err);
      throw err;
    });
}

function updateComposer(composerID, composer) {
  const query = formatSQL(`
    UPDATE Composers 
    SET 
      firstName = ?, 
      lastName = ?, 
      birthDate = ?, 
      deathDate = ? 
    WHERE composerID = ?`);
  const params = [
    composer.firstName,
    composer.lastName,
    composer.birthDate,
    composer.deathDate === '' ? null : composer.deathDate,
    composerID
  ];

  return pool.getConnection()
    .then(conn => {
      const resultPromise = conn.query(query, params);
      resultPromise.finally(() => conn.release());
      return resultPromise;
    })
    .then(result => {
      return result;
    })
    .catch(err => {
      console.error('Error in updateComposer:', err);
      throw err;
    });
}

function deleteComposer(composerId) {
  const query = `DELETE FROM Composers WHERE composerID = ?`
  const params = [composerId];

  return pool.getConnection()
    .then(conn => {
      const resultPromise = conn.query(query, params);
      resultPromise.finally(() => conn.release());
      return resultPromise;
    })
    .then(result => {
      return result;
    })
    .catch(err => {
    console.error('Error in deleteComposer:', err);
    throw err;
    });
}

export {
  createComposer,
  retrieveComposers,
  retrieveComposerID,
  retrieveComposerByID,
  updateComposer,
  deleteComposer
};