// Import dependencies
import React, { useState, useEffect, useCallback } from 'react';
import * as fetchers from '../../../modules/fetchService.mjs'
import { convertFlatSharp } from '../../../modules/utilities.mjs';

function SelectKeySignature ({ id, value, setValue }) {
  // State variables for dropdown menus
  const [keyMode, setKeyMode] = useState("Major");
  const [keySignatureOptions, setKeySignatureOptions] = useState([]);

  // RETRIEVE the entire list of key signatures for use in the dropdown
  const loadKeySignatureOptions = useCallback(() => {
    fetchers.fetchKeySignatures(setKeySignatureOptions);
  }, []);

  // LOAD all the key signature options
  useEffect(() => {
    loadKeySignatureOptions();
  }, [loadKeySignatureOptions]);

  // Reset key signature on mode change
  useEffect(() => {
    setValue(keyMode === "None" ? 'NONE' : 'SELECT');
  }, [keyMode]);

  return (
    <>
      <select 
        name="keyMode" 
        id="keyMode" 
        className="dropdown"
        defaultValue={"Major"}
        onChange={e => setKeyMode(e.target.value)} >
          <option value="Major">Major</option>
          <option value="Minor">Minor</option>
          <option value="None">None</option>
      </select>
      {keyMode !== "None" ?       
        <select 
          name={id} 
          id={id}
          className="dropdown"
          value={value}
          onChange={e => setValue(e.target.value)} >
            {/* Query the key signatures in the database in order to populate the dropdown */}
            <option value="SELECT">--Select Key Signature--</option>
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
    </>
  );
}
  
export { SelectKeySignature };