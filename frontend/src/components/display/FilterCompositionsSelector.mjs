import React, { useState, useEffect, useCallback } from 'react';
import * as fetchers from '../../modules/fetchService.mjs';
import { convertFlatSharp } from '../../modules/utilities.mjs'

import { YearInput } from '../forms/inputs/yearInput.mjs';

function FilterCompositionSelector({ setFilterList }) {
  // State variables for filtering compositions
  const [composerID, setComposerID] = useState('0');
  const [formID, setFormID] = useState('0');
  const [keySignature, setKeySignature] = useState('0');
  const [inputInstrumentIndex, setInputInstrumentIndex] = useState('-1');
  const [minYear, setMinYear] = useState ('');
  const [maxYear, setMaxYear] = useState ('');

  // Options for dropdown menus
  const [catalogueIndex, setCatalogueIndex] = useState([]);
  const [formOptions, setFormOptions] = useState([]);
  const [keyMode, setKeyMode] = useState("Major");
  const [keySignatureOptions, setKeySignatureOptions] = useState([]);
  const [familyOptions, setFamilyOptions] = useState([]);
  const [instrumentOptions, setInstrumentOptions] = useState([]);
  const [soloOrEnsemble, setSoloOrEnsemble] = useState("Solo");
  const [currentInstrumentFamily, setCurrentInstrumentFamily] = useState('-1');

  // Fetchers ************************************************

  // RETRIEVE the entire list of composers for use in the dropdown
  const loadComposerOptions = useCallback(() => {
    fetchers.fetchComposers(setCatalogueIndex);
  }, []);

  // RETRIEVE the entire list of forms for use in the dropdown
  const loadFormOptions = useCallback(() => {
    fetchers.fetchForms(setFormOptions);
  }, []);

  // RETRIEVE the entire list of key signatures for use in the dropdown
  const loadKeySignatureOptions = useCallback(() => {
    fetchers.fetchKeySignatures(setKeySignatureOptions);
  }, []);

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

  // Loaders ***************************************************
  
  // LOAD all the composer options
  useEffect(() => {
    loadComposerOptions();
  }, [loadComposerOptions]);

  // LOAD all the form options
  useEffect(() => {
    loadFormOptions();
  }, [loadFormOptions]);

  // LOAD all the key signature options
  useEffect(() => {
    loadKeySignatureOptions();
  }, [loadKeySignatureOptions]);

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

  // Handlers **************************************************

  // Build the filter list from the state variables
  const buildFilterList = () => {
    let filterList = {};
    if (composerID !== '0') {
      filterList.composerID = composerID;
    }
    if (formID !== '0') {
      filterList.formID = formID;
    }
    if (keySignature !== '0' || keyMode == "None") {
      filterList.keyName = keySignature;
    }
    if (currentInstrumentFamily !== '-1' && inputInstrumentIndex !== '-1') {
      filterList.instrumentID = instrumentOptions[currentInstrumentFamily][inputInstrumentIndex].instrumentID;
    }
    if (minYear !== '') {
      filterList.minYear = minYear
    }
    if (maxYear !== '') {
      filterList.maxYear = maxYear
    }
    setFilterList(filterList);
  }

  // Clear the filter list and reset the dropdowns
  const clearFilters = () => {
    setComposerID('0');
    setFormID('0');
    setKeySignature('0');
    setInputInstrumentIndex('-1');        
    setCurrentInstrumentFamily('-1');
    setSoloOrEnsemble('Solo');
    setMinYear('');
    setMaxYear('');  
    setFilterList({});
  }

  // Render ****************************************************
  return (
    <>
    <table>
      <thead>
        <tr>
          <th colSpan="7">Filter Compositions</th>      
        </tr>
      </thead>
      <tbody>
        <tr>
          {/* Filter Composer */}
          <td><label htmlFor="composer">Composer: </label>
            <select 
              name="composer" 
              id="composer" 
              className="add-input"
              value={composerID}
              onChange={e => setComposerID(e.target.value)} >
                {/* Query the composers in the database in order to populate the list */}
                <option value="0">--Select Composer--</option>
                {catalogueIndex.map((option, i) => (
                  <option 
                    key={i} 
                    value={option.composerID}
                  >{option.firstName} {option.lastName}</option>
                ))}
            </select>
          </td>

          {/* Filter Form */}
          <td><label htmlFor="form">Form: </label>
            <select 
              name="form" 
              id="form" 
              className="add-input"
              value={formID}
              onChange={e => setFormID(e.target.value)} >
                {/* Query the forms in the database in order to populate the dropdown */}
                <option value="0">--Select Form--</option>
                {formOptions.map((option, i) => (
                  <option 
                    key={i} 
                    value={option.formID}
                  >{option.formName}</option>
                ))}
            </select>
          </td>

          {/* Key Signature */}
          <td><label htmlFor="keySignature">Key: </label>
            <select 
              name="keyMode" 
              id="keyMode" 
              className="add-input"
              defaultValue={"Major"}
              onChange={e => {
                setKeyMode(e.target.value);
                setKeySignature('0');
                }} >
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
                <option value="None">None</option>
            </select>
            {keyMode !== "None" ?       
              <select 
                name="keySignature" 
                id="keySignature" 
                className="add-input"
                value={keySignature}
                onChange={e => setKeySignature(e.target.value)} >
                  {/* Query the key signatures in the database in order to populate the dropdown */}
                  <option value="0">--Select Key Signature--</option>
                  {keySignatureOptions.map((option, i) => (
                    option.keyType === keyMode ?
                      <option 
                        key={i} 
                        value={option.keyName}
                      >{convertFlatSharp(option.keyName)}</option> 
                    : ''
                  ))}
              </select>
            : '' }
          </td>
          
          {/* Featured Instrumentation */}
          <td><label htmlFor="featuredInstruments">Instrumentation: </label>            
            {/* Solo or ensemble instrument selector */}
            <select 
              name="soloOrEnsemble" 
              id="soloOrEnsemble" 
              className="add-input"
              value={soloOrEnsemble}
              onChange={e => {            
                setInputInstrumentIndex('-1');        
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
                            <option 
                              key={i} 
                              value={i}
                            >{option.instrumentName}</option>
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
                      <option 
                        key={i} 
                        value={i}
                      >{option.instrumentName}</option>                
                    ))}
                </select> 
              }          
          </td>

          {/* Composition Year */}    
          <td>       
            <span>{`From `}
              <YearInput 
                id={"minYear"}
                value={minYear}
                setValue={setMinYear}
              />
              {` to `} 
              <YearInput 
                id={"maxYear"}
                value={maxYear}
                setValue={setMaxYear}
              />
            </span>
          </td>

          {/* Filter the compositions based on the requirements */}    
          <td>       
            <button 
                name="filter-compositions-button" 
                type="button"
                onClick={buildFilterList}
                id="filter"
              >Filter</button> 
          </td>

          {/* Clear all filters and reset the fields */}    
          <td>       
            <button 
                name="reset-filters-button" 
                type="button"
                onClick={clearFilters}
                id="clear"
              >Clear</button> 
          </td>
          
        </tr>
      </tbody>
    </table>
    </>
  );
}

export default FilterCompositionSelector;