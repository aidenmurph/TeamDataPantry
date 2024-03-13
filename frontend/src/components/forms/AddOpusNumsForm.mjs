// Import dependencies
import React, { useState } from 'react';
import { QueuedOpusNum } from './QueuedOpusNum.mjs';

// Form component for building an opus number queue to add to a composition
function AddOpusNumsForm ({ opusNums, setOpusNums }) {
  const [opusNumInput, setOpusNumInput] = useState('');

  // Add an opus number to the queue of opus numbers and reset the input field
  const queueOpusNum = async () => {
    if(opusNumInput === '') {
      const message = "Cannot add empty opus number";
      alert(message);
      console.log(message);
      return;
    }
    if(opusNums.includes(opusNumInput)) {
      const message = "That opus number has already been added for this composition";
      alert(message);
      console.log(message);
      return;
    }
    let queue = [...opusNums, opusNumInput];
    setOpusNums(queue)
    setOpusNumInput('');
  }

  // Remove an opus number from the queue
  const removeQueuedOpusNum = async (opusNum) => {
    let queue = [...opusNums];
    queue = queue.filter(num => num !== opusNum)
    setOpusNums(queue);
  }

  return (
    <>
      {/* Display the queued opus numbers */}
      <label htmlFor="opusNums">Op. </label>
        {opusNums.map((opusNum, i) => (
          <QueuedOpusNum
            key={i} 
            opusNum={opusNum}
            i={i}
            opusCount={opusNums.length}
            onRemove={removeQueuedOpusNum}
          /> 
        ))}
      <input 
        type="text" 
        name="opusNums" 
        id="opusNums" 
        className="add-input"
        max="8" 
        size="5" 
        placeholder="i.e. 110" 
        value={opusNumInput}
        onChange={e => setOpusNumInput(e.target.value)} />
      <button 
        name="add-opnum-button" 
        type="add"
        onClick={queueOpusNum}
        id="add"
      >Add</button>
    </>
  );
}
  
export { AddOpusNumsForm };