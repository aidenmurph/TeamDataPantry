// Import dependencies
import pool from '../db.mjs';
import { formatSQL } from '../modules/utilities.mjs'

// Retreive composition info for displaying in the composition list
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
      IFNULL(Compositions.keySignature, "") AS keySignature,
      (SELECT 
        GROUP_CONCAT(Instruments.instrumentName SEPARATOR ', ')
        FROM FeaturedInstrumentation
        INNER JOIN Instruments ON FeaturedInstrumentation.instrumentID = Instruments.instrumentID
        WHERE FeaturedInstrumentation.compositionID = Compositions.compositionID
        GROUP BY FeaturedInstrumentation.compositionID) AS instrumentation,
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

// Retrieve composition info for displaying on a composition page 
function retrieveCompositionByID(compositionID) {
  const query = formatSQL(`
    SELECT
      Compositions.titleEnglish,
      Compositions.titleNative,
      Compositions.subtitle,
      IFNULL((SELECT 
        GROUP_CONCAT(OpusNums.opNum SEPARATOR ', ')
        FROM OpusNums
        WHERE OpusNums.compositionID = Compositions.compositionID
        GROUP BY OpusNums.compositionID), "") AS opusNum, 
      Compositions.composerID, 
      Composers.firstName AS composerFirst, 
      Composers.lastName AS composerLast, 
      (SELECT 
        Forms.formName
        FROM Forms
        WHERE Forms.formID = Compositions.formID) AS form,
      IFNULL(Compositions.keySignature, "") AS keySignature,
      (SELECT 
        GROUP_CONCAT(Instruments.instrumentName SEPARATOR ', ')
        FROM FeaturedInstrumentation
        INNER JOIN Instruments ON FeaturedInstrumentation.instrumentID = Instruments.instrumentID
        WHERE FeaturedInstrumentation.compositionID = Compositions.compositionID
        GROUP BY FeaturedInstrumentation.compositionID) AS featuredInstrumentation,
      Compositions.compositionYear,
      Compositions.infoText 
    FROM Compositions 
    INNER JOIN Composers ON Compositions.composerID = Composers.composerID
    WHERE Compositions.compositionID = ?`);
  const params = [compositionID];

  return pool.getConnection()
    .then(conn => {
      const resultPromise = conn.query(query, params);
      resultPromise.finally(() => conn.release());
      return resultPromise;
    })
    .then(entity => {
      return entity[0];
    })
    .catch(err => {
      console.error('Error in retrieveCompositions:', err);
      throw err;
    });
}

function retrieveMovements(compositionID) {
  const query = formatSQL(`
    SELECT 
      movementNum,
      title
    FROM Movements 
    WHERE compositionID = ?;`);
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
      console.error('Error in retrieveCompositions:', err);
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
  retrieveCompositions,
  retrieveCompositionByID,
  retrieveMovements,
  deleteComposition
};