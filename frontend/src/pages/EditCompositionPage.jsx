// Import dependencies
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { server_url } from '../config';
import { CompositionForm } from '../components/forms/CompositionForm.mjs';
import * as service from '../modules/compositionService.mjs';
import * as fetchers from '../modules/fetchService.mjs'

export const EditCompositionPage = () => {
  // State variable for composition to update
  const { compositionID } = useParams();
  const [composition, setComposition] = useState({});

  // State variables for database entities
  const [englishTitle, setEnglishTitle] = useState('');
  const [nativeTitle, setNativeTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [composerID, setComposerID] = useState('');
  const [dedication, setDedication] = useState('');
  const [compositionYear, setCompositionYear] = useState('');
  const [formID, setFormID] = useState('');
  const [keySignature, setKeySignature] = useState('SELECT');
  const [opusNums, setOpusNums] = useState([]);
  const [catalogueNums, setCatalogueNums] = useState({});
  const [featuredInstrumentation, setFeaturedInstrumentation] = useState([]);
  const [movements, setMovements] = useState([]);

  // Flag for success of all database inserts
  const [editSuccess, setEditSuccess] = useState(true);

  // Assign redirect function
  const redirect = useNavigate();

  // RETRIEVE the information for this composition
  const loadComposition = useCallback(() => {
    fetchers.fetchComposition(compositionID, setComposition);
  }, [compositionID]);

  // LOAD the composition data
  useEffect(() => {
    loadComposition();
  }, [loadComposition]);

  // Populate the form with the composition data
  useEffect(() => {
    if(Object.keys(composition).length !== 0) {
      if(composition.titleEnglish) { setEnglishTitle(composition.titleEnglish); }
      if(composition.titleNative) { setNativeTitle(composition.titleNative); }
      if(composition.subtitle) { setSubtitle(composition.subtitle); }
      setComposerID(composition.composerID);
      if(composition.dedication) { setDedication(composition.dedication); }
      setCompositionYear(composition.compositionYear);
      setFormID(composition.form.id);
      if(composition.keySignature) { setKeySignature(composition.keySignature); }
      setOpusNums(composition.opusNums);
      setCatalogueNums(composition.catalogueNums);
      setFeaturedInstrumentation(composition.featuredInstrumentation);
      if(composition.movements.length > 1) { setMovements(composition.movements); }
    }
  }, [composition]);

  // Form Functions ********************************************

  // UPDATE the composition in the database with the modified data
  const editComposition = async () => {
    const compositionResponse = await fetch(`${server_url}/api/compositions/${compositionID}`, {
      method: 'PUT',
      body: JSON.stringify({
        englishTitle: englishTitle,
        nativeTitle: nativeTitle,
        subtitle: subtitle,
        composerID: composerID,
        dedication: dedication,
        compositionYear: compositionYear,
        formID: formID,
        keySignature: keySignature
      }),
      headers: {'Content-Type': 'application/json',},
    });
    if(compositionResponse.ok){
      console.log(`"${englishTitle ? englishTitle : nativeTitle}" has been successfully updated!`);
    } 
    else {
      setEditSuccess(false);
      console.log(`Unable to edit composition. Request returned status code ${compositionResponse.status}`);
    }

    // INSERT Opus Number(s), if any
    if (opusNums.length > 0) {
      const response = await fetch(`${server_url}/api/opus-nums/for-composition-${compositionID}`, { method: 'DELETE'});
      if (response.ok) {
        service.addOpusNums(compositionID, opusNums);
      } else {
        setEditSuccess(false);
        console.error(`Unable to delete opus num(s) from composition with ID ${compositionID}, status code = ${response.status}`)
      }
    }

    // INSERT Catalogue Number(s), if any
    if (catalogueNums.length > 0) {
      const response = await fetch(`${server_url}/api/catalogue-nums/for-composition-${compositionID}`, { method: 'DELETE'});
      if (response.ok) {
        service.addCatalogueNums(compositionID, catalogueNums);
      } else {
        setEditSuccess(false);
        console.error(`Unable to delete catalogue num(s) from composition with ID ${compositionID}, status code = ${response.status}`)
      }
    }

    // INSERT Featured Instrumentation
    if (featuredInstrumentation.length > 0) {
      const response = await fetch(`${server_url}/api/featured-instruments/for-composition-${compositionID}`, { method: 'DELETE'});
      if (response.ok) {
        await service.addFeaturedInstrumentation(compositionID, featuredInstrumentation);
      } else {
        setEditSuccess(false);
        console.error(`Unable to delete featured instrument(s) from composition with ID ${compositionID}, status code = ${response.status}`)
      }
    }

    // INSERT Movement(s)
    if (movements.length > 0) {
      const response = await fetch(`${server_url}/api/movements/for-composition-${compositionID}`, { method: 'DELETE'});
      if (response.ok) {
        await service.addMovements(compositionID, movements);
      } else {
        setEditSuccess(false);
        console.error(`Unable to delete movement(s) from composition with ID ${compositionID}, status code = ${response.status}`)
      }
    }
    
    if (editSuccess === true) {
      redirect(`/composition/${compositionID}`);
    }
  };

  return (
    <>
      <article>
        <h2>Editing {composition.titleEnglish ? composition.titleEnglish : composition.titleNative ? composition.titleNative : ''}</h2>
        <p>Make your edits to {composition.titleEnglish ? composition.titleEnglish : composition.titleNative ? composition.titleNative : ''} and click "Submit" to update the entry in the database.</p>
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
          onSubmit={editComposition}
        />
      </article>
    </>
  )
}

export default EditCompositionPage;