// Import dependencies
import React, { useState } from 'react';
import { QueuedMovement } from './queued-elements/QueuedMovement.mjs';

// Form component for building an opus number queue to add to a composition
function AddMovementsForm ({ movements, setMovements }) {
  const [movementNumInput, setMovementNumInput] = useState('');
  const [movementTitleInput, setMovementTitleInput] = useState('');
  const [usedMovementNums, setUsedMovementNums] = useState('');

  // Add a movement to the queue and reset the input field
  const queueMovement = async () => {
    // Validate inputs
    if(movementNumInput === '') {
      const message = "Please provide a movement number"
      alert(message);
      console.log(message);
      return;
    }
    if(movementTitleInput === '') {
      const message = "Please provide a movement title"
      alert(message);
      console.log(message);
      return;
    }
    if(usedMovementNums.includes(movementNumInput)) {
      const message = `Movement ${movementNumInput} already added for this composition`
      alert(message);
      console.log(message);
      return;
    }

    // Add movement to the queue
    const movement = {
      num: movementNumInput,
      title: movementTitleInput
    }
    let queue = [...movements, movement];
    queue.sort((a,b) => a.num - b.num);
    setMovements(queue);

    // Add movement num to the list of used movement numbers
    let used = [...usedMovementNums, movement.num];
    setUsedMovementNums(used);

    // Reset input fields
    setMovementNumInput('');
    setMovementTitleInput('');
  }

  // Remove a movement from the queue
  const removeQueuedMovement = async (movement) => {
    // Remove movement from the queue
    let queue = [...movements];
    queue = queue.filter(mov => mov !== movement)
    setMovements(queue);

    // Remove movement number from list of used numbers
    let used = [...usedMovementNums];
    used = used.filter(num => num !== movement.num);
    setUsedMovementNums(used);
  }

  return (
    <>
      {/* Display the movements queue */}
      {movements.length > 0 ?
        <>
          <p>Movements: </p>
            {movements.map((movement, i) => (
              <QueuedMovement
                key={i} 
                movement={movement}
                onRemove={removeQueuedMovement}
              /> 
            ))} 
        </> : '' }
      <label htmlFor="movementNum">Movement Number: </label>
        <input
          type="number"
          name="movementNum"
          id="movementNum"
          size="5"
          min="1"
          value={movementNumInput}
          placeholder="i.e. 3"
          onChange={e => setMovementNumInput(e.target.value)} />
      <label htmlFor="compositionYear">Movement Title: </label>
        <input 
          type="text" 
          name="movements"
          id="movements" 
          className="add-input"
          size="50" 
          placeholder="Movement Title" 
          value={movementTitleInput}
          onChange={e => setMovementTitleInput(e.target.value)} />
      <button 
        name="add-movement-button" 
        type="add"
        onClick={queueMovement}
        id="add"
      >Add</button>
    </>
  );
}
  
export { AddMovementsForm };