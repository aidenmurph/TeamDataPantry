// Import database pool
import pool from '../db.mjs';

function createInstrument(instrument) {
  const query = `INSERT INTO Instruments (instrumentName) VALUES (?)`;
  const params = [instrument.instrumentName];

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
    console.error('Error in createInstrument:', err);
    throw err;
  });
}

function retrieveInstruments() {
  const query = `SELECT * FROM Instruments`

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
      console.error('Error in retrieveInstruments:', err);
      throw err;
    });
}

function retrieveInstrumentByID(instrumentID) {
  const query = `SELECT * FROM Instruments WHERE instrumentID = ?`;
  params = [instrumentID];

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
      console.error('Error in retrieveInstrumentByID:', err);
      throw err;
    });
}

function updateInstrument(instrumentID, instrument) {
  const query = `UPDATE Instruments SET instrumentName = ? WHERE instrumentID = ?`;
  const params = [
    instrument.instrumentName,
    instrumentID
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
      console.error('Error in updateInstrument:', err);
      throw err;
    });
}

function deleteInstrument(instrumentId) {
  const query = `DELETE FROM Instruments WHERE instrumentID = ?`
  const params = [instrumentId];

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
    console.error('Error in deleteInstrument:', err);
    throw err;
    });
}

export {
  createInstrument,
  retrieveInstruments,
  retrieveInstrumentByID,
  updateInstrument,
  deleteInstrument
};