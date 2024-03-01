-- CS 340 - Group 81
-- Classical Compositions & Recordings Database
--
-- Team Members: Jacob Barber, Aiden Murphy, Matthew Menold
-- --------------------------------------------------------

/* Read Queries */

/* Display Composers */
SELECT 
    CONCAT(firstName, " ", lastName) AS name, 
    DATE_FORMAT(birthDate,'%M %e, %Y') AS birthDate, 
    DATE_FORMAT(deathDate,'%M %e, %Y') As deathDate
FROM Composers;

/* Display Compositions */
SELECT 
    Compositions.titleEnglish, 
    -- Display Opus Numbers as "Op.1, 2, ..."
    IFNULL(CONCAT("Op.", ( 
            SELECT GROUP_CONCAT(OpusNums.opNum SEPARATOR ', ')
            FROM OpusNums
            WHERE OpusNums.compositionID = Compositions.compositionID
            GROUP BY OpusNums.compositionID
        )), "") AS opusNum,
    -- Display Catalogue Numbers as "A.1, B.2, ..."
    IFNULL((SELECT 
        GROUP_CONCAT(CONCAT(Catalogues.catalogueSymbol, CatalogueNums.catNum) SEPARATOR ', ')
        FROM CatalogueNums 
        INNER JOIN Catalogues ON CatalogueNums.catalogueID = Catalogues.catalogueID
        WHERE CatalogueNums.compositionID = Compositions.compositionID
        GROUP BY CatalogueNums.compositionID
    ), "") AS catalogueNum,
    CONCAT(Composers.firstName, " ", Composers.lastName) AS composerName,
    (SELECT 
        Forms.formName
        FROM Forms
        WHERE Forms.formID = Compositions.formID) AS form,
    IFNULL(Compositions.musicalKey, "") AS keySignature,
    -- List instrumentation for this composition
    (SELECT 
        GROUP_CONCAT(Instruments.instrumentName SEPARATOR ', ')
        FROM CompositionInstruments
        INNER JOIN Instruments ON CompositionInstruments.instrumentID = Instruments.instrumentID
        WHERE CompositionInstruments.compositionID = Compositions.compositionID
        GROUP BY CompositionInstruments.compositionID
    ) AS instrumentation,
    Compositions.compositionYear
FROM Compositions 
INNER JOIN Composers ON Compositions.composerID = Composers.composerID
-- If :filterComposerID is provided, filter the compositions by composer, otherwise return all rows
WHERE (:filterComposerID IS NULL OR Compositions.composerID = :filterComposerID);

/* Display Movements */
SELECT 
    titleEnglish,
    composer,
    movementNum,
    movementTitle
FROM (
    -- Perform subquery so that table only displays the Title and Composer on the First Row it appears
    SELECT 
        -- Check if we are on a new row, otherwise display empty string
        IF(@curCompID = Compositions.compositionID, "", @curTitle := Compositions.titleEnglish) AS titleEnglish,
        IF(@curCompID = Compositions.compositionID, "", @curComposer := Composers.lastName) AS composer,
        Movements.movementNum, 
        IFNULL(Movements.title, "") AS movementTitle,
        @curCompID := Compositions.compositionID -- Update the current composition ID
    FROM Movements
    INNER JOIN Compositions ON Movements.compositionID = Compositions.compositionID
    INNER JOIN Composers ON Compositions.composerID = Composers.composerID
    ORDER BY Compositions.compositionID, Movements.movementNum
) AS subquery;

/* Display Catalogues */
SELECT 
    Catalogues.catalogueTitle AS title,
    CONCAT(Composers.firstName, " ", Composers.lastName) AS composer, 
    Catalogues.catalogueSymbol,
    CONCAT(Catalogues.authorFirst, " ", Catalogues.authorLast) AS author,
    Catalogues.publicationYear
FROM Catalogues
INNER JOIN Composers ON Catalogues.composerID = Composers.composerID;

/* Display Forms */
SELECT formName FROM Forms;

/* Display Instruments */
SELECT instrumentName FROM Instruments;

/* Display Key Signatures */
SELECT * FROM KeySignatures;

/* Create Queries */

/* Add Composers */
INSERT INTO Composers (
    firstName,
    lastName,
    birthDate,
    deathDate
)
VALUES
(
    :composerFirstName,
    :composerLastName,
    :composerBirthDate,
    :composerDeathDate
);

