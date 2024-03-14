// Import dependencies
import React, { useState, useEffect, useCallback } from 'react';
import * as fetchers from '../../modules/fetchService.mjs';

// Import form components
import { SelectComposer } from '../forms/inputs/SelectComposer.mjs';
import { SelectForm } from '../forms/inputs/SelectForm.mjs';
import { SelectKeySignature } from '../forms/inputs/SelectKeySignature.mjs';
import { SelectInstrument } from '../forms/inputs/SelectInstrument.mjs';
import { InputYear } from '../forms/inputs/InputYear.mjs';

function FilterCompositionSelector({ setFilterList }) {
  // State variables for filtering compositions
  const [composerID, setComposerID] = useState('SELECT');
  const [formID, setFormID] = useState('SELECT');
  const [keySignature, setKeySignature] = useState('SELECT');
  const [instrumentID, setInstrumentID] = useState('SELECT');
  const [minYear, setMinYear] = useState ('');
  const [maxYear, setMaxYear] = useState ('');

  // Handlers **************************************************

  // Build the filter list from the state variables
  const buildFilterList = () => {
    let filterList = {};
    if (composerID !== 'SELECT') {
      filterList.composerID = composerID;
    }
    if (formID !== 'SELECT') {
      filterList.formID = formID;
    }
    if (keySignature !== 'SELECT') {
      filterList.keyName = keySignature;
    }
    if (!['SELECT', 'RESET'].includes(instrumentID)) {
      filterList.instrumentID = instrumentID;
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
    setComposerID('SELECT');
    setFormID('SELECT');
    setKeySignature('SELECT');
    setInstrumentID('RESET');        
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
            <SelectComposer 
              id={"composer"}
              value={composerID}
              setValue={setComposerID}
            />
          </td>

          {/* Filter Form */}
          <td><label htmlFor="form">Form: </label>
            <SelectForm 
              id={"form"}
              value={formID}
              setValue={setFormID}
            />
          </td>

          {/* Key Signature */}
          <td><label htmlFor="keySignature">Key: </label>
            <SelectKeySignature 
              id={"keySignature"}
              value={keySignature}
              setValue={setKeySignature}
            />
          </td>
          
          {/* Featured Instrumentation */}
          <td><label htmlFor="featuredInstruments">Instrumentation: </label>            
            <SelectInstrument
              id={"instrument"}
              value={instrumentID}
              setValue={setInstrumentID}
            />
          </td>

          {/* Composition Year */}    
          <td>       
            <span>{`From `}
              <InputYear 
                id={"minYear"}
                value={minYear}
                setValue={setMinYear}
              />
              {` to `} 
              <InputYear 
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