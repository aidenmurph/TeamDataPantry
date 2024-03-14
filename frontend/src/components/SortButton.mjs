// Import dependencies
import React, { useState, useEffect } from 'react';
import { BiSortAlt2, BiSortAZ, BiSortZA } from 'react-icons/bi';
import { RiSortAsc, RiSortDesc } from 'react-icons/ri';
import { BsSortNumericUp, BsSortNumericDown } from 'react-icons/bs';

function SortButton({ attribute, activeSort, onSort, iconType = 'default' }) {
  // State to track sort status: 'none', 'asc', 'desc'
  const [sortStatus, setSortStatus] = useState(iconType === 'charOnly' || iconType === 'numOnly' ? 'asc' : 'none');

  // Define the icon sets 
  const iconSets = {
    default: {
      none: <BiSortAlt2 />,
      asc: <RiSortAsc />,
      desc: <RiSortDesc />
    },
    character: {
      none: <BiSortAlt2 />,
      asc: <BiSortAZ />,
      desc: <BiSortZA />
    },
    charOnly: {
      asc: <BiSortAZ />,
      desc: <BiSortZA />
    },
    numeric: {
      none: <BiSortAlt2 />,
      asc: <BsSortNumericUp />,
      desc: <BsSortNumericDown />
    },
    numOnly: {
      asc: <BsSortNumericUp />,
      desc: <BsSortNumericDown />
    }
  }

  // Reset sort status if this button is not the active sort
  useEffect(() => {
    if (activeSort !== attribute) {
      setSortStatus('none');
    }
  }, [activeSort]);

  // Toggle button display and trigger sort
  const handleClick = () => {
    let nextSortStatus = sortStatus === 'asc' ? 'desc' : 'asc';
    setSortStatus(nextSortStatus);
    onSort(attribute, nextSortStatus !== 'desc');
  };

  // Determine which icon set to use
  const currentIconSet = iconSets[iconType];

  return (
    <button className='sort' onClick={handleClick}>
      {currentIconSet[sortStatus]}
    </button>
  );
}
  
export { SortButton };