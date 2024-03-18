// Import dependencies
import React from 'react';
import { HiOutlineMinusCircle } from 'react-icons/hi';

function QueuedFeaturedInstrument({ instrument, i, instrumentCount, onRemove }) {
  return (
    <>
      <span className="clickable"><HiOutlineMinusCircle onClick={() => onRemove(instrument)} /></span>
      {i === instrumentCount - 1 ? ` ${instrument.name} ` : ` ${instrument.name}, `}
    </>
  );
}
  
  export { QueuedFeaturedInstrument };