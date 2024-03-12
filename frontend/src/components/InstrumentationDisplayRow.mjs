import React from 'react';
import { appendOrdinalIndicator, convertFlatSharp } from '../modules/utilities.mjs';

function InstrumentationDisplayRow({ instruments }) {

  return (
    <tr className="instrumentation">
      <td>
        {`${instruments.numInstruments > 1 ? instruments.numInstruments : ''} `}
        {instruments.instrumentName}{instruments.numInstruments > 1 ? 's' : ''}
        {instruments.instrumentKey ? ` in ${convertFlatSharp(instruments.instrumentKey)}` : ''}
        {instruments.numDoubling ? 
          ` (${instruments.numDoubling === instruments.numInstruments ? 
                'each' : appendOrdinalIndicator(instruments.chairsDoubling)} doubling ${convertFlatSharp(instruments.doubles)})`
        : ''}
      </td>
    </tr>
  );
}

export default InstrumentationDisplayRow;