/* Add Compositions */
INSERT INTO Compositions (
    titleEnglish,
    composerID,
    form,
    musicalKey,
    compositionYear
)
VALUES
(
    :compositionTitle,
    :composerID,
    :compositionFormID,
    :compositionKey,
    :compositionYear
);

/* Add Opus Numbers */
INSERT INTO OpusNums (
    compositionID,
    opNum
)
VALUES
(
    :compositionID
    :opNum
);

/* Add Movements */
INSERT INTO Movements (
    compositionID,
    movementNum,
    title
)
VALUES
(
    :compositionID,
    :movementNum,
    :movementTitle
);

/* Add Instrumentation */
INSERT INTO CompositionInstruments (
    compositionID,
    instrument
)
VALUES 
(
    :compositionID,
    :instrumentID
);

/* Add Catalogues */
INSERT INTO Catalogues (
    composerID,
    catalogueTitle,
    catalogueSymbol,
    authorFirst,
    authorLast,
    publicationYear
)
VALUES
(
    :composerID,
    :catalogueTitle,
    :catalogueSymbol,
    :catalogueAuthorFirstName,
    :catalogueAuthorLastName,
    :cataloguePublicationYear
);

/* Add Catalogue Numbers */
INSERT INTO CatalogueNums (
    catalogueID,
    compositionID,
    catNum,
)
VALUES
(
    :catalogueID,
    :compositionID,
    :catalogueNum
);

/* Add Forms */
INSERT INTO Forms (
    formName
)
VALUES
(
    :formName
);

/* Add Instruments */
INSERT INTO Instruments (
    instrumentName
)
VALUES
(
    :instrumentName
);

/* Update Queries */

-- CompositionInstruments, OpusNums and CatalogueNums are "rudimentary" elements 
-- that should only be added or removed. KeySignatures cannot be modified as
-- its contents are well-defined and limited in scope.

/* Update Composers */
UPDATE Composers SET
    firstName = :composerFirstName,
    lastName = :composerLastName,
    birthDate = :composerBirthDate,
    deathDate = :composerDeathDate
WHERE composerID = :composerID;

/* Update Compositions */
UPDATE Compositions SET
    titleEnglish = :compositionTitle,
    composerID = :composerID,
    form = :compositionFormID,
    musicalKey = :compositionKey,
    compositionYear = :compositionYear
WHERE compositionID = :compositionID;

/* Update Movements */
UPDATE Movements SET
    title = :movementTitle
WHERE compositionID = :compositionID
AND movementNum = :movementNum;

/* Update Catalogues */
UPDATE Catalogues SET
    composerID = :composerID,
    catalogueTitle = :catalogueTitle,
    catalogueSymbol = :catalogueSymbol,
    authorFirst = :catalogueAuthorFirstName,
    authorLast = :catalogueAuthorLastName,
    publicationYear = :cataloguePublicationYear
WHERE catalogueID = :catalogueID;

/* Update Forms */
UPDATE Forms SET
    formName = :formName,
WHERE formID = :formID;

/* Update Instruments */
UPDATE Instruments SET
    instrumentName = :instrumentName,
WHERE instrumentID = :instrumentID;

/* Delete Queries */

-- Key signatures cannot be deleted since all key signatures are well-defined
-- and should not be added, removed, or modified

/* Delete a Composer */
DELETE FROM Composers WHERE composerID = :composerID;

/* Delete a Composition */
DELETE FROM Compositions 
WHERE compositionID = :compositionID;

/* Delete a Movement */
DELETE FROM Movements 
WHERE compositionID = :compositionID 
AND movementNum = :movementNum;

/* Delete an Opus Number */
DELETE FROM OpusNums 
WHERE compositionID = :compositionID 
AND opNum = :opNum;

/* Delete from CompositionInstruments */
DELETE FROM CompositionInstruments 
WHERE compositionID = :compositionID 
AND instrumentID = :instrumentID;

/* Delete a Catalogue */
DELETE FROM Catalogues 
WHERE catalogueID = :catalogueID;

/* Delete a Catalogue Number */
DELETE FROM CatalogueNums 
WHERE catalogueID = :catalogueID 
AND compositionID = :compositionID;

/* Delete a Form */
DELETE FROM Forms 
WHERE formID = :formID;

/* Delete an Instrument */
DELETE FROM Instruments 
WHERE instrumentID = :instrumentID;
