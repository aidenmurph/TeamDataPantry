// Import dependencies
import React from 'react';

// Import form componenets
import { SelectComposer } from './inputs/SelectComposer.mjs';
import { SelectKeySignature } from './inputs/SelectKeySignature.mjs';
import { SelectForm } from './inputs/SelectForm.mjs';
import { InputYear } from './inputs/InputYear.mjs';
import { AddOpusNumsForm } from './AddOpusNumsForm.mjs'
import { AddCatalogueNumsForm } from './AddCatalogueNumsForm.mjs';
import { AddFeaturedInstrumentationForm } from './AddFeaturedInstrumentationForm.mjs';
import { AddMovementsForm } from './AddMovementsForm.mjs';

function CompositionForm ({ 
  englishTitle, setEnglishTitle,
  nativeTitle, setNativeTitle,
  subtitle, setSubtitle,
  composerID, setComposerID,
  dedication, setDedication,
  compositionYear, setCompositionYear,
  formID, setFormID,
  keySignature, setKeySignature,
  opusNums, setOpusNums,
  catalogueNums, setCatalogueNums,
  featuredInstrumentation, setFeaturedInstrumentation,
  movements, setMovements,
  onSubmit }) 
{
  // Validate the input before calling the submission handler
  const handleSubmit = () => {
    // Check required fields
    if (!composerID || composerID === 'SELECT' ||
      !compositionYear || 
      !formID || formID === 'SELECT') {
        const message = "Required fields must be completed before submission.";
        alert(message);
        console.log(message);
        return;
    }
    // Chat at least one title was provided
    if (!englishTitle && !nativeTitle) {
      const message = "At least one title must be provided in either English or the native language of the composition.";
      alert(message);
      console.log(message);
      return;
    }
    // Check at least one featured instrument or ensemble was provided
    if (featuredInstrumentation.length === 0) {
      const message = "Please add at least one instrument or ensemble to the featured instrumentation.";
      alert(message);
      console.log(message);
      return;
    }
    // Check there is not only one movement added
    if (movements.length === 1) {
      const message = "A composition cannot feature only one named movement. Please add one or more movements or remove the added movement.";
      alert(message);
      console.log(message);
      return;
    }

    // Submit the data to the handler
    onSubmit()
  }

  return (
    <>
      <h3>Details</h3>
      <table className="compositionForm">
        <tbody>
          <tr>      
            {/* English Title */}
            <td><label htmlFor="titleEnglish">Title (English): </label>
              <input 
                type="text" 
                name="titleEnglish" 
                id="titleEnglish" 
                className="add-input" 
                size="50"
                value={englishTitle} 
                placeholder="Title" 
                onChange={e => setEnglishTitle(e.target.value)} />
            </td>
            
            {/* Composer */}
            <td><label className="required" htmlFor="composer">Composer: </label>
              <SelectComposer 
                id={"composer"}
                value={composerID}
                setValue={setComposerID}
              />
            </td>

            {/* Key Signature */}
            <td><label htmlFor="keySignature">Key: </label>
              <SelectKeySignature 
                id={"keySignature"}
                value={keySignature}
                setValue={setKeySignature}
              />
            </td>
          </tr>
          <tr>
            {/* Native Title */}
            <td><label htmlFor="titleNative">Title (Native): </label>
              <input 
                type="text" 
                name="titleNative" 
                id="titleNative" 
                className="add-input" 
                size="50" 
                value={nativeTitle}
                placeholder="Title" 
                onChange={e => setNativeTitle(e.target.value)} />
            </td>

            {/* Dedication */}
            <td><label htmlFor="dedication">Dedication: </label>
              <input 
                type="text" 
                name="dedication" 
                id="dedication" 
                className="add-input"
                value={dedication} 
                placeholder="Dedication" 
                onChange={e => setDedication(e.target.value)} />
            </td>

            {/* Composition Year */}
            <td><label className="required" htmlFor="compositionYear">Composition Year: </label>
              <InputYear 
                id={"compositionYear"}
                value={compositionYear}
                setValue={setCompositionYear}
              />
            </td>
          </tr>
          <tr>

            {/* Subtitle */}
            <td><label htmlFor="subtitle">Subtitle: </label>
              <input 
                type="text" 
                name="subtitle" 
                id="subtitle" 
                className="add-input" 
                size="50"
                value={subtitle}  
                placeholder="Subtitle" 
                onChange={e => setSubtitle(e.target.value)} />
            </td>

            {/* Form */}
            <td><label className="required" htmlFor="form">Form: </label>
            <SelectForm 
              id={"form"}
              value={formID}
              setValue={setFormID}
            />
            </td>

            {/* Opus Numbers */}
            <td>
              <AddOpusNumsForm
                opusNums={opusNums}
                setOpusNums={setOpusNums}
              />
            </td>
          </tr>

          {/* Catalogue Nums */}
          <tr>
            <td colSpan="3">
              < AddCatalogueNumsForm
                composerID={composerID}
                catalogueNums={catalogueNums}
                setCatalogueNums={setCatalogueNums}                  
              />
            </td>
          </tr>

          {/* Featured Instrumentation */}
          <tr>
            <td colSpan="3">
              <AddFeaturedInstrumentationForm
                featuredInstrumentation={featuredInstrumentation}
                setFeaturedInstrumentation={setFeaturedInstrumentation}
              />
            </td>
          </tr>

          {/* Movements */}
          <tr>
            <td colSpan="3">
              <AddMovementsForm
                movements={movements}
                setMovements={setMovements}
              />
            </td>
          </tr>                     

          {/* Submit Button */}
          <tr>
            <td colSpan="3" style={{ textAlign: "center" }}>
              <button 
                name="commit-button" 
                type="button"
                onClick={handleSubmit}
                id="submit"
              >Submit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export { CompositionForm }