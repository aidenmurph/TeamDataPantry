// Import dependencies
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { server_url } from '../config';
import * as fetchers from '../modules/fetchService.mjs'
import { convertFlatSharp } from '../modules/utilities.mjs';
import { QueuedOpusNum } from '../components/QueuedOpusNum.mjs'
import { QueuedCatalogueNum } from '../components/QueuedCatalogueNum.mjs';

export const AddCompositionPage = () => {
  // State variables for Compositions
  const [englishTitle, setEnglishTitle] = useState('');
  const [nativeTitle, setNativeTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [composerID, setComposerID] = useState(0);
  const [dedication, setDedication] = useState('');
  const [compositionYear, setCompositionYear] = useState('');
  const [formID, setFormID] = useState('');
  const [keySignature, setKeySignature] = useState('');

  // State variables for OpusNums
  const [opusCount, setOpusCount] = useState(0);
  const [opusNumInput, setOpusNumInput] = useState('');
  const [opusNums, setOpusNums] = useState([]);

  // State variables for CatalogueNums
  const [catalogueOptionNum, setCatalogueOptionNum] = useState('0');
  const [catalogueNumInput, setCatalogueNumInput] = useState('');
  const [catalogueNums, setCatalogueNums] = useState([]);
  const [usedCatalogues, setUsedCatalogues] = useState([]);

  // State variables for FeaturedInstrumentation
  const [featuredInstrumentation, setFeaturedInstrumentation] = useState([]);

  // Options for dropdown menus
  const [catalogueIndex, setCatalogueIndex] = useState([]);
  const [formOptions, setFormOptions] = useState([]);
  const [keyMode, setKeyMode] = useState("Major");
  const [keySignatureOptions, setKeySignatureOptions] = useState([]);
  const [catalogueOptions, setCatalogueOptions] = useState([]);
  const [familyOptions, setFamilyOptions] = useState([]);
  const [instrumentOptions, setInstrumentOptions] = useState([]);

  // Assign redirect function
  const redirect = useNavigate();

  // Add the composition and auxillary entities
  const addComposition = async () => {
    let addSuccess = true;

    // Check required fields
    if (!composerID || composerID === '0' ||
      !compositionYear || 
      !formID || formID === '0') {
        alert("Required fields must be completed before submission.");
        return;
    }
    // Check at least one title provided
    if (!englishTitle && !nativeTitle) {
      alert("At least one title must be provided in either English or the native language of the composition.")
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

    // Prepare the opus numbers and submit them to the database
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

    // Prepare the catalogue numbers and submit them to the database
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
    
    if (addSuccess === true) {
      redirect(`/composition/${newCompositionID}`);
    }
  };

  // Add an opus number to the queue of opus numbers and reset the input field
  const queueOpusNum = async () => {
    if(opusNumInput === '') {
      alert("Cannot add empty opus number");
      return;
    }
    let queue = [...opusNums, opusNumInput];
    setOpusNums(queue)
    setOpusCount(opusCount + 1);
    setOpusNumInput('');
  }

  // Remove an opus number from the queue
  const removeQueuedOpusNum = async (opusNum) => {
    let queue = [...opusNums];
    queue = queue.filter(num => num !== opusNum)
    setOpusCount(opusCount - 1);
    setOpusNums(queue);
  }

  // Add a catalogue number to the queue of catalogue numbers
  const queueCatalogueNum = async () => {
    // Validate input fields
    if(catalogueNumInput === '') {
      alert("Cannot add empty catalogue number");
      return;
    }
    if(catalogueOptionNum === '0') {
      alert("A catalogue must be selected to add this number");
      return;
    }

    // Add catalogue number to the queue
    const catalogueNum = {
      id: catalogueOptions[catalogueOptionNum - 1].catalogueID,
      title: catalogueOptions[catalogueOptionNum - 1].catalogueTitle,
      symbol: catalogueOptions[catalogueOptionNum - 1].catalogueSymbol,
      catNum: catalogueNumInput
    }
    const queue = [...catalogueNums, catalogueNum];
    setCatalogueNums(queue)

    // Add catalogue to the list of added catalogues so multiple 
    // catalogue numbers cannot be added for a single catalogue
    const catalogues = [...usedCatalogues, catalogueNum.id];
    setUsedCatalogues(catalogues);

    // Reset input field
    setCatalogueNumInput('');
  }

  // Remove a catalogue number from the queue
  const removeQueuedCatalogueNum = async (catalogueNum) => {
    // Remove the number from the queue
    let queue = [...catalogueNums];
    queue = queue.filter(num => num !== catalogueNum)
    setCatalogueNums(queue);

    // Remove the catalogue from the list of used catalogues
    let catalogues = [...usedCatalogues];
    catalogues = catalogues.filter(id => id !== catalogueNum.id);
    setUsedCatalogues(catalogues);
  }

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

  // RETRIEVE the current composer's liist of catalogues for use in the dropdown
  const loadCatalogueOptions = useCallback(() => {
    if (composerID && composerID !== 0) {
      fetchers.fetchCataloguesForComposer(composerID, setCatalogueOptions);
    }
  }, [composerID]);
  
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

  // LOAD all the catalogues for currently selected composer
  useEffect(() => {
    if (composerID && composerID !== 0) {
      loadCatalogueOptions();
    }
  }, [loadCatalogueOptions, composerID]);
  
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
                <td><label htmlFor="opusNums">Op. </label>
                  {opusNums.map((opusNum, i) => (
                    <QueuedOpusNum
                      key={i} 
                      opusNum={opusNum}
                      i={i}
                      opusCount={opusCount}
                      onRemove={removeQueuedOpusNum}
                    /> 
                  ))}
                  <input 
                    type="text" 
                    name="opusNums" 
                    id="opusNums" 
                    className="add-input"
                    max="8" 
                    size="5" 
                    placeholder="i.e. 110" 
                    value={opusNumInput}
                    onChange={e => setOpusNumInput(e.target.value)} />
                  <button 
                    name="add-opnum-button" 
                    type="add"
                    onClick={queueOpusNum}
                    id="add"
                  >Add</button>
                </td>
              </tr>

              {/* Catalogue Nums */}
                <tr>
                  <td colSpan="3">
                    {catalogueOptions.length > 0 ? <>
                      {`Catalogue Numbers: `}
                      {catalogueNums.map((catalogueNum, i) => (
                        <QueuedCatalogueNum
                          key={i}
                          catalogueNum={catalogueNum}
                          onRemove={removeQueuedCatalogueNum} 
                        />
                      ))}
                      <select 
                        name="catalogue" 
                        id="catalogue" 
                        className="add-input"
                        defaultValue={"0"}
                        onChange={e => setCatalogueOptionNum(e.target.value)} >
                          {/* Query the composers in the database in order to populate the list */}
                          <option value="0">--Select Catalogue--</option>
                          {catalogueOptions.map((option, i) => (
                            !usedCatalogues.includes(option.catalogueID) ? 
                              <option 
                                key={i} 
                                value={i + 1}
                              >{option.catalogueTitle}</option> 
                            : ''
                          ))}
                      </select>
                      <label htmlFor="catNums">{catalogueOptionNum !== '0' ? ` ${catalogueOptions[catalogueOptionNum - 1].catalogueSymbol} ` : ' '}</label>
                      <input 
                        type="text" 
                        name="catNums" 
                        id="catNums" 
                        className="add-input"
                        max="8" 
                        size="5" 
                        placeholder="i.e. 110" 
                        value={catalogueNumInput}
                        onChange={e => setCatalogueNumInput(e.target.value)} />
                      <button 
                        name="add-catnum-button" 
                        type="add"
                        onClick={queueCatalogueNum}
                        id="add"
                      >Add</button>
                    </> : <>Catalogue Numbers: This composer has no associated catalogues in the database.</> }
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