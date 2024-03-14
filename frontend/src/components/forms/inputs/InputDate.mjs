// Import dependencies
import React from 'react';
import { formatDate } from '../../../modules/utilities.mjs';

function InputDate ({ id, value, setValue }) {

  // Get current date for max year
  const currentDate = new Date();

  return (
    <>
      <input
        id={id}
        type="date"
        max={formatDate(currentDate)}
        value={formatDate(value)}
        onChange={e => {
          if (e.target.value > formatDate(currentDate)) {
            setValue(formatDate(currentDate));
          } 
          else {
            setValue(e.target.value);
          }}} 
      />
    </>
  );
}
  
export { InputDate };

