-- CS 340 - Group 81
-- Classical Compositions & Recordings Database
--
-- Team Members: Jacob Barber, Aiden Murphy, Matthew Menold
-- --------------------------------------------------------

/* Composer Queries *******************************************/

-- CREATE Composer

INSERT INTO Composers (
  firstName, 
  lastName, 
  birthDate, 
  deathDate
) VALUES (
  :firstName, 
  :lastName, 
  :birthDate, 
  :deathDate
)

-- RETRIEVE Composers
SELECT * FROM Composers;

-- RETRIEVE Composer by ID
SELECT composerID FROM Composers 
WHERE firstName = :firstName AND lastName = :lastName;

-- UPDATE Composer
UPDATE Composers 
SET 
  firstName = :firstName, 
  lastName = :lastName, 
  birthDate = :birthDate, 
  deathDate = :deathDate
WHERE composerID = ?;

-- DELETE Composer 
DELETE FROM Composers WHERE composerID = :composerID;

/* Catalogue & CatalogueNum Queries ***************************/

-- CREATE Catalogue
INSERT INTO Catalogues (
  composerID, 
  catalogueTitle, 
  catalogueSymbol, 
  authorFirst, 
  authorLast, 
  publicationYear
) VALUES (
  :composerID, 
  :catalogueTitle, 
  :catalogueSymbol, 
  :authorFirst, 
  :authorLast, 
  publicationYear
);

-- RETRIEVE Catalogues
SELECT 
  Catalogues.catalogueID, 
  Catalogues.catalogueTitle, 
  Catalogues.composerID, 
  Composers.firstName AS composerFirst,
  Composers.lastName AS composerLast, 
  Catalogues.catalogueSymbol, 
  Catalogues.authorFirst, 
  Catalogues.authorLast, 
  Catalogues.publicationYear 
FROM Catalogues 
INNER JOIN Composers ON Catalogues.composerID = Composers.composerID;

-- RETRIEVE Catalogue by ID
SELECT * FROM Catalogues WHERE catalogueID = ?;

-- RETRIEVE Catalogues for Composer
SELECT * FROM Catalogues WHERE composerID = :composerID;

-- UPDATE Catalogue
UPDATE Catalogues 
SET 
  composerID = :composerID, 
  catalogueTitle = :catalogueTitle, 
  catalogueSymbol = :catalogueSymbol, 
  authorFirst = ;authorFirst, 
  authorLast = :authorLast,
  publicationYear = :publicationYear 
WHERE catalogueID = :catalogueID;

-- DELETE Catalogue
DELETE FROM Catalogues WHERE catalogueID = :catalogueID;

-- CREATE CatalogueNum
INSERT INTO CatalogueNums (
  catalogueID,
  compositionID,
  catNum
) VALUES (
  :catalogueID,
  :compositionID,
  :catNum
);

-- DELETE CatalogueNum
DELETE FROM CatalogueNums WHERE compositionID = :compositionID;

/* Form Queries ***********************************************/

-- CREATE Form
INSERT INTO Forms (formName) VALUES (:formName);

-- RETRIEVE Forms
SELECT * FROM Forms;

-- RETRIEBE Form by ID
SELECT * FROM Forms WHERE formID = :formID;

-- UPDATE Form
UPDATE Forms SET formName = :formName WHERE formID = :formID;

-- DELETE Form
SELECT * FROM Forms WHERE formID = :formID;

/* KeySignature Queries */

-- RETRIEVE KeySignatures
SELECT
  keyID AS id, 
  keyName AS name,
  keyType AS type 
FROM KeySignatures;

/* Instruments & InstrumentFamiliy Queries */

-- CREATE Instrument
INSERT INTO Instruments (
  instrumentName, 
  familyID
) VALUES (
  :instrumentName, 
  :familyID
);

-- RETRIEVE InstrumentFamilies
SELECT * FROM InstrumentFamilies;

-- RETRIEVE Instruments by Family
SELECT
  familyID AS family,
  instrumentID AS id,
  scorePosition,
  instrumentName AS name
FROM Instruments WHERE familyID = ?;

-- UPDATE Instrument
UPDATE Instruments 
SET 
  instrumentName = :instrumentName 
WHERE instrumentID = :instrumentID;

-- DELETE Instrument
DELETE FROM Instruments WHERE instrumentID = :instrumentID;

/* Composition Queries ****************************************/

-- CREATE Composition
INSERT INTO Compositions (
  titleEnglish,
  titleNative,
  subtitle,
  composerID,
  dedication,
  compositionYear,
  formID,
  keyID
) VALUES (
  :titleEnglish,
  :titleNative,
  :subtitle,
  :composerID,
  :dedication,
  :compositionYear,
  :formID,
  :keyID
);

-- RETRIEVE Compositions (Movements, OpusNums, CatalogueNums, FeaturedInstrumentation)
SELECT
  Compositions.compositionID,
  IFNULL(Compositions.titleEnglish, Compositions.titleNative) AS title,
  Compositions.titleEnglish,
  Compositions.titleNative,
  Compositions.subtitle,
  Compositions.dedication,
  IFNULL((SELECT 
      JSON_ARRAYAGG(OpusNums.opNum)
      FROM OpusNums
      WHERE OpusNums.compositionID = Compositions.compositionID), '[]') AS opusNums,
  -- Retrieve catalogue numbers (if any) as an array of objects
  IFNULL((SELECT 
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'catalogueID', CatalogueNums.catalogueID,
        'title',  (SELECT catalogueTitle FROM Catalogues WHERE catalogueID = CatalogueNums.catalogueID),
        'symbol', (SELECT catalogueSymbol FROM Catalogues WHERE catalogueID = CatalogueNums.catalogueID),
        'catNum', CatalogueNums.catNum))
    FROM CatalogueNums
    WHERE CatalogueNums.compositionID = Compositions.compositionID), '[]') AS catalogueNums,
  Compositions.composerID, 
  Composers.firstName AS composerFirst, 
  Composers.lastName AS composerLast,
  -- Retrieve form as object for use in filtering
  (SELECT
    JSON_OBJECT(
      'id', Forms.formID,
      'name', Forms.formName)
    FROM Forms
    WHERE Forms.formID = Compositions.formID) AS form,
  -- Retrieve key signature (if present) as object
  (SELECT CASE
    WHEN Compositions.keyID IS NOT NULL THEN
      (SELECT JSON_OBJECT(
        'id', KeySignatures.keyID,
        'name', KeySignatures.keyName,
        'type', KeySignatures.keyType)
      FROM KeySignatures
      WHERE KeySignatures.keyID = Compositions.keyID) END) AS keySignature,
  -- Retrieve Featured Instruments as an array of objects
  IFNULL((SELECT 
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'id', Instruments.instrumentID,
        'family', Instruments.familyID,
        'scorePosition', Instruments.scorePosition,
        'name', Instruments.instrumentName)) 
    FROM Instruments
    INNER JOIN FeaturedInstrumentation 
    ON Instruments.instrumentID = FeaturedInstrumentation.instrumentID
    WHERE FeaturedInstrumentation.compositionID = Compositions.compositionID), '[]') AS featuredInstrumentation,
  Compositions.compositionYear,
  IFNULL((SELECT 
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'num', Movements.movementNum,
            'title', Movements.title))
    FROM Movements
    WHERE Movements.compositionID = Compositions.compositionID), '[]') AS movements,
  Compositions.infoText 
  FROM Compositions 
  INNER JOIN Composers ON Compositions.composerID = Composers.composerID;

-- RETRIEVE Composition Filters (append one or more to the above SELECT query)
  -- By Composition
  WHERE Compositions.composerID = :composerID;

  -- By Form
  AND Compositions.formID = :formID;

  -- By KeySignature
  AND Compositions.keyID IS NULL /* OR */ AND Compositions.keyID = :keyID;

  -- By FeaturedInstrumentation
  AND EXISTS (
    SELECT 1 FROM FeaturedInstrumentation 
    WHERE FeaturedInstrumentation.compositionID = Compositions.compositionID 
    AND FeaturedInstrumentation.instrumentID = ?
  );

  -- By Minimum Composition Year
  AND Compositions.compositionYear >= :compositionYear;

  -- By Maximum Composition Year
  AND Compositions.compositionYear <= :compositionYear;

-- UPDATE Composition
UPDATE Compositions
SET
  titleEnglish = :titleEnglish,
  titleNative = :titleNative,
  subtitle = :subtitle,
  composerID = :composerID,
  dedication = :dedication,
  compositionYear = :compositionYear,
  formID = :formID,
  keyID = :keyID
WHERE compositionID = compositionID;

-- DELETE Composition
DELETE FROM Compositions WHERE compositionID = :compositionID;

/* Movement Queries *******************************************/

-- CREATE Movement
INSERT INTO Movements (
  compositionID,
  movementNum,
  title
) VALUES (
  :compositionID,
  :movementNum,
  :title
);

-- DELETE Movement
DELETE FROM Movements WHERE compositionID = :compositionID;

/* OpusNum Queries ********************************************/

-- CREATE OpusNum
INSERT INTO OpusNums (
  compositionID,
  opNum
) VALUES (
  :compositionID,
  :opNum
);

-- DELETE OpusNum
DELETE FROM OpusNums WHERE compositionID = :compositionID;

/* FeaturedInstrumentation Queries ****************************/

-- CREATE FeaturedInstrument
INSERT INTO FeaturedInstrumentation (
  compositionID,
  instrumentID
) VALUES (
  :compositionID,
  :instrumentID
);

-- DELETE FeaturedInstrument
DELETE FROM FeaturedInstrumentation WHERE compositionID = :compositionID;

/* CompositionPlayer & DoubledInstrument Queries **************/

-- RETRIEVE Detailed Instrumentation (CompositionPlayers & DoubledInstruments)
SELECT 
  Instruments.familyID,
  CompositionPlayers.isSection,
  Instruments.scorePosition,
  COUNT(DISTINCT CompositionPlayers.playerID) AS numInstruments,
  Instruments.instrumentID,
  Instruments.instrumentName,
  -- Get the name of the key signature for display
  (SELECT
    KeySignatures.keyName 
    FROM KeySignatures 
    WHERE KeySignatures.keyID = CompositionPlayers.keyID) as instrumentKey,
  COUNT(DISTINCT DoubledInstruments.playerID) AS numDoubling,
  -- Get a list of the instruments doubling for this instrument 
  GROUP_CONCAT(DISTINCT 
    IF(DoubledInstruments.keyID IS NOT NULL, 
      CONCAT(doubled.instrumentName, ' in ', 
      (SELECT
        KeySignatures.keyName 
        FROM KeySignatures 
        WHERE KeySignatures.keyID = DoubledInstruments.keyID)),
      doubled.instrumentName) 
      SEPARATOR ', ') AS doubles,
  -- Get a list of the chairs which are doubling instruments    
  GROUP_CONCAT(DISTINCT 
    IF(DoubledInstruments.instrumentID IS NOT NULL, CompositionPlayers.chairNum, NULL) 
    SEPARATOR ', ') AS chairsDoubling
FROM CompositionPlayers
INNER JOIN Instruments ON CompositionPlayers.instrumentID = Instruments.instrumentID
LEFT JOIN DoubledInstruments ON DoubledInstruments.playerID = CompositionPlayers.playerID
LEFT JOIN Instruments AS doubled ON DoubledInstruments.instrumentID = doubled.instrumentID
WHERE CompositionPlayers.compositionID = ?
AND Instruments.familyID = ?
AND CompositionPlayers.isSection = FALSE
GROUP BY
  CompositionPlayers.keyID, 
  Instruments.instrumentID
-- Fetch a reduced version for sections
UNION
SELECT 
  Instruments.familyID,
  CompositionPlayers.isSection,
  Instruments.scorePosition,
  COUNT(DISTINCT CompositionPlayers.playerID) AS numInstruments,
  Instruments.instrumentID,
  CONCAT(
    Instruments.instrumentName,
    IF(Instruments.instrumentName = "Double Bass", 'es ', 's '), 
    IF(CompositionPlayers.chairNum != 0, CompositionPlayers.chairNum, '')) AS instrumentName, 
  (SELECT
    KeySignatures.keyName 
    FROM KeySignatures 
    WHERE KeySignatures.keyID = CompositionPlayers.keyID) as instrumentKey,
  NULL AS doubles,
  NULL AS numDoubling,
  NULL AS chairsDoubling
FROM CompositionPlayers
INNER JOIN Instruments ON CompositionPlayers.instrumentID = Instruments.instrumentID
WHERE CompositionPlayers.compositionID = ?
AND Instruments.familyID = ?
AND CompositionPlayers.isSection = TRUE
GROUP BY
  CompositionPlayers.keyID, 
  CompositionPlayers.playerID
ORDER BY familyID, instrumentID;