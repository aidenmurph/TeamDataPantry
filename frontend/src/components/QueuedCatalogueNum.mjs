// Import dependencies
import React from 'react';
import { HiOutlineMinusCircle } from 'react-icons/hi';

function QueuedCatalogueNum({ catalogueNum, onRemove }) {
    return (
      <p>
        {`${catalogueNum.title}: ${catalogueNum.symbol} ${catalogueNum.catNum} `}
        <span className="clickable"><HiOutlineMinusCircle onClick={() => onRemove(catalogueNum)} /></span>
      </p>
    );
  }
  
  export { QueuedCatalogueNum };