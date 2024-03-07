import React, { useState } from 'react';
import { server_url } from '../config.js';

function FormRow({ form, onEdit, onDelete }) {
  // State variales
  const [editMode, setEditMode] = useState(false);
  const [formName, setFormName] = useState(form.formName);

  const toggleEdit = () => setEditMode(!editMode);

  const editForm = async () => {
    // Validate inputs
    if (!formName) {
      alert("All fields must be completed before submission.");
      return;
    }

    const response = await fetch(`${server_url}/api/forms/${form.formID}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        formName: formName
      }),
      headers: {'Content-Type': 'application/json',}
    });
    if(response.ok) {
      console.log(`${formName} has been successfully updated!`);
    } else {
      if (response.status === 400) {
        alert("Duplicate form name is not allowed.");
      } else {
        console.error(`Unable to complete edit. Request returned status code ${response.status}`);
      }
      return;
    }
    toggleEdit();
    onEdit();
  };

  return (
    <tr className="form">
      {editMode ? (
        <>
          <td><input 
            type="text" 
            name="form-name"
            className="add-input"
            id="form-name"
            placeholder="Form Name"
            value={formName}
            onChange={e => setFormName(e.target.value)} />
          </td>
          <td colSpan="2" style={{ textAlign: "center" }}>
            <button
              name="add-button" 
              id="add"
              type="submit"
              onClick={editForm}
            >Commit</button>
          </td>
        </>
      ) : (
        <>
          <td>{form.formName}</td>
          <td><button onClick={toggleEdit}>Edit</button></td>
          <td><button onClick={() => onDelete(form.formID)}>Delete</button></td>
        </>
      )}
    </tr>
  );
}

export default FormRow;