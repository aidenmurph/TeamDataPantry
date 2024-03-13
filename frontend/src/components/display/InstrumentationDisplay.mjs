import React from 'react';
import InstrumentationDisplayRow from './InstrumentationDisplayRow.mjs';

function InstrumentationDisplay({ family, instrumentation }) {
  return (
    <table id="instrumentations" className="instrumentations">
      <thead>
        <tr>
          <th>{family.familyName}{[1, 3, 4, 7].includes(family.familyID) ? 's' : ''}</th>
        </tr>
      </thead>
      <tbody>
        {instrumentation.map((instruments, i) => 
          <InstrumentationDisplayRow 
            instruments={instruments} 
            key={i}
          />
        )}
      </tbody>
    </table>
  );
}

export default InstrumentationDisplay;