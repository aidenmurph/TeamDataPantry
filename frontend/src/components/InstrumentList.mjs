import React, { useState } from 'react';
import InstrumentRow from './InstrumentRow.mjs';
import { server_url } from '../config.js';

function InstrumentList({ instruments, onDelete, onEdit, onAdd }) {
  // State variables
  const [instrumentName, setInstrumentName] = useState('');

  const addInstrument = async () => {
    // Validate inputs
    if (!instrumentName) {
      alert("All fields must be completed before submission.");
      return;
    }

    const newInstrument = {
      instrumentName,
    }
    const response = await fetch(`${server_url}/api/instruments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newInstrument)
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
  onAdd();
  };

  return (
    <table id="instruments" className="instruments">
      <thead>
        <tr>
          <th>Instrument Name</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {instruments.map((instrument) => 
          <InstrumentRow 
            instrument={instrument} 
            key={instrument.instrumentID}
            onDelete={onDelete}
            onEdit={onEdit} 
          />)}
        <tr>
          <td><input 
            type="text" 
            name="instrument-name"
            className="add-input"
            id="instrument-name"
            placeholder="Instrument Name"
            onChange={e => setInstrumentName(e.target.value)} />
          </td>
          <td colSpan="2" style={{ textAlign: "center" }}>
            <button
              name="add-button" 
              id="add"
              type="submit"
              onClick={addInstrument}
            >Add</button></td>
        </tr>
      </tbody>
    </table>
  );
}

export default InstrumentList;