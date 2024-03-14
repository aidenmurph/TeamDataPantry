// Import dependencies
import React from 'react';

function InputYear ({ id, value, setValue }) {

  // Get current date for max year
  const currentDate = new Date();

  return (
    <>
      <input
        type="number"
        name={id}
        id={id}
        size="8"
        min="0"
        max={currentDate.getFullYear()}
        value={value}
        placeholder="i.e. 1999"
        onChange={e => {
          if(e.target.value < 0) {
            setValue(0);
          } 
          else if (e.target.value > currentDate.getFullYear()) {
            setValue(currentDate.getFullYear());
          } 
          else {
            setValue(e.target.value);
          }}} />
    </>
  );
}
  
export { InputYear };

