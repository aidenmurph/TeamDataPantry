// Import dependencies
import React, { useState, useEffect, useCallback } from 'react';
import * as fetchers from '../../../modules/fetchService.mjs'

function SelectComposer ({ id, value, setValue }) {
  // State variables for dropdown menu
  const [composerOptions, setComposerOptions] = useState([]);

  // RETRIEVE the entire list of composers for use in the dropdown
  const loadComposerOptions = useCallback(() => {
    fetchers.fetchComposers(setComposerOptions);
    }, []);

  // LOAD all the composer options
  useEffect(() => {
    loadComposerOptions();
  }, [loadComposerOptions]);

  return (
    <>
      <select 
        name={id}
        id={id} 
        className="dropdown"
        value={value}
        onChange={e => setValue(e.target.value)} >
          {/* Query the composers in the database in order to populate the list */}
          <option value="SELECT">--Select Composer--</option>
          {composerOptions.map((option, i) => (
            <option 
              key={i} 
              value={option.composerID}
            >{option.firstName} {option.lastName}</option>
          ))}
      </select>
    </>
  );
}
  
export { SelectComposer };