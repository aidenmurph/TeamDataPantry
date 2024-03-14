import React from 'react';
import InstrumentationDisplayRow from './InstrumentationDisplayRow.mjs';
import { sortList } from '../../modules/utilities.mjs';

function InstrumentationDisplay({ family, instrumentation }) {
  return (
    <table id="instrumentations" className="instrumentations">
      <thead>
        <tr>
          <th>{family.familyName}{[1, 3, 4, 7].includes(family.familyID) ? 's' : ''}</th>
        </tr>
      </thead>
      <tbody>
        {sortList(instrumentation, "scorePosition", true).map((instruments, i) => 
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