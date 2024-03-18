import React from 'react';
import { useNavigate } from 'react-router-dom';
import { convertFlatSharp } from '../../modules/utilities.mjs';

function CompositionInfoPanel({ composition, movements }) {
    // Use the useNavigate module for redirection
    const redirect = useNavigate();

  // UPDATE this composition
  const handleEditComposition = async () => {;
    redirect(`/edit-composition/${composition.compositionID}`);
  }

  return (
    <aside className="compositionPanel">
      
      {/* Display title and subtitle */}
      <h3><i>{composition.titleEnglish ? composition.titleEnglish : composition.titleNative}</i></h3>
      {composition.subtitle ? <p><strong>{composition.subtitle}</strong></p> : ''}

      {/* Display featured instrumentation and composer name*/}
      {composition.featuredInstrumentation ?
        <p>
          {composition.featuredInstrumentation.length === 1 
            && composition.featuredInstrumentation[0].name === "String Quartet" ? "" 
            : `${composition.form.name} for `} 
          {`${composition.featuredInstrumentation.map(instrument => instrument.name)
            .join(composition.featuredInstrumentation.length === 2 ? ' and ' : ', ')} `}
        </p>  
      : ''}
      <p>
        by {composition.composerFirst} {composition.composerLast}
      </p>

      {/* Display composition facts */}
      <table className="compositionPanel">
        <tbody>

          {/* Opus Number(s) */}
          {composition.opusNum ? 
            <tr>
              <td><strong>Opus</strong></td>
              <td>{composition.opusNums.join(', ')}</td>
            </tr> 
          : ''}

          {/* Catalogue Number(s) */}
          {composition.catalogueNums && composition.catalogueNums.length > 0 ? 
            <tr>
              <td><strong>Catalogue</strong></td>
              <td>
                {composition.catalogueNums.map(catalogueNum => {
                  return `${catalogueNum.symbol} ${catalogueNum.catNum}`;
                }).join(', ')}
              </td>
            </tr> 
          : ''}

          {/* Key Signature */}
          {composition.keySignature ?
            <tr>
              <td><strong>Key</strong></td>
              <td>{convertFlatSharp(composition.keySignature.name)}</td>
            </tr>
          : ''}

          {/* Composition Year */}
          <tr>
            <td><strong>Composed</strong></td>
            <td>{composition.compositionYear}</td>
          </tr>

          {/* Dedication */}
          {composition.dedication ?
            <tr>
              <td><strong>Dedication</strong></td>
              <td>{composition.dedication}</td>
            </tr>
          : ''}

          {/* Movement Count */}
          {movements.length > 1 ? 
            <tr>
              <td><strong>Movements</strong></td>
              <td>{movements.length}</td>
            </tr> 
          : ''}

          {/* Edit Composition Button */}
          <tr>
            <td colSpan="2" style={{ textAlign: "center" }}><button onClick={() => handleEditComposition()}>Edit Composition</button></td>
          </tr>

        </tbody>
      </table>
    </aside>
  );
}

export default CompositionInfoPanel;