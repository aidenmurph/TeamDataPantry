// Import dependencies
import React from 'react';
import { HiOutlineMinusCircle } from 'react-icons/hi';
import { numberToRoman } from '../../modules/utilities.mjs';

function QueuedMovement ({ movement, onRemove }) {
    return (
      <p>
        {`${numberToRoman(movement.num)}. ${movement.title} `}
        <span className="clickable"><HiOutlineMinusCircle onClick={() => onRemove(movement)} /></span>
      </p>
    );
  }
  
  export { QueuedMovement };