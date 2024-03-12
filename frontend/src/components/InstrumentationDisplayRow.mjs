import React from 'react';

function InstrumentationDisplayRow({ instruments }) {
  const appendIndicator = (number) => {
    let numStr = number;
    switch(parseInt(numStr[numStr.length - 1])) {
      case 1:
        numStr += 'st'; break;
      case 2:
        numStr += 'nd'; break;
      case 3:
        numStr += 'rd'; break;
      default:
        numStr += 'th';
    }
    return numStr;
  }

  return (
    <tr className="instrumentation">
      <td>
        {`${instruments.numInstruments > 1 ? instruments.numInstruments : ''} `}
        {instruments.instrumentName}{instruments.numInstruments > 1 ? 's' : ''}
        {instruments.instrumentKey ? ` in ${instruments.instrumentKey}` : ''}
        {instruments.numDoubling ? 
          ` (${instruments.numDoubling === instruments.numInstruments ? 
                'each' : appendIndicator(instruments.chairsDoubling)} doubling ${instruments.doubles})`
        : ''}
      </td>
    </tr>
  );
}

export default InstrumentationDisplayRow;