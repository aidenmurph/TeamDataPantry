// Import database pool
import pool from '../db.mjs';
import { formatSQL } from '../modules/utilities.mjs'

function createComposition(composition) {
  const query = `INSERT INTO Compositions (composerID, compositionTitle, compositionSymbol, authorFirst, authorLast, publicationYear) VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [
    composition.composerID,
    composition.compositionTitle,
    composition.compositionSymbol,
    composition.authorFirst,
    composition.authorLast,
    composition.publicationYear
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
    console.error('Error in createComposition:', err);
    throw err;
  });
}

function retrieveCompositions() {
  const query = formatSQL(`
    SELECT 
      Compositions.compositionID,
      Compositions.titleEnglish,
      IFNULL((SELECT 
        GROUP_CONCAT(OpusNums.opNum SEPARATOR ', ')
        FROM OpusNums
        WHERE OpusNums.compositionID = Compositions.compositionID
        GROUP BY OpusNums.compositionID), "") AS opusNum, 
      IFNULL((SELECT 
        GROUP_CONCAT(CONCAT(Catalogues.catalogueSymbol, CatalogueNums.catNum) SEPARATOR ', ')
        FROM CatalogueNums 
        INNER JOIN Catalogues ON CatalogueNums.catalogueID = Catalogues.catalogueID
        WHERE CatalogueNums.compositionID = Compositions.compositionID
        GROUP BY CatalogueNums.compositionID), "") AS catalogueNum,
      Compositions.composerID, 
      CONCAT(Composers.firstName, " ", Composers.lastName) AS composer, 
      (SELECT 
        Forms.formName
        FROM Forms
        WHERE Forms.formID = Compositions.formID) AS form,
      IFNULL(Compositions.musicalKey, "") AS keySignature,
      (SELECT 
        GROUP_CONCAT(Instruments.instrumentName SEPARATOR ', ')
        FROM CompositionInstruments
        INNER JOIN Instruments ON CompositionInstruments.instrumentID = Instruments.instrumentID
        WHERE CompositionInstruments.compositionID = Compositions.compositionID
        GROUP BY CompositionInstruments.compositionID) AS instrumentation,
      Compositions.compositionYear 
    FROM Compositions 
    INNER JOIN Composers ON Compositions.composerID = Composers.composerID;`);

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
      console.error('Error in retrieveCompositions:', err);
      throw err;
    });
}

function retrieveCompositionByID(compositionID) {
  const query = `SELECT * FROM Compositions WHERE compositionID = ?`;
  params = [compositionID];

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
      console.error('Error in retrieveCompositionByID:', err);
      throw err;
    });
}

function updateComposition(compositionID, composition) {
  const query = `UPDATE Compositions SET composerID = ?, compositionTitle = ?, compositionSymbol = ?, authorFirst = ?, authorLast = ?, publicationYear = ? WHERE compositionID = ?;`;
  const params = [
    composition.composerID,
    composition.compositionTitle,
    composition.compositionSymbol,
    composition.authorFirst,
    composition.authorLast,
    composition.publicationYear,
    compositionID
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
      console.error('Error in updateComposition:', err);
      throw err;
    });
}

function deleteComposition(compositionID) {
  const query = `DELETE FROM Compositions WHERE compositionID = ?`
  const params = [compositionID];

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
    console.error('Error in deleteComposition:', err);
    throw err;
    });
}

export {
  createComposition,
  retrieveCompositions,
  retrieveCompositionByID,
  updateComposition,
  deleteComposition
};