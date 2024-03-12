import React from 'react';
import { convertFlatSharp } from '../modules/utilities.mjs';

function CompositionInfoPanel({ composition, movements }) {
  return (
    <aside className="compositionPanel">
      <h3><i>{composition.titleEnglish}</i></h3>
      {composition.subtltle ? <p><strong>{composition.subtltle}</strong></p> : ''}
      <p>
        {composition.featuredInstrumentation === "String Quartet" ? "" : `${composition.form} for `} 
        {`${composition.featuredInstrumentation} `}
      </p>
      <p>
        by {composition.composerFirst} {composition.composerLast}
      </p>
      <table className="compositionPanel">
        <tbody>
          {composition.opusNum ? 
            <tr>
              <td><strong>Opus</strong></td>
              <td>{composition.opusNum}</td>
            </tr> 
          : ''}
          {composition.keySignature ?
            <tr>
              <td><strong>Key</strong></td>
              <td>{convertFlatSharp(composition.keySignature)}</td>
            </tr>
          : ''}
          <tr>
            <td><strong>Composed</strong></td>
            <td>{composition.compositionYear}</td>
          </tr>
          {composition.dedication ?
            <tr>
              <td><strong>Dedication</strong></td>
              <td>{composition.dedication}</td>
            </tr>
          : ''}
          {movements.length > 1 ? 
            <tr>
              <td><strong>Movements</strong></td>
              <td>{movements.length}</td>
            </tr> 
          : ''}
        </tbody>
      </table>
    </aside>
  );
}

export default CompositionInfoPanel;