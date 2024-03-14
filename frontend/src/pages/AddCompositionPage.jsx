// Import dependencies
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { server_url } from '../config';
import * as fetchers from '../modules/fetchService.mjs'
import { convertFlatSharp } from '../modules/utilities.mjs';

// Import form componenets
import { AddOpusNumsForm } from '../components/forms/AddOpusNumsForm.mjs'
import { AddCatalogueNumsForm } from '../components/forms/AddCatalogueNumsForm.mjs';
import { AddFeaturedInstrumentationForm } from '../components/forms/AddFeaturedInstrumentationForm.mjs';
import { AddMovementsForm } from '../components/forms/AddMovementsForm.mjs';

export const AddCompositionPage = () => {
  // State variables for database entities
  const [englishTitle, setEnglishTitle] = useState('');
  const [nativeTitle, setNativeTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [composerID, setComposerID] = useState(0);
  const [dedication, setDedication] = useState('');
  const [compositionYear, setCompositionYear] = useState('');
  const [formID, setFormID] = useState('');
  const [keySignature, setKeySignature] = useState('');
  const [opusNums, setOpusNums] = useState([]);
  const [catalogueNums, setCatalogueNums] = useState([]);
  const [featuredInstrumentation, setFeaturedInstrumentation] = useState([]);
  const [movements, setMovements] = useState([]);

  // Options for dropdown menus
  const [catalogueIndex, setCatalogueIndex] = useState([]);
  const [formOptions, setFormOptions] = useState([]);
  const [keyMode, setKeyMode] = useState("Major");
  const [keySignatureOptions, setKeySignatureOptions] = useState([]);

  // Flag for success of all database inserts
  const [addSuccess, setAddSuccess] = useState(true);

  // Assign redirect function
  const redirect = useNavigate();

  // Fetchers ************************************************

  // RETRIEVE the entire list of composers for use in the dropdown
  const loadComposerOptions = useCallback(() => {
    fetchers.fetchComposers(setCatalogueIndex);
  }, []);

  // RETRIEVE the entire list of forms for use in the dropdown
  const loadFormOptions = useCallback(() => {
    fetchers.fetchForms(setFormOptions);
  }, []);

  // RETRIEVE the entire list of key signatures for use in the dropdown
  const loadKeySignatureOptions = useCallback(() => {
    fetchers.fetchKeySignatures(setKeySignatureOptions);
  }, []);

  // Loaders ***************************************************
  
  // LOAD all the composer options
  useEffect(() => {
    loadComposerOptions();
  }, [loadComposerOptions]);

  // LOAD all the form options
  useEffect(() => {
    loadFormOptions();
  }, [loadFormOptions]);

  // LOAD all the key signature options
  useEffect(() => {
    loadKeySignatureOptions();
  }, [loadKeySignatureOptions]);

  // Form Functions ********************************************

  // Add the composition and auxillary entities
  const addComposition = async () => {

    // Check required fields
    if (!composerID || composerID === '0' ||
      !compositionYear || 
      !formID || formID === '0') {
        const message = "Required fields must be completed before submission.";
        alert(message);
        console.log(message);
        return;
    }
    // Check at least one title provided
    if (!englishTitle && !nativeTitle) {
      const message = "At least one title must be provided in either English or the native language of the composition.";
      alert(message);
      console.log(message);
      return;
    }
    // Check at least one feature instrument provided
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

    const newComposition = {
      englishTitle,
      nativeTitle,
      subtitle,
      composerID,
      dedication,
      compositionYear,
      formID,
      keySignature
    }
    let newCompositionID = 0;

    const compositionResponse = await fetch(`${server_url}/api/compositions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newComposition),
    });
    if(compositionResponse.ok){
      const responseData = await compositionResponse.json();
      newCompositionID = responseData.compositionID;
      console.log(`"${englishTitle ? englishTitle : nativeTitle}" was successfully added!`);
    } 
    else {
      setAddSuccess(false);
      console.log(`Unable to add composition. Request returned status code ${compositionResponse.status}`);
    }

    // INSERT Opus Number(s), if any
    if (opusNums.length > 0) {
      addOpusNums(newCompositionID);
    }

    // INSERT Catalogue Number(s), if any
    if (catalogueNums.length > 0) {
      addCatalogueNums(newCompositionID);
    }

    // INSERT Featured Instrumentation
    await addFeaturedInstrumentation(newCompositionID);

    // INSERT Movement(s)
    await addMovements(newCompositionID);
    
    if (addSuccess === true) {
      redirect(`/composition/${newCompositionID}`);
    }
  };

  // Prepare the opus numbers as query compatible objects and send to database
  const addOpusNums = async (compositionID) => {
    const data = opusNums.map(opusNum => ({ 
      compositionID: compositionID, 
      opNum: opusNum 
    }));
    const response = await fetch(`${server_url}/api/opus-nums/for-composition-${compositionID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if(response.ok){
      console.log(`Opus number(s) successfully added for composition with ID ${compositionID}!`);
    } 
    else {
      setAddSuccess(false);
      console.log(`Unable to add opus number(s). Request returned status code ${response.status}`);
    }
  }

  // Prepare the catalogue numbers as query compatible objects and send to database
  const addCatalogueNums = async (compositionID) => {
    const data = catalogueNums.map(catNum => ({ 
      catalogueID: catNum.catalogueID, 
      compositionID: compositionID, 
      catNum: catNum.catNum 
    }));
    const response = await fetch(`${server_url}/api/catalogue-nums/for-composition-${compositionID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if(response.ok){
      console.log(`Catalogue number(s) successfully added for composition with ID ${compositionID}!`);
    } 
    else {
      setAddSuccess(false);
      console.log(`Unable to add catalogue number(s). Request returned status code ${response.status}`);
    }
  }

  // Prepare the featured instrumentation as query compatible objects and send to database
  const addFeaturedInstrumentation = async (compositionID) => {
    const data = featuredInstrumentation.map(instrument => ({ 
      compositionID: compositionID,
      instrumentID: instrument.id
    }));
    const response = await fetch(`${server_url}/api/featured-instruments/for-composition-${compositionID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if(response.ok){
      console.log(`Featured instrument(s) successfully added for composition with ID ${compositionID}!`);
    } 
    else {
      setAddSuccess(false);
      console.log(`Unable to add featured instrument(s). Request returned status code ${response.status}`);
    }
  }

    // Prepare the movements as query compatible objects and send to database
    const addMovements = async (compositionID) => {
      const data = movements.length > 0 ?        
        // Multi-movement works
        movements.map(movement => ({ 
          compositionID: compositionID, 
          movementNum: movement.num,
          title:  movement.title === '' ? null : movement.title
        }))
      :
        // Single-movement works
        [{
          compositionID: compositionID,
          movementNum: 1,
          title: null
        }]
      const response = await fetch(`${server_url}/api/movements/for-composition-${compositionID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if(response.ok){
        console.log(`Movement(s) successfully added for composition with ID ${compositionID}!`);
      } 
      else {
        setAddSuccess(false);
        console.log(`Unable to movement(s). Request returned status code ${response.status}`);
      }
    }

  // Get current date for input limits
  const currentDate = new Date();

  return (
    <>
      <article>
        <h2>Add a Composition</h2>
        <p>Fill out the fields below to add a composition to the database.</p>
          <h3>Details</h3>
          <table className="addComposition">
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
                  <select 
                    name="composer" 
                    id="composer" 
                    className="add-input"
                    value={composerID}
                    onChange={e => setComposerID(e.target.value)} >
                      {/* Query the composers in the database in order to populate the list */}
                      <option value="0">--Select Composer--</option>
                      {catalogueIndex.map((option, i) => (
                        <option 
                          key={i} 
                          value={option.composerID}
                        >{option.firstName} {option.lastName}</option>
                      ))}
                  </select>
                </td>

                {/* Key Signature */}
                <td><label htmlFor="keySignature">Key: </label>
                  <select 
                    name="keyMode" 
                    id="keyMode" 
                    className="add-input"
                    defaultValue={"Major"}
                    onChange={e => setKeyMode(e.target.value)} >
                      <option value="Major">Major</option>
                      <option value="Minor">Minor</option>
                  </select>      
                  <select 
                    name="keySignature" 
                    id="keySignature" 
                    className="add-input"
                    value={keySignature}
                    onChange={e => setKeySignature(e.target.value)} >
                      {/* Query the key signatures in the database in order to populate the dropdown */}
                      <option value="0">--Select Key Signature--</option>
                      {keySignatureOptions.map((option, i) => (
                        option.keyType === keyMode ?
                          <option 
                            key={i} 
                            value={option.keyName}
                          >{convertFlatSharp(option.keyName)}</option> 
                        : ''
                      ))}
                  </select>
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
                  <input
                    type="number"
                    name="compositionYear"
                    id="compositionYear"
                    size="8"
                    min="0"
                    max={currentDate.getFullYear()}
                    value={compositionYear}
                    placeholder="i.e. 1999"
                    onChange={e => setCompositionYear(e.target.value)} />
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
                  <select 
                    name="form" 
                    id="form" 
                    className="add-input"
                    value={formID}
                    onChange={e => setFormID(e.target.value)} >
                      {/* Query the forms in the database in order to populate the dropdown */}
                      <option value="0">--Select Form--</option>
                      {formOptions.map((option, i) => (
                        <option 
                          key={i} 
                          value={option.formID}
                        >{option.formName}</option>
                      ))}
                  </select>
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
                    name="submit-button" 
                    type="submit"
                    onClick={addComposition}
                    id="submit"
                  >Submit</button>
                </td>
              </tr>
            </tbody>
          </table>        
      </article>
    </>
  )
}

export default AddCompositionPage;