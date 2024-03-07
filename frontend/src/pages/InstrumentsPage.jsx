import React, { useEffect, useState, useCallback } from 'react';
import InstrumentList from '../components/InstrumentList.mjs';
import { server_url } from '../config';

function InstrumentsPage() {

  // Define state variable for displaying instruments
  const [instruments, setInstruments] = useState([]);

  // RETRIEVE the entire list of instruments
  const loadInstruments = useCallback(async () => {
    try {
      const response = await fetch(`${server_url}/api/instruments`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const instruments = await response.json();
      setInstruments(instruments);
    } 
    catch (error) {
      console.error('Error fetching instruments:', error);
    }
  }, [] );
  
    // DELETE a single instrument
    const onDeleteInstrument = async id => {
      const response = await fetch(`${server_url}/api/instruments/${id}`, { method: 'DELETE'});
      if (response.ok) {
        loadInstruments();
      } else {
          console.error(`Unable to delete Instrument with ID ${id}, status code = ${response.status}`)
      }
    }
  
    // LOAD all the instruments
    useEffect(() => {
      loadInstruments();
    }, [loadInstruments]);

  return (
    <>
    <h2>Instruments</h2>
    <p>See below a live list of the instrument in our database. Click the add button below to add a new instrument to the collection. Click the edit button to the right of a single instrument to modify that entry. Click the delete button to remove that entry.</p>
    <InstrumentList 
        instruments={instruments} 
        onEdit={loadInstruments} 
        onDelete={onDeleteInstrument}
        onAdd={loadInstruments} 
    />
    </>
  );
}

export default InstrumentsPage;

