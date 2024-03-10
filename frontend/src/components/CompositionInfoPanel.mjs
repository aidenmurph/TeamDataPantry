import React from 'react';

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
          <tr>
            <td><strong>Composed</strong></td>
            <td>{composition.compositionYear}</td>
          </tr>
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