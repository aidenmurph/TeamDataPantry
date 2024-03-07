// Import database pool
import pool from '../db.mjs';

function createForm(form) {
  const query = `INSERT INTO Forms (formName) VALUES (?)`;
  const params = [form.formName];

  return pool.getConnection()
    .then(conn => {
      return conn.query(query, params)
        .then( () => {
          conn.release();
          return { success: true, message: 'Form created successfully.' };
        })
        .catch(err => {
          conn.release();
          console.error('Error in createForm:', err);
          if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
            return { error: true, message: 'Duplicate form name is not allowed.' };
          }
          throw err;
        });
    })
    .catch(err => {
      console.error('Error obtaining connection:', err);
      throw err;
    });
}

function retrieveForms() {
  const query = `SELECT * FROM Forms`

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
      console.error('Error in retrieveForms:', err);
      throw err;
    });
}

function retrieveFormByID(formID) {
  const query = `SELECT * FROM Forms WHERE formID = ?`;
  params = [formID];

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
      console.error('Error in retrieveFormByID:', err);
      throw err;
    });
}

function updateForm(formID, form) {
  const query = `UPDATE Forms SET formName = ? WHERE formID = ?`;
  const params = [
    form.formName,
    formID
  ];

  return pool.getConnection()
    .then(conn => {
      return conn.query(query, params)
        .then( () => {
          conn.release();
          return { success: true, message: 'Form updated successfully.' };
        })
        .catch(err => {
          conn.release();
          console.error('Error in updateForm:', err);
          if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
            return { error: true, message: 'Duplicate form name is not allowed.' };
          }
          throw err;
        });
    })
    .catch(err => {
      console.error('Error obtaining connection:', err);
      throw err;
    });
}

function deleteForm(formId) {
  const query = `DELETE FROM Forms WHERE formID = ?`
  const params = [formId];

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
    console.error('Error in deleteForm:', err);
    throw err;
    });
}

export {
  createForm,
  retrieveForms,
  retrieveFormByID,
  updateForm,
  deleteForm
};