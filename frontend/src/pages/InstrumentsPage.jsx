import React, { useEffect, useState, useCallback } from 'react';
import InstrumentList from '../components/display/InstrumentList.mjs';
import { server_url } from '../config';
import * as fetchers from '../modules/fetchService.mjs'

function InstrumentsPage() {

  // Define state variable for displaying instruments
  const [familyList, setFamilyList] = useState([]);
  const [instruments, setInstruments] = useState([]);

  // RETRIEVE the list of instrument families
  const loadFamilyList = useCallback(() => {
    fetchers.fetchFamilyList(setFamilyList);
  }, []);

  // RETRIEVE the entire list of instruments
  const loadAllInstruments = useCallback(() => {
    if (familyList.length) {
      fetchers.fetchAllInstruments(familyList, setInstruments);
    }
  }, [familyList]);

  // RETRIEVE a single family's list of instruments and update the instruments array
  const loadInstrumentFamily = async (familyID) => {
    await fetchers.fetchInstrumentFamily(familyID, instruments, setInstruments);
  };
  
  // DELETE a single instrument
  const onDeleteInstrument = async (instrument) => {
    const response = await fetch(`${server_url}/api/instruments/${instrument.id}`, { method: 'DELETE'});
    if (response.ok) {
      loadInstrumentFamily(instrument.family);
    } else {
        console.error(`Unable to delete Instrument with ID ${instrument.id}, status code = ${response.status}`)
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

