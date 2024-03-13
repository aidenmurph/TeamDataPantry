// Import dependencies
import React, { useState, useEffect, useCallback } from 'react';
import * as fetchers from '../../modules/fetchService.mjs'
import { QueuedFeaturedInstrument } from './QueuedFeaturedInstrument.mjs';

// Form component for building an opus number queue to add to a composition
function AddFeaturedInstrumentationForm ({ featuredInstrumentation, setFeaturedInstrumentation }) {
  // State variables for dropdown menus
  const [familyOptions, setFamilyOptions] = useState([]);
  const [instrumentOptions, setInstrumentOptions] = useState([]);

  // State variables for maintaining queue
  const [soloOrEnsemble, setSoloOrEnsemble] = useState("Solo");
  const [currentInstrumentFamily, setCurrentInstrumentFamily] = useState('-1');
  const [inputInstrumentIndex, setInputInstrumentIndex] = useState('-1');
  const [usedInstruments, setUsedInstruments] = useState([]);

  // RETRIEVE the list of instrument families for use in dropdowns
  const loadFamilyOptions = useCallback(() => {
    fetchers.fetchFamilyList(setFamilyOptions);
  }, []);

  // RETRIEVE the entire list of instruments for use in dropdowns
  const loadInstrumentOptions = useCallback(() => {
    if (familyOptions.length > 0) {
      fetchers.fetchAllInstruments(familyOptions, setInstrumentOptions);
    }
  }, [familyOptions]);

  // LOAD all the instrument families
  useEffect(() => {
    loadFamilyOptions();
  }, [loadFamilyOptions]);

  // LOAD all the instruments
  useEffect(() => {
    if (familyOptions.length > 0) {
      loadInstrumentOptions();
    }
  }, [loadInstrumentOptions, familyOptions]);

  // Add a featured instrument or ensemble to the queue
  const queueFeaturedInstrument = async () => {
    // Validate input selection
    if(inputInstrumentIndex === '-1') {
      let message = "Please select an "
      message += soloOrEnsemble === "Solo" ? "instrument." : "ensemble."
      alert(message);
      return;
    }

    // Add featured instrument to the queue
    const featuredInstrument = {
      id: instrumentOptions[currentInstrumentFamily][inputInstrumentIndex].instrumentID,
      name: instrumentOptions[currentInstrumentFamily][inputInstrumentIndex].instrumentName
    }
    let queue = [...featuredInstrumentation, featuredInstrument];
    setFeaturedInstrumentation(queue);

    // Add instrument or ensemble to the list of added featured instruments so multiple 
    // of the same instrument or ensemble cannot be added for a single composition
    const instruments = [...usedInstruments, featuredInstrument.id];
    setUsedInstruments(instruments);

    // Reset input fields
    if(soloOrEnsemble === "Ensemble") {
      setSoloOrEnsemble("Solo");
    }
    setCurrentInstrumentFamily('-1')
    setInputInstrumentIndex('-1')
  }

  // Remove a featured instrument from the queue
  const removeQueuedFeaturedInstrument = async (featuredInstrument) => {
    // Remove the number from the queue
    let queue = [...featuredInstrumentation];
    queue = queue.filter(ins => ins !== featuredInstrument)
    setFeaturedInstrumentation(queue);

    // Remove the catalogue from the list of used catalogues
    let instruments = [...usedInstruments];
    instruments = instruments.filter(id => id !== featuredInstrument.id);
    setUsedInstruments(instruments);

    // Reset input fields
    if(soloOrEnsemble === "Ensemble") {
      setSoloOrEnsemble("Solo");
    }
    setCurrentInstrumentFamily('-1')
    setInputInstrumentIndex('-1')
  }

  return (
    <>
      {/* Display featured instruments queue */}
      <span className="required">{`Featured Instrumentation: `}</span>
      {featuredInstrumentation.length > 0 ?
        <p>
          {featuredInstrumentation.map((instrument, i) => (
            <QueuedFeaturedInstrument
              key={i}
              instrument={instrument}
              i={i}
              instrumentCount={featuredInstrumentation.length}                          
              onRemove={removeQueuedFeaturedInstrument} 
            />
          ))}
        </p>
        : ''
      }

      {/* Solo or ensemble instrument selector */}
      <select 
        name="soloOrEnsemble" 
        id="soloOrEnsemble" 
        className="add-input"
        value={soloOrEnsemble}
        onChange={e => {                    
          setCurrentInstrumentFamily('-1');
          setSoloOrEnsemble(e.target.value);                
        }} >
          <option value="Solo">Solo Instrument</option>
          <option value="Ensemble">Ensemble</option>
      </select>
      
      {/* Solo instruments dropdowns */}
      {soloOrEnsemble === "Solo" ?                 
        <>{/* Select the instrument family */}
          <select 
            name="selectFamily" 
            id="selectFamily" 
            className="add-input"
            value={currentInstrumentFamily}
            onChange={e => {
              if(soloOrEnsemble === "Solo") {
                setInputInstrumentIndex('-1')};
              setCurrentInstrumentFamily(e.target.value);                          
            }} >                      
              <option value="-1">--Select Instrument Family--</option>
              {familyOptions.map((option, i) => (
                i !== familyOptions.length - 1 ?
                  <option 
                    key={i} 
                    value={i}
                  >{option.familyName}</option> 
                : ''
              ))}
          </select>

          {/* Select the featured instrument */}
          {currentInstrumentFamily !== '-1' && instrumentOptions.length > 0 ?  
            <select 
              name="selectInstrument" 
              id="selectInstrument" 
              className="add-input"
              value={inputInstrumentIndex}
              onChange={e => {
                setInputInstrumentIndex(e.target.value);
              }} >                      
                <option value="-1">--Select Instrument--</option>                            
                  {instrumentOptions[currentInstrumentFamily].map((option, i) => (
                    !usedInstruments.includes(option.instrumentID) ?
                      <option 
                        key={i} 
                        value={i}
                      >{option.instrumentName}</option> 
                    : ''
                  ))}
            </select> : ''}
        </>  
          /* Select from list of ensembles */
          : <select 
            name="selectEnsemble" 
            id="selectEnsemble" 
            className="add-input"
            value={inputInstrumentIndex}
            onChange={e => {
              setCurrentInstrumentFamily(familyOptions.length - 1);                      
              setInputInstrumentIndex(e.target.value);                       
            }} >                        
              <option value="-1">--Select Ensemble--</option>
              {instrumentOptions[familyOptions.length - 1].map((option, i) => (
                !usedInstruments.includes(option.instrumentID) ?
                <option 
                  key={i} 
                  value={i}
                >{option.instrumentName}</option>                
              : '' ))}
          </select> 
        }
        
        {/* Add the featured instrument */}
        <button 
          name="add-featured-instrument-button" 
          type="add"
          onClick={queueFeaturedInstrument}
          id="add"
        >Add</button> 
    </>
  );
}
  
export { AddFeaturedInstrumentationForm };