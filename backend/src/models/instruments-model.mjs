// Import database pool
import pool from '../db.mjs';
import { formatSQL } from '../modules/utilities.mjs'

function createInstrument(familyID, instrument) {
  const query = formatSQL(`
    INSERT INTO Instruments (
      instrumentName, 
      familyID
    ) VALUES (?, ?);`);
  const params = [
    instrument.instrumentName,
    familyID
  ];

  return pool.getConnection()
    .then(conn => {
      return conn.query(query, params)
        .then( () => {
          conn.release();
          return { success: true, message: 'Instrument created successfully.' };
        })
        .catch(err => {
          conn.release();
          console.error('Error in createInstrument:', err);
          if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
            return { error: true, message: 'Duplicate instrument name is not allowed.' };
          }
          throw err;
        });
    })
    .catch(err => {
      console.error('Error obtaining connection:', err);
      throw err;
    });
}

function retrieveInstrumentFamilies() {
  const query = `SELECT * FROM InstrumentFamilies;`

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

function retrieveInstrumentsByFamily(familyID) {
  const query = `SELECT * FROM Instruments WHERE familyID = ?;`
  const params = [familyID];

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
      console.error('Error in retrieveInstruments:', err);
      throw err;
    });
}

function retrieveFeaturedInstruments(compositionID) {
  const query = formatSQL(`
    SELECT Instruments.instrumentName, Instruments.familyID 
    FROM FeaturedInstrumentation
    INNER JOIN Instruments ON FeaturedInstrumentation.instrumentID = Instruments.instrumentID
    WHERE FeaturedInstrumentation.compositionID = ?`);
  const params = [compositionID];

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

function retrieveInstrumentation(compositionID) {
  const query = formatSQL(`
    SELECT 
      Instruments.instrumentName, 
      Instruments.familyID,
      InstrumentationGroups.instrumentKey,
      InstrumentationGroups.numInstruments,
      InstrumentationGroups.isSection 
    FROM InstrumentationGroups
    INNER JOIN Instruments ON InstrumentationGroups.instrumentID = Instruments.instrumentID
    WHERE InstrumentationGroups.compositionID = ?`);
  const params = [compositionID];

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
      return conn.query(query, params)
        .then( () => {
          conn.release();
          return { success: true, message: 'Instrument updated successfully.' };
        })
        .catch(err => {
          conn.release();
          console.error('Error in updateInstrument:', err);
          if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
            return { error: true, message: 'Duplicate instrument name is not allowed.' };
          }
          throw err;
        });
    })
    .catch(err => {
      console.error('Error obtaining connection:', err);
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
  retrieveInstrumentFamilies,
  retrieveInstrumentsByFamily,
  retrieveFeaturedInstruments,
  retrieveInstrumentation,
  updateInstrument,
  deleteInstrument
};