// Import dependencies
import React from 'react';
import { HiOutlineMinusCircle } from 'react-icons/hi';

function QueuedMovement ({ movement, onRemove }) {
    return (
      <p>
        {`${movement.num}. ${movement.title} `}
        <span className="clickable"><HiOutlineMinusCircle onClick={() => onRemove(movement)} /></span>
      </p>
    );
  }
  
  export { QueuedMovement };