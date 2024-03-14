// Import dependencies
import React from 'react';

// Modal componenet to display a proceed/cancel dialgue with a specific message
function ProceedDialogue ({ isOpen, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
      <div className="proceedDialogue">
        <p>{message}</p>
        <button onClick={onConfirm}>Proceed</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    );
  };
  
  export { ProceedDialogue };