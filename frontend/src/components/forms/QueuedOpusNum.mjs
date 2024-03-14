// Import dependencies
import React from 'react';
import { HiOutlineMinusCircle } from 'react-icons/hi';

function QueuedOpusNum({ opusNum, i, opusCount, onRemove }) {
    return (
      <>
        <span className="clickable"><HiOutlineMinusCircle onClick={() => onRemove(opusNum)} /></span>
        {i === opusCount - 1 ? ` ${opusNum} ` : ` ${opusNum}, `}
      </>
    );
  }
  
  export { QueuedOpusNum };