// Import dependencies
import React, { useState, useEffect, useCallback } from 'react';
import * as fetchers from '../../modules/fetchService.mjs'
import { QueuedCatalogueNum } from './queued-elements/QueuedCatalogueNum.mjs';

// Form component for building an opus number queue to add to a composition
function AddCatalogueNumsForm ({ composerID, catalogueNums, setCatalogueNums }) {
  // State variables for dropdown menu
  const [catalogueOptions, setCatalogueOptions] = useState([]);
  
  // State variables for maintaining queue
  const [catalogueOptionNum, setCatalogueOptionNum] = useState('-1');
  const [catalogueNumInput, setCatalogueNumInput] = useState('');
  const [usedCatalogues, setUsedCatalogues] = useState([]);

  // RETRIEVE the current composer's liist of catalogues for use in the dropdown
  const loadCatalogueOptions = useCallback(() => {
    if (composerID && composerID !== 0) {
      fetchers.fetchCataloguesForComposer(composerID, setCatalogueOptions);
    }
  }, [composerID]);

  // LOAD all the catalogues for currently selected composer
  useEffect(() => {
    if (composerID && composerID !== 0) {
      loadCatalogueOptions();
    }
  }, [loadCatalogueOptions, composerID]);

  // Add a catalogue number to the queue of catalogue numbers
  const queueCatalogueNum = async () => {
    // Validate input fields
    if(catalogueNumInput === '') {
      alert("Cannot add empty catalogue number");
      return;
    }
    if(catalogueOptionNum === '-1') {
      alert("A catalogue must be selected to add this number");
      return;
    }
    
    // Add catalogue number to the queue
    const catalogueNum = {
      catalogueID: catalogueOptions[catalogueOptionNum].catalogueID,
      title: catalogueOptions[catalogueOptionNum].catalogueTitle,
      symbol: catalogueOptions[catalogueOptionNum].catalogueSymbol,
      catNum: catalogueNumInput
    }
    const queue = [...catalogueNums, catalogueNum];
    setCatalogueNums(queue)

    // Add catalogue to the list of added catalogues so multiple 
    // catalogue numbers cannot be added for a single catalogue
    const catalogues = [...usedCatalogues, catalogueNum.catalogueID];
    setUsedCatalogues(catalogues);

    // Reset input field
    setCatalogueNumInput('');
    setCatalogueOptionNum('-1');
  }

  // Remove a catalogue number from the queue
  const removeQueuedCatalogueNum = async (catalogueNum) => {
    // Remove the number from the queue
    let queue = [...catalogueNums];
    queue = queue.filter(num => num !== catalogueNum)
    setCatalogueNums(queue);

    // Remove the catalogue from the list of used catalogues
    let catalogues = [...usedCatalogues];
    catalogues = catalogues.filter(id => id !== catalogueNum.catalogueID);
    setUsedCatalogues(catalogues);
  }


  return (
    <>
      {catalogueOptions.length > 0 ? <>
        {`Catalogue Numbers: `}
        {catalogueNums.map((catalogueNum, i) => (
          <QueuedCatalogueNum
            key={i}
            catalogueNum={catalogueNum}
            onRemove={removeQueuedCatalogueNum} 
          />
        ))}
        <select 
          name="catalogue" 
          id="catalogue" 
          className="add-input"
          defaultValue={"-1"}
          onChange={e => setCatalogueOptionNum(e.target.value)} >
            {/* Query the composers in the database in order to populate the list */}
            <option value="-1">--Select Catalogue--</option>
            {catalogueOptions.map((option, i) => (
              !usedCatalogues.includes(option.catalogueID) ? 
                <option 
                  key={i} 
                  value={i}
                >{option.catalogueTitle}</option> 
              : ''
            ))}
        </select>
        <label htmlFor="catNums">{catalogueOptionNum !== '-1' ? ` ${catalogueOptions[catalogueOptionNum].catalogueSymbol} ` : ' '}</label>
        <input 
          type="text" 
          name="catNums" 
          id="catNums" 
          className="add-input"
          max="8" 
          size="5" 
          placeholder="i.e. 110" 
          value={catalogueNumInput}
          onChange={e => setCatalogueNumInput(e.target.value)} />
        <button 
          name="add-catnum-button" 
          type="add"
          onClick={queueCatalogueNum}
          id="add"
        >Add</button>
      </> : <>Catalogue Numbers: This composer has no associated catalogues in the database.</> }
    </>
  );
}
  
export { AddCatalogueNumsForm };