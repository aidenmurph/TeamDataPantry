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

  // Options for dropdown menus
  const [catalogueIndex, setCatalogueIndex] = useState([]);
  const [formOptions, setFormOptions] = useState([]);
  const [keyMode, setKeyMode] = useState("Major");
  const [keySignatureOptions, setKeySignatureOptions] = useState([]);

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
    let addSuccess = true;

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
      addSuccess = false;
      console.log(`Unable to add composition. Request returned status code ${compositionResponse.status}`);
    }

    // Prepare the opus number(s) and submit to the database
    if (opusNums.length > 0) {
      const opusNumsData = opusNums.map(opusNum => ({ 
        compositionID: newCompositionID, 
        opNum: opusNum 
      }));
      const opusNumsResponse = await fetch(`${server_url}/api/opus-nums/for-composition-${newCompositionID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(opusNumsData),
      })
      if(opusNumsResponse.ok){
        console.log(`"Opus number(s) successfully added for composition with ID ${newCompositionID}!`);
      } 
      else {
        addSuccess = false;
        console.log(`Unable to add opus number(s). Request returned status code ${opusNumsResponse.status}`);
      }
    }

    // Prepare the catalogue number(s) and submit to the database
    if (catalogueNums.length > 0) {
      const catNumsData = catalogueNums.map(catNum => ({ 
        catalogueID: catNum.id, 
        compositionID: newCompositionID, 
        catNum: catNum.catNum 
      }));
      const catNumsResponse = await fetch(`${server_url}/api/catalogue-nums/for-composition-${newCompositionID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(catNumsData),
      })
      if(catNumsResponse.ok){
        console.log(`"Catalogue number(s) successfully added for composition with ID ${newCompositionID}!`);
      } 
      else {
        addSuccess = false;
        console.log(`Unable to add catalogue number(s). Request returned status code ${catNumsResponse.status}`);
      }
    }

    // Prepare the featured instrumentation submit to the database
    if (featuredInstrumentation.length > 0) {
      const featuredInstrumentsData = featuredInstrumentation.map(instrument => ({ 
        compositionID: newCompositionID,
        instrumentID: instrument.id
      }));
      const featuredInstrumentsResponse = await fetch(`${server_url}/api/featured-instruments/for-composition-${newCompositionID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(featuredInstrumentsData),
      })
      if(featuredInstrumentsResponse.ok){
        console.log(`"Featured instrument(s) successfully added for composition with ID ${newCompositionID}!`);
      } 
      else {
        addSuccess = false;
        console.log(`Unable to add catalogue number(s). Request returned status code ${featuredInstrumentsResponse.status}`);
      }
    }
    
    if (addSuccess === true) {
      redirect(`/composition/${newCompositionID}`);
    }
  };

  // Utilities and Page Return *********************************

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
                    placeholder="Title" 
                    onChange={e => setEnglishTitle(e.target.value)} />
                </td>
                
                {/* Composer */}
                <td><label className="required" htmlFor="composer">Composer: </label>
                  <select 
                    name="composer" 
                    id="composer" 
                    className="add-input"
                    defaultValue={"0"}
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
                    defaultValue={"0"}
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
                    placeholder="Subtitle" 
                    onChange={e => setSubtitle(e.target.value)} />
                </td>

                {/* Form */}
                <td><label className="required" htmlFor="form">Form: </label>
                  <select 
                    name="form" 
                    id="form" 
                    className="add-input"
                    defaultValue={"0"}
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

              {/* Featured Instruments */}
              <tr>
                <td colSpan="3">
                  <AddFeaturedInstrumentationForm
                    featuredInstrumentation={featuredInstrumentation}
                    setFeaturedInstrumentation={setFeaturedInstrumentation}
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

            </tbody>
          </table>
        <button 
          name="submit-button" 
          type="submit"
          onClick={addComposition}
          id="submit"
        >Submit</button>
      </article>
    </>
  )
}

export default AddCompositionPage;