// Import database pool
import pool from '../db.mjs';
import { formatSQL } from '../modules/utilities.mjs'

// CREATE Queries **********************************************
// Create a single instrument
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

// RETRIEVE Queries ********************************************
// Retrieve the list of instrument families
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
      console.error('Error in retrieveInstruments: ', err);
      throw err;
    });
}

// Retrieve all instruments in a single family
function retrieveInstrumentsByFamily(familyID) {
  const query = `
    SELECT
      familyID AS family,
      instrumentID AS id,
      scorePosition,
      instrumentName AS name
    FROM Instruments WHERE familyID = ?;`
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
      console.error('Error in retrieveInstruments: ', err);
      throw err;
    });
}

// Retrieve the detailed instrumentation for a single composition by instrument family
function retrieveInstrumentationByFamily(compositionID, familyID) {
  const query = formatSQL(`
  SELECT 
    Instruments.familyID,
    CompositionPlayers.isSection,
    Instruments.scorePosition,
    COUNT(DISTINCT CompositionPlayers.playerID) AS numInstruments,
    Instruments.instrumentID,
    Instruments.instrumentName,
    (SELECT
      KeySignatures.keyName 
      FROM KeySignatures 
      WHERE KeySignatures.keyID = CompositionPlayers.keyID) as instrumentKey,
    COUNT(DISTINCT DoubledInstruments.playerID) AS numDoubling,
    GROUP_CONCAT(DISTINCT 
      IF(DoubledInstruments.keyID IS NOT NULL, 
        CONCAT(doubled.instrumentName, ' in ', 
        (SELECT
          KeySignatures.keyName 
          FROM KeySignatures 
          WHERE KeySignatures.keyID = DoubledInstruments.keyID)),
        doubled.instrumentName) 
        SEPARATOR ', ') AS doubles,
    GROUP_CONCAT(DISTINCT 
      IF(DoubledInstruments.instrumentID IS NOT NULL, CompositionPlayers.chairNum, NULL) 
      SEPARATOR ', ') AS chairsDoubling
  FROM CompositionPlayers
  INNER JOIN Instruments ON CompositionPlayers.instrumentID = Instruments.instrumentID
  LEFT JOIN DoubledInstruments ON DoubledInstruments.playerID = CompositionPlayers.playerID
  LEFT JOIN Instruments AS doubled ON DoubledInstruments.instrumentID = doubled.instrumentID
  WHERE CompositionPlayers.compositionID = ?
  AND Instruments.familyID = ?
  AND CompositionPlayers.isSection = FALSE
  GROUP BY
    CompositionPlayers.keyID, 
    Instruments.instrumentID
  UNION
  SELECT 
    Instruments.familyID,
    CompositionPlayers.isSection,
    Instruments.scorePosition,
    COUNT(DISTINCT CompositionPlayers.playerID) AS numInstruments,
    Instruments.instrumentID,
    CONCAT(
      Instruments.instrumentName,
      IF(Instruments.instrumentName = "Double Bass", 'es ', 's '), 
      IF(CompositionPlayers.chairNum != 0, CompositionPlayers.chairNum, '')) AS instrumentName, 
    (SELECT
      KeySignatures.keyName 
      FROM KeySignatures 
      WHERE KeySignatures.keyID = CompositionPlayers.keyID) as instrumentKey,
    NULL AS doubles,
    NULL AS numDoubling,
    NULL AS chairsDoubling
  FROM CompositionPlayers
  INNER JOIN Instruments ON CompositionPlayers.instrumentID = Instruments.instrumentID
  WHERE CompositionPlayers.compositionID = ?
  AND Instruments.familyID = ?
  AND CompositionPlayers.isSection = TRUE
  GROUP BY
    CompositionPlayers.keyID, 
    CompositionPlayers.playerID
  ORDER BY familyID, instrumentID`);
  const params = [compositionID, familyID, compositionID, familyID];

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
      console.error('Error in retrieveInstrumentationByFamily: ', err);
      throw err;
    });
}

// UPDATE Queries **********************************************
// Update the name of a single instrument
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

// DELETE Queries **********************************************
// Delete a single instrument
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
  retrieveInstrumentationByFamily,
  updateInstrument,
  deleteInstrument
};