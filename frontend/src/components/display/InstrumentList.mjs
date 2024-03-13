import React, { useState } from 'react';
import InstrumentRow from './InstrumentRow.mjs';
import { server_url } from '../../config.js';

function InstrumentList({ family, instruments, onDelete, onEdit, onAdd }) {
  // State variables
  const [instrumentName, setInstrumentName] = useState('');

  const addInstrument = async (familyID) => {
    // Validate inputs
    if (!instrumentName) {
      alert(`ADD in Family ${familyID}: All fields must be completed before submission.`);
      return;
    }

    const newInstrument = {
      instrumentName,
    }
    const response = await fetch(`${server_url}/api/instruments/${familyID}`, {
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
  onAdd(familyID);
  };

  return (
    <table id="instruments" className="instruments">
      <thead>
        <tr>
          <th colSpan="3">{family.familyName}{[1, 3, 4, 7].includes(family.familyID) ? 's' : ''}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Instrument Name</strong></td>
          <td><strong>Edit</strong></td>
          <td><strong>Delete</strong></td>
        </tr>
        {instruments.map((instrument) => 
          <InstrumentRow 
            family={family}
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
              onClick={() => addInstrument(family.familyID)}
            >Add</button></td>
        </tr>
      </tbody>
    </table>
  );
}

export default InstrumentList;