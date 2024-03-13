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

// Create one or more catalogue numbers for a given composition 
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

// Create one or more movements numbers for a given composition 
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
      IFNULL((SELECT 
        GROUP_CONCAT(OpusNums.opNum SEPARATOR ', ')
        FROM OpusNums
        WHERE OpusNums.compositionID = Compositions.compositionID
        GROUP BY OpusNums.compositionID), "") AS opusNum, 
      IFNULL((SELECT 
        GROUP_CONCAT(CONCAT(Catalogues.catalogueSymbol, ' ', CatalogueNums.catNum) SEPARATOR ', ')
        FROM CatalogueNums 
        INNER JOIN Catalogues ON CatalogueNums.catalogueID = Catalogues.catalogueID
        WHERE CatalogueNums.compositionID = Compositions.compositionID
        GROUP BY CatalogueNums.compositionID), "") AS catalogueNum,
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
      console.error('Error in retrieveCompositions: ', err);
      throw err;
    });
}

// Retreive the list of movements for a single composition for display
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
      console.error('Error in retrieveMovements: ', err);
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

export {
  createComposition,
  createOpusNums,
  createCatalogueNums,
  createFeaturedInstrumentation,
  createMovements,
  retrieveCompositions,
  retrieveCompositionByID,
  retrieveMovements,
  retrieveKeySignatures,
  deleteComposition
};