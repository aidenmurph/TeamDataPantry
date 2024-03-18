// Import dependencies
import React, { useState } from 'react';
import { QueuedFeaturedInstrument } from './queued-elements/QueuedFeaturedInstrument.mjs';
import { SelectInstrument } from './inputs/SelectInstrument.mjs';

// Form component for building an opus number queue to add to a composition
function AddFeaturedInstrumentationForm ({ featuredInstrumentation, setFeaturedInstrumentation }) {
  // State variables for maintaining queue
  const [featuredInstrument, setFeaturedInstrument] = useState({});
  const [usedInstruments, setUsedInstruments] = useState([]);

  // Add a featured instrument or ensemble to the queue
  const queueFeaturedInstrument = async () => {
    // Validate input selection
    if (Object.keys(featuredInstrument).length === 0) {
      const message = "Please select an instrument or ensemble";
      alert(message);
      console.log(message);
      return;
    }

    // Add featured instrument to the queue
    let queue = [...featuredInstrumentation, featuredInstrument];
    setFeaturedInstrumentation(queue);

    // Add instrument or ensemble to the list of added featured instruments so multiple 
    // of the same instrument or ensemble cannot be added for a single composition
    const used = [...usedInstruments, featuredInstrument.id];
    setUsedInstruments(used);

    // Reset input fields
    setFeaturedInstrument({});
  }

  // Remove a featured instrument from the queue
  const removeQueuedFeaturedInstrument = async (featuredInstrument) => {
    // Remove the number from the queue
    let queue = [...featuredInstrumentation];
    queue = queue.filter(ins => ins.id !== featuredInstrument.id)
    setFeaturedInstrumentation(queue);

    // Remove the catalogue from the list of used catalogues
    let instruments = [...usedInstruments];
    instruments = instruments.filter(id => id !== featuredInstrument.id);
    setUsedInstruments(instruments);
  }

  return (
    <>
      {/* Display featured instruments queue */}
      <span className="required">{`Featured Instrumentation: `}</span>
      {featuredInstrumentation.length > 0 ?
        <p>
          {featuredInstrumentation.map((instrument, i) => (
            <QueuedFeaturedInstrument
              key={i}
              instrument={instrument}
              i={i}
              instrumentCount={featuredInstrumentation.length}                          
              onRemove={removeQueuedFeaturedInstrument} 
            />
          ))}
        </p>
        : ''
      }

      {/* Selector */}
      <SelectInstrument
        id={"instrument"}
        value={featuredInstrument}
        setValue={setFeaturedInstrument}
        used={usedInstruments}
      />
        
      {/* Add the featured instrument */}
      <button 
        name="add-featured-instrument-button" 
        type="add"
        onClick={queueFeaturedInstrument}
        id="add"
      >Add</button> 
    </>
  );
}
  
export { AddFeaturedInstrumentationForm };