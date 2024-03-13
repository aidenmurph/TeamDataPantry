// Import database pool
import pool from '../db.mjs';
import { formatSQL } from '../modules/utilities.mjs'

function createCatalogue(catalogue) {
  const query = formatSQL(`
    INSERT INTO Catalogues (
      composerID, 
      catalogueTitle, 
      catalogueSymbol, 
      authorFirst, 
      authorLast, 
      publicationYear
    ) VALUES (?, ?, ?, ?, ?, ?)`);
  const params = [
    catalogue.composerID,
    catalogue.catalogueTitle,
    catalogue.catalogueSymbol,
    catalogue.authorFirst,
    catalogue.authorLast,
    catalogue.publicationYear
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
    console.error('Error in createCatalogue:', err);
    throw err;
  });
}

function retrieveCatalogues() {
  const query = formatSQL(`
    SELECT 
      Catalogues.catalogueID, 
      Catalogues.catalogueTitle, 
      Catalogues.composerID, 
      Composers.firstName AS composerFirst,
      Composers.lastName AS composerLast, 
      Catalogues.catalogueSymbol, 
      Catalogues.authorFirst, 
      Catalogues.authorLast, 
      Catalogues.publicationYear 
    FROM Catalogues 
    INNER JOIN Composers ON Catalogues.composerID = Composers.composerID;`);

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
      console.error('Error in retrieveCatalogues:', err);
      throw err;
    });
}

function retrieveCatalogueByID(catalogueID) {
  const query = `SELECT * FROM Catalogues WHERE catalogueID = ?`;
  const params = [catalogueID];

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
      console.error('Error in retrieveCatalogueByID:', err);
      throw err;
    });
}

function retrieveCataloguesForComposer(composerID) {
  const query = `SELECT * FROM Catalogues WHERE composerID = ?`;
  const params = [composerID];

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
      console.error('Error in retrieveCataloguesForComposer:', err);
      throw err;
    });
}

function updateCatalogue(catalogueID, catalogue) {
  const query = formatSQL(`
  UPDATE Catalogues 
  SET 
    composerID = ?, 
    catalogueTitle = ?, 
    catalogueSymbol = ?, 
    authorFirst = ?, 
    authorLast = ?, 
    publicationYear = ? 
  WHERE catalogueID = ?;`);
  const params = [
    catalogue.composerID,
    catalogue.catalogueTitle,
    catalogue.catalogueSymbol,
    catalogue.authorFirst,
    catalogue.authorLast,
    catalogue.publicationYear,
    catalogueID
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
      console.error('Error in updateCatalogue:', err);
      throw err;
    });
}

function deleteCatalogue(catalogueID) {
  const query = `DELETE FROM Catalogues WHERE catalogueID = ?`
  const params = [catalogueID];

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
    console.error('Error in deleteCatalogue:', err);
    throw err;
    });
}

export {
  createCatalogue,
  retrieveCatalogues,
  retrieveCatalogueByID,
  retrieveCataloguesForComposer,
  updateCatalogue,
  deleteCatalogue
};