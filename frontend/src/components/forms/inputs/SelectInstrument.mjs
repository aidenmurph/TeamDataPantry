// Import dependencies
import React, { useState, useEffect, useCallback } from 'react';
import * as fetchers from '../../../modules/fetchService.mjs'

function SelectInstrument ({ id, value, setValue, used = [] }) {
  // State variables for dropdown menus
  const [familyOptions, setFamilyOptions] = useState([]);
  const [instrumentOptions, setInstrumentOptions] = useState([]);
  const [soloOrEnsemble, setSoloOrEnsemble] = useState("Solo");
  const [currentInstrumentFamily, setCurrentInstrumentFamily] = useState('SELECT');

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

  // Reset selection on cleared value
  useEffect(() => {
    if(value === 'RESET') {
      setCurrentInstrumentFamily('SELECT');
      setSoloOrEnsemble('Solo'); 
    }
  }, [value]);

  return (
    <>
      {/* Solo or ensemble instrument selector */}
      <select 
        name="soloOrEnsemble" 
        id="soloOrEnsemble" 
        className="dropdown"
        value={soloOrEnsemble}
        onChange={e => {            
          setValue('SELECT');        
          setCurrentInstrumentFamily('SELECT');
          setSoloOrEnsemble(e.target.value);                
        }} >
          <option value="Solo">Solo Instrument</option>
          <option value="Ensemble">Ensemble</option>
      </select>
      
      {/* Solo instruments dropdowns */}
      {soloOrEnsemble === "Solo" ? <>
        {/* Select the instrument family */}
        <select 
          name="selectFamily" 
          id="selectFamily" 
          className="dropdown"
          value={currentInstrumentFamily}
          onChange={e => {
            if(soloOrEnsemble === "Solo") {
              setValue('SELECT')};
            setCurrentInstrumentFamily(e.target.value);                          
          }} >                      
            <option value="SELECT">--Select Instrument Family--</option>
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
        {currentInstrumentFamily !== 'SELECT' && instrumentOptions.length > 0 ?  
          <select 
            name={id} 
            id={id}
            className="dropdown"
            value={value}
            onChange={e => {
              setValue(e.target.value);
            }} >                      
              <option value="SELECT">--Select Instrument--</option>                            
                {instrumentOptions[currentInstrumentFamily].map((option, i) => (
                  !used.includes(option.instrumentID) ?
                    <option 
                      key={i} 
                      value={option.instrumentID}
                    >{option.instrumentName}</option>
                  : ''
                ))}
          </select> : ''} </>  

      /* Select from list of ensembles */
      : <select 
        name={id} 
        id={id} 
        className="dropdown"
        value={value}
        onChange={e => {
          setCurrentInstrumentFamily(familyOptions.length - 1);                      
          setValue(e.target.value);                       
        }} >                        
          <option value="SELECT">--Select Ensemble--</option>
          {instrumentOptions[familyOptions.length - 1].map((option, i) => (
            !used.includes(option.instrumentID) ?
              <option 
                key={i} 
                value={option.instrumentID}
              >{option.instrumentName}</option>                
          : '' ))}
      </select> }          
    </>
  );
}
  
export { SelectInstrument };