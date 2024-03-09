import React, { useEffect, useState, useCallback } from 'react';
import InstrumentList from '../components/InstrumentList.mjs';
import { server_url } from '../config';

function InstrumentsPage() {

  // Define state variable for displaying instruments
  const [familyList, setFamilyList] = useState([]);
  const [instruments, setInstruments] = useState([]);

  // RETRIEVE the list of instrument families
  const loadFamilyList = useCallback(async () => {
    try {
      const response = await fetch(`${server_url}/api/instrument-families`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const families = await response.json();
      setFamilyList(families);
    } 
    catch (error) {
      console.error('Error fetching list of instrument familiess:', error);
    }
  }, [] );

  // RETRIEVE the entire list of instruments
  const loadAllInstruments = useCallback(async () => {
    try {
      // Map each family to a fetch promise that retrieves the instruments for that family
      const fetchPromises = familyList.map(family =>
        fetch(`${server_url}/api/instruments/by-family/${family.familyID}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
          })
      );
  
      // Wait for all promises to resolve and update the instruments array
      const allInstruments = await Promise.all(fetchPromises);
      setInstruments(allInstruments);
    } catch (error) {
      console.error('Error fetching instruments:', error);
    }
  }, [familyList]);
  

  // RETRIEVE a single family's list of instruments and update the instruments array
  const loadInstrumentFamily = async (familyID) => {
    try {
      const response = await fetch(`${server_url}/api/instruments/by-family/${familyID}`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const instrumentFamily = await response.json();
      let allInstruments = [...instruments];
      allInstruments[familyID - 1] = instrumentFamily;
      setInstruments(allInstruments);
    } 
    catch (error) {
      console.error('Error fetching instruments:', error);
    }
  };
  
    // DELETE a single instrument
    const onDeleteInstrument = async (instrument) => {
      const response = await fetch(`${server_url}/api/instruments/${instrument.instrumentID}`, { method: 'DELETE'});
      if (response.ok) {
        loadInstrumentFamily(instrument.familyID);
      } else {
          console.error(`Unable to delete Instrument with ID ${instrument.instrumentID}, status code = ${response.status}`)
      }
    }
  
    // LOAD the list of instrument families
    useEffect(() => {
      loadFamilyList();
    }, [loadFamilyList]);

    // LOAD all the instruments
    useEffect(() => {
      if (familyList.length > 0) {
        loadAllInstruments();
      }
    }, [loadAllInstruments, familyList]);
    

  return (
    <>
    <h2>Instruments</h2>
    <p>See below a live list of the instruments in our database. Click the add button below to add a new instrument to the collection. Click the edit button to the right of a single instrument to modify that entry. Click the delete button to remove that entry.</p>
    <div className="instrumentTables">   
      {familyList.map((family, i) => 
        <InstrumentList 
          key={i}
          family={family}
          instruments={instruments[i] || []} 
          onEdit={loadInstrumentFamily} 
          onDelete={onDeleteInstrument}
          onAdd={loadInstrumentFamily} 
        />
      )}
    </div>
    </>
  );
}

export default InstrumentsPage;

