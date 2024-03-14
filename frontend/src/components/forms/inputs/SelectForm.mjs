// Import dependencies
import React, { useState, useEffect, useCallback } from 'react';
import * as fetchers from '../../../modules/fetchService.mjs'

function SelectForm ({ id, value, setValue }) {
  // State variables for dropdown menu
  const [formOptions, setFormOptions] = useState([]);

  // RETRIEVE the entire list of forms for use in the dropdown
  const loadFormOptions = useCallback(() => {
    fetchers.fetchForms(setFormOptions);
  }, []);

  // LOAD all the form options
  useEffect(() => {
    loadFormOptions();
  }, [loadFormOptions]);

  return (
    <>
      <select 
        name={id}
        id={id}
        className="dropdown"
        value={value}
        onChange={e => setValue(e.target.value)} >
          {/* Query the forms in the database in order to populate the dropdown */}
          <option value="SELECT">--Select Form--</option>
          {formOptions.map((option, i) => (
            <option 
              key={i} 
              value={option.formID}
            >{option.formName}</option>
          ))}
      </select>
    </>
  );
}
  
export { SelectForm };

