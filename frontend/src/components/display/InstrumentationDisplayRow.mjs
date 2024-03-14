import React from 'react';
import { appendOrdinalIndicator, convertFlatSharp } from '../../modules/utilities.mjs';

function InstrumentationDisplayRow({ instruments }) {
  const printDeterminer = () => {
    if (instruments.numDoubling === instruments.numInstruments) {
      if (instruments.numInstruments === 1) {
        return '';
      }
      return 'each ';
    }
    return `${appendOrdinalIndicator(instruments.chairsDoubling)} `;
  }

  return (
    <tr className="instrumentation">
      <td>
        {`${instruments.numInstruments > 1 ? instruments.numInstruments : ''} `}
        {instruments.instrumentName}{instruments.numInstruments > 1 ? 's' : ''}
        {instruments.instrumentKey ? ` in ${convertFlatSharp(instruments.instrumentKey)}` : ''}
        {instruments.numDoubling ? 
          ` (${printDeterminer()}doubling ${convertFlatSharp(instruments.doubles)})`
        : ''}
      </td>
    </tr>
  );
}

export default InstrumentationDisplayRow;