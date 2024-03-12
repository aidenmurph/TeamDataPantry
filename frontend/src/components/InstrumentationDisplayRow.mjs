import React from 'react';
import { appendOrdinalIndicator } from '../modules/utilities.mjs';

function InstrumentationDisplayRow({ instruments }) {

  return (
    <tr className="instrumentation">
      <td>
        {`${instruments.numInstruments > 1 ? instruments.numInstruments : ''} `}
        {instruments.instrumentName}{instruments.numInstruments > 1 ? 's' : ''}
        {instruments.instrumentKey ? ` in ${instruments.instrumentKey}` : ''}
        {instruments.numDoubling ? 
          ` (${instruments.numDoubling === instruments.numInstruments ? 
                'each' : appendOrdinalIndicator(instruments.chairsDoubling)} doubling ${instruments.doubles})`
        : ''}
      </td>
    </tr>
  );
}

export default InstrumentationDisplayRow;