import React, { useState } from 'react';
import { server_url } from '../../config.js';

function InstrumentRow({ family, instrument, onEdit, onDelete }) {
  // State variales
  const [editMode, setEditMode] = useState(false);
  const [instrumentName, setInstrumentName] = useState(instrument.name);

  const toggleEdit = () => setEditMode(!editMode);

  const editInstrument = async (familyID) => {
    // Validate inputs
    if (!instrumentName) {
      alert("All fields must be completed before submission.");
      return;
    }

    const response = await fetch(`${server_url}/api/instruments/${instrument.id}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        instrumentName: instrumentName
      }),
      headers: {'Content-Type': 'application/json',}
    });
    if(response.ok) {
      console.log(`${instrumentName} has been successfully updated!`);
    } else {
      if (response.status === 400) {
        alert("Duplicate instrument name is not allowed.");
      } else {
        console.error(`Unable to complete edit. Request returned status code ${response.status}`);
      }
      return;
    }
    toggleEdit();
    onEdit(familyID);
  };

  return (
    <tr className="instrument">
      {editMode ? (
        <>
          <td><input 
            type="text" 
            name="instrument-name"
            className="add-input"
            id="instrument-name"
            placeholder="Instrument Name"
            value={instrumentName}
            onChange={e => setInstrumentName(e.target.value)} />
          </td>
          <td colSpan="2" style={{ textAlign: "center" }}>
            <button
              name="add-button" 
              id="add"
              type="submit"
              onClick={() => editInstrument(family.familyID)}
            >Commit</button>
          </td>
        </>
      ) : (
        <>
          <td>{instrument.name}</td>
          <td><button onClick={toggleEdit}>Edit</button></td>
          <td><button onClick={() => onDelete(instrument)}>Delete</button></td>
        </>
      )}
    </tr>
  );
}

export default InstrumentRow;