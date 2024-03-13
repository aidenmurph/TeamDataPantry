import React, { useState } from 'react';
import FormRow from './FormRow.mjs';
import { server_url } from '../../config.js';

function FormList({ forms, onDelete, onEdit, onAdd }) {
  // State variables
  const [formName, setFormName] = useState('');

  const addForm = async () => {
    // Validate inputs
    if (!formName) {
      alert("All fields must be completed before submission.");
      return;
    }

    const newForm = {
      formName,
    }
    const response = await fetch(`${server_url}/api/forms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newForm)
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
  onAdd();
  };

  return (
    <table id="forms" className="forms">
      <thead>
        <tr>
          <th>Form Name</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {forms.map((form) => 
          <FormRow 
            form={form} 
            key={form.formID}
            onDelete={onDelete}
            onEdit={onEdit} 
          />)}
        <tr>
          <td><input 
            type="text" 
            name="form-name"
            className="add-input"
            id="form-name"
            placeholder="Form Name"
            onChange={e => setFormName(e.target.value)} />
          </td>
          <td colSpan="2" style={{ textAlign: "center" }}>
            <button
              name="add-button" 
              id="add"
              type="submit"
              onClick={addForm}
            >Add</button></td>
        </tr>
      </tbody>
    </table>
  );
}

export default FormList;