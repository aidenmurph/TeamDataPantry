// Import dependencies
import React, { useState, useEffect } from 'react';
import { BiSortAlt2 } from "react-icons/bi";
import { RiSortAsc, RiSortDesc } from "react-icons/ri";

function SortButton({ attribute, activeSort, onSort }) {
  // State to track sort status: 'none', 'asc', 'desc'
  const [sortStatus, setSortStatus] = useState('none');

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

  return (
    <button className='sort' onClick={handleClick}>
      {sortStatus === 'none' && <BiSortAlt2/>}
      {sortStatus === 'asc' && <RiSortAsc />}
      {sortStatus === 'desc' && <RiSortDesc />}
    </button>
  );
}
  
export { SortButton };