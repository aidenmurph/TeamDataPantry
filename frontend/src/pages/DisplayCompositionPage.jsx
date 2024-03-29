import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import MovementList from '../components/display/MovementList.mjs';
import CompositionInfoPanel from '../components/display/CompositionInfoPanel.mjs';
import InstrumentationDisplay from '../components/display/InstrumentationDisplay.mjs';
import * as fetchers from '../modules/fetchService.mjs'
import { convertFlatSharp } from '../modules/utilities.mjs';

function DisplayCompositionPage() {
  // State variables for displaying composition
  const { compositionID } = useParams();
  const [composition, setComposition] = useState([]);
  const [familyList, setFamilyList] = useState([]);
  const [instrumentation, setInstrumentation] = useState([]);

  // RETRIEVE the information for this composition
  const loadComposition = useCallback(() => {
    fetchers.fetchComposition(compositionID, setComposition);
  }, [compositionID]);

  // RETRIEVE the list of instrument families
  const loadFamilyList = useCallback(() => {
    fetchers.fetchFamilyList(setFamilyList);
  }, []);

  // RETRIEVE the full instrumentation for this composition
  const loadInstrumentation = useCallback(() => {
    if (familyList.length) {
      fetchers.fetchFullInstrumentation(compositionID, familyList, setInstrumentation);
    }
  }, [familyList, compositionID]);

  // LOAD the composition data
  useEffect(() => {
    loadComposition();
  }, [loadComposition]);

  // LOAD the list of instrument families
  useEffect(() => {
    loadFamilyList();
  }, [loadFamilyList]);

  // LOAD the detailed instrumentation for this composition
  useEffect(() => {
    if (familyList.length > 0) {
      loadInstrumentation();
    }
  }, [loadInstrumentation, familyList]);

  const checkNumInstruments = (instrumentation) => {
    let numInstruments = 0;
    for (let i = 0; i < instrumentation.length; ++i)
    {
      numInstruments += instrumentation[i].length;
    }
    return numInstruments;
  }

  return (
    <>
      <h2>{convertFlatSharp(composition.titleEnglish ? composition.titleEnglish : composition.titleNative)}</h2>
      <article>
        <CompositionInfoPanel
          composition={composition} 
          movements={composition.movements ? composition.movements : ''} />

        <section id="info">
          <h3>Overview</h3>
          <p>Displaying details for composition with ID {compositionID}</p>
          <p>{composition.infoText}</p>
        </section>

        {checkNumInstruments(instrumentation) > 1 ? 
          <section id="instrumentation">
            <h3>Instrumentation</h3>
            <div className="instrumentationDisplayTables">
              {familyList.map((family, i) => 
                instrumentation[i].length ? 
                  <InstrumentationDisplay 
                    key={family.familyID}
                    family={family}
                    instrumentation={instrumentation[i] || []} 
                  />
                : ''
              )}
            </div>
          </section>
        : ''}

        {composition.movements && composition.movements.length > 1 ? 
          <section id="movements">
            <h3>Movements</h3>
            <MovementList movements={composition.movements} />
          </section> 
        : ''}
      </article>
    </>
  );
}

export default DisplayCompositionPage;