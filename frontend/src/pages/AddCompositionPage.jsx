// Import dependencies
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { server_url } from '../config';
import { CompositionForm } from '../components/forms/CompositionForm.mjs';

export const AddCompositionPage = () => {
  // State variables for database entities
  const [englishTitle, setEnglishTitle] = useState('');
  const [nativeTitle, setNativeTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [composerID, setComposerID] = useState('SELECT');
  const [dedication, setDedication] = useState('');
  const [compositionYear, setCompositionYear] = useState('');
  const [formID, setFormID] = useState('SELECT');
  const [keySignature, setKeySignature] = useState('SELECT');
  const [opusNums, setOpusNums] = useState([]);
  const [catalogueNums, setCatalogueNums] = useState([]);
  const [featuredInstrumentation, setFeaturedInstrumentation] = useState([]);
  const [movements, setMovements] = useState([]);

  // Flag for success of all database inserts
  const [addSuccess, setAddSuccess] = useState(true);

  // Use the useNavigate module for redirection
  const redirect = useNavigate();

  // Form Functions ********************************************

  // Add the composition and auxillary entities
  const addComposition = async () => {

    // Check required fields
    if (!composerID || composerID === 'SELECT' ||
      !compositionYear || 
      !formID || formID === 'SELECT') {
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

  return (
    <>
      <article>
        <h2>Add a Composition</h2>
        <p>Fill out the fields below to add a composition to the database.</p>
          <h3>Details</h3>
          <CompositionForm 
            englishTitle={englishTitle} setEnglishTitle={setEnglishTitle}
            nativeTitle={nativeTitle} setNativeTitle={setNativeTitle}
            subtitle={subtitle} setSubtitle={setSubtitle}
            composerID={composerID} setComposerID={setComposerID}
            dedication={dedication} setDedication={setDedication}
            compositionYear={compositionYear} setCompositionYear={setCompositionYear}
            formID={formID} setFormID={setFormID}
            keySignature={keySignature} setKeySignature={setKeySignature}
            opusNums={opusNums} setOpusNums={setOpusNums}
            catalogueNums={catalogueNums} setCatalogueNums={setCatalogueNums}
            featuredInstrumentation={featuredInstrumentation} setFeaturedInstrumentation={setFeaturedInstrumentation}
            movements={movements} setMovements={setMovements}
            onSubmit={addComposition}
          />       
      </article>
    </>
  )
}

export default AddCompositionPage;