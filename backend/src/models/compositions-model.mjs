// Import dependencies
import pool from '../db.mjs';
import { formatSQL } from '../modules/utilities.mjs'

// Create a composition 
function createComposition(composition) {
  const query = formatSQL(`
    INSERT INTO Compositions (
      titleEnglish,
      titleNative,
      subtitle,
      composerID,
      dedication,
      compositionYear,
      formID,
      keySignature
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  const params = [
    composition.englishTitle === '' ? null : composition.englishTitle,
    composition.nativeTitle === '' ? null : composition.nativeTitle,
    composition.subtitle === '' ? null : composition.subtitle,
    composition.composerID,
    composition.dedication === '' ? null : composition.dedication,
    composition.compositionYear,
    composition.formID,
    composition.keySignature === '' || composition.keySignature === '0' ? null : composition.keySignature
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
    console.error('Error in createComposition: ', err);
    throw err;
  });
}

// Create one or more opus numbers for a given composition 
function createOpusNums(opusNums) {
  let placeholders = opusNums.map(() => '(?, ?)').join(', ');
  let params = opusNums.reduce((acc, { compositionID, opNum }) => 
    acc.concat(compositionID, opNum), 
    []);
  const query = formatSQL(`
  INSERT INTO OpusNums (
    compositionID,
    opNum
  ) VALUES ${placeholders}`);

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
    console.error('Error in createOpusNums: ', err);
    throw err;
  });
}

// Create one or more catalogue numbers for a given composition 
function createCatalogueNums(catalogueNums) {
  let placeholders = catalogueNums.map(() => '(?, ?, ?)').join(', ');
  let params = catalogueNums.reduce((acc, { catalogueID, compositionID, catNum }) => 
    acc.concat(catalogueID, compositionID, catNum), 
    []);
  const query = formatSQL(`
  INSERT INTO CatalogueNums (
    catalogueID,
    compositionID,
    catNum
  ) VALUES ${placeholders}`);

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
    console.error('Error in createCatalogueNums: ', err);
    throw err;
  });
}

// Create one or more featured instruments for a given composition 
function createFeaturedInstrumentation(featuredInstruments) {
  let placeholders = featuredInstruments.map(() => '(?, ?)').join(', ');
  let params = featuredInstruments.reduce((acc, { compositionID, instrumentID }) => 
    acc.concat(compositionID, instrumentID), 
    []);
  const query = formatSQL(`
  INSERT INTO FeaturedInstrumentation (
    compositionID,
    instrumentID
  ) VALUES ${placeholders}`);

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
    console.error('Error in createFeaturedInstrumentation: ', err);
    throw err;
  });
}

// Create one or more movements for a given composition 
function createMovements(movements) {
  let placeholders = movements.map(() => '(?, ?, ?)').join(', ');
  let params = movements.reduce((acc, { compositionID, movementNum, title }) => 
    acc.concat(compositionID, movementNum, title), 
    []);
  const query = formatSQL(`
  INSERT INTO Movements (
    compositionID,
    movementNum,
    title
  ) VALUES ${placeholders}`);

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
    console.error('Error in createMovements: ', err);
    throw err;
  });
}

// Retreive composition info for displaying in the composition list
function retrieveCompositions() {
  const query = formatSQL(`
    SELECT
      Compositions.compositionID,
      IFNULL(Compositions.titleEnglish, Compositions.titleNative) AS title,
      Compositions.titleEnglish,
      Compositions.titleNative,
      Compositions.subtitle,
      Compositions.dedication,
      IFNULL((SELECT 
          JSON_ARRAYAGG(OpusNums.opNum)
          FROM OpusNums
          WHERE OpusNums.compositionID = Compositions.compositionID), '[]') AS opusNums,
      IFNULL((SELECT 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'catalogueID', CatalogueNums.catalogueID,
            'title',  (SELECT catalogueTitle FROM Catalogues WHERE catalogueID = CatalogueNums.catalogueID),
            'symbol', (SELECT catalogueSymbol FROM Catalogues WHERE catalogueID = CatalogueNums.catalogueID),
            'catNum', CatalogueNums.catNum))
        FROM CatalogueNums
        WHERE CatalogueNums.compositionID = Compositions.compositionID), '[]') AS catalogueNums,
      Compositions.composerID, 
      Composers.firstName AS composerFirst, 
      Composers.lastName AS composerLast,
      (SELECT
        JSON_OBJECT(
          'id', Forms.formID,
          'name', Forms.formName)
        FROM Forms
        WHERE Forms.formID = Compositions.formID) AS form,
      (SELECT CASE
        WHEN Compositions.keySignature IS NULL THEN
          JSON_OBJECT(
            'name', NULL,
            'type', NULL)
        ELSE
          (SELECT JSON_OBJECT(
            'name', KeySignatures.keyName,
            'type', KeySignatures.keyType)
        FROM KeySignatures
        WHERE KeySignatures.keyName = Compositions.keySignature) END) AS keySignature,
      IFNULL((SELECT 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', Instruments.instrumentID,
            'family', Instruments.familyID,
            'scorePosition', Instruments.scorePosition,
            'name', Instruments.instrumentName)) 
        FROM Instruments
        INNER JOIN FeaturedInstrumentation ON Instruments.instrumentID = FeaturedInstrumentation.instrumentID
        WHERE FeaturedInstrumentation.compositionID = Compositions.compositionID), '[]') AS featuredInstrumentation,
      Compositions.compositionYear,
      IFNULL((SELECT 
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'num', Movements.movementNum,
                'title', Movements.title))
        FROM Movements
        WHERE Movements.compositionID = Compositions.compositionID), '[]') AS movements
    FROM Compositions 
    INNER JOIN Composers ON Compositions.composerID = Composers.composerID`);

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
      console.error('Error in retrieveCompositions: ', err);
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
      Compositions.dedication,
      IFNULL((SELECT 
          JSON_ARRAYAGG(OpusNums.opNum)
          FROM OpusNums
          WHERE OpusNums.compositionID = Compositions.compositionID), '[]') AS opusNums,
      IFNULL((SELECT 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'catalogueID', CatalogueNums.catalogueID,
            'symbol', (SELECT catalogueSymbol FROM Catalogues WHERE catalogueID = CatalogueNums.catalogueID),
            'num', CatalogueNums.catNum))
        FROM CatalogueNums
        WHERE CatalogueNums.compositionID = Compositions.compositionID), '[]') AS catalogueNums,
      Compositions.composerID, 
      Composers.firstName AS composerFirst, 
      Composers.lastName AS composerLast, 
      (SELECT 
        Forms.formName
        FROM Forms
        WHERE Forms.formID = Compositions.formID) AS form,
      IFNULL(Compositions.keySignature, '') AS keySignature,
      IFNULL((SELECT 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'instrumentID', Instruments.instrumentID,
            'familyID', Instruments.familyID,
            'scorePosition', Instruments.scorePosition,
            'name', Instruments.instrumentName)) 
        FROM Instruments
        INNER JOIN FeaturedInstrumentation ON Instruments.instrumentID = FeaturedInstrumentation.instrumentID
        WHERE FeaturedInstrumentation.compositionID = Compositions.compositionID), '[]') AS featuredInstrumentation,
      Compositions.compositionYear,
      IFNULL((SELECT 
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'movementNum', Movements.movementNum,
                'title', Movements.title))
        FROM Movements
        WHERE Movements.compositionID = Compositions.compositionID), '[]') AS movements,
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
      console.error('Error in retrieveCompositions: ', err);
      throw err;
    });
}

// Retreive keySignatures info for use in adding/editing compositions & instrumentation
function retrieveKeySignatures() {
  const query = `SELECT * FROM KeySignatures;`

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
      console.error('Error in retrieveKeySignatures: ', err);
      throw err;
    });
}

// Update a composition 
function updateComposition(compositionID, composition) {
  const query = formatSQL(`
    UPDATE Compositions
    SET
      titleEnglish = ?,
      titleNative = ?,
      subtitle = ?,
      composerID = ?,
      dedication = ?,
      compositionYear = ?,
      formID = ?,
      keySignature = ?
    WHERE compositionID = ?`);
  const params = [
    composition.englishTitle === '' ? null : composition.englishTitle,
    composition.nativeTitle === '' ? null : composition.nativeTitle,
    composition.subtitle === '' ? null : composition.subtitle,
    composition.composerID,
    composition.dedication === '' ? null : composition.dedication,
    composition.compositionYear,
    composition.formID,
    composition.keySignature === '' || composition.keySignature === '0' ? null : composition.keySignature,
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
    console.error('Error in updateComposition: ', err);
    throw err;
  });
}

// Delete a single composition
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
    console.error('Error in deleteComposition: ', err);
    throw err;
    });
}

// Delete all opus numbers for a single composition
function deleteOpusNums(compositionID) {
  const query = `DELETE FROM OpusNums WHERE compositionID = ?`
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
    console.error('Error in deleteOpusNums: ', err);
    throw err;
    });
}

// Delete all catalogue numbers for a single composition
function deleteCatalogueNums(compositionID) {
  const query = `DELETE FROM CatalogueNums WHERE compositionID = ?`
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
    console.error('Error in deleteCatalogueNums: ', err);
    throw err;
    });
}

// Delete the featured instrumentation for a single composition
function deleteFeaturedInstrumentation(compositionID) {
  const query = `DELETE FROM FeaturedInstrumentation WHERE compositionID = ?`
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
    console.error('Error in deleteFeaturedInstrumentation: ', err);
    throw err;
    });
}

// Delete all movements for a single composition
function deleteMovements(compositionID) {
  const query = `DELETE FROM Movements WHERE compositionID = ?`
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
    console.error('Error in deleteMovements: ', err);
    throw err;
    });
}

export {
  createComposition,
  createOpusNums,
  createCatalogueNums,
  createFeaturedInstrumentation,
  createMovements,
  retrieveCompositions,
  retrieveCompositionByID,
  retrieveKeySignatures,
  updateComposition,
  deleteComposition,
  deleteOpusNums,
  deleteCatalogueNums,
  deleteFeaturedInstrumentation,
  deleteMovements
};