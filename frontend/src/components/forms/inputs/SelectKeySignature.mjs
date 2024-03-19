// Import dependencies
import React, { useState, useEffect, useCallback } from 'react';
import * as fetchers from '../../../modules/fetchService.mjs'
import { convertFlatSharp } from '../../../modules/utilities.mjs';

function SelectKeySignature ({ id, value, setValue }) {
  // State variables for dropdown menus
  const [keySignatureOptions, setKeySignatureOptions] = useState([]);
  const [keyType, setKeyType] = useState(value === 'SELECT' ? 'Major' : value.type);
  const [keySignatureIndex, setKeySignatureIndex] = useState('SELECT')

  // RETRIEVE the entire list of key signatures for use in the dropdown
  const loadKeySignatureOptions = useCallback(() => {
    fetchers.fetchKeySignatures(setKeySignatureOptions);
  }, []);

  // LOAD all the key signature options
  useEffect(() => {
    loadKeySignatureOptions();
  }, [loadKeySignatureOptions]);

  // Reset key signature on type change
  useEffect(() => {
    setValue(keyType === "None" ? 'NONE' : 'SELECT');
  }, [keyType, setValue]);

  useEffect(() => {
    if (value === 'SELECT') {
      setKeySignatureIndex('SELECT')
    }
    else if (keySignatureOptions.length > 0) {
      setKeyType(value.type);
      setKeySignatureIndex(value.id - 1);
    }
  }, [value, keySignatureOptions]);

  return (
    <>
      <select 
        name="keyType" 
        id="keyType" 
        className="dropdown"
        value={keyType}
        onChange={e => setKeyType(e.target.value)} >
          <option value="Major">Major</option>
          <option value="Minor">Minor</option>
          <option value="None">None</option>
      </select>
      {keyType !== "None" ?       
        <select 
          name={id} 
          id={id}
          className="dropdown"
          value={keySignatureIndex}
          onChange={e => {
            setValue(e.target.value === 'SELECT' ? e.target.value : keySignatureOptions[e.target.value]);
          }} >
            {/* Query the key signatures in the database in order to populate the dropdown */}
            <option value="SELECT">--Select Key Signature--</option>
            {keySignatureOptions.map((option, i) => (
              option.type === keyType ?
                <option 
                  key={i} 
                  value={i}
                >{convertFlatSharp(option.name)}</option> 
              : ''
            ))}
        </select>
      : '' }
    </>
  );
}
  
export { SelectKeySignature };