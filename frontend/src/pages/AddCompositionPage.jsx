// Import dependencies
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { server_url } from '../config';
import { CompositionForm } from '../components/forms/CompositionForm.mjs';
import * as service from '../modules/compositionService.mjs';

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
      service.addOpusNums(newCompositionID, opusNums);
    }

    // INSERT Catalogue Number(s), if any
    if (catalogueNums.length > 0) {
      service.addCatalogueNums(newCompositionID, catalogueNums);
    }

    // INSERT Featured Instrumentation
    await service.addFeaturedInstrumentation(newCompositionID, featuredInstrumentation);

    // INSERT Movement(s)
    await service.addMovements(newCompositionID, movements);
    
    if (addSuccess === true) {
      redirect(`/composition/${newCompositionID}`);
    }
  };

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