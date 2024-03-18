-- CS 340 - Group 81
-- Classical Compositions & Recordings Database
--
-- Team Members: Jacob Barber, Aiden Murphy, Matthew Menold
-- --------------------------------------------------------

/* Table Creation */

/* Unsigned SMALLINT datatypes were utilized in place of YEAR values since
 * YEAR values are restricted to years 1901-2500, and many items in our 
 * schema concern years prior to 1901 */

-- Settings to avoid import errors
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- Composers
-- DESC: A composer of one or more compositions stored in the database
CREATE OR REPLACE TABLE Composers(
    composerID INT NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    birthDate DATE NOT NULL,
    deathDate DATE,
    CHECK (deathDate IS NULL OR deathDate >= birthDate),
    PRIMARY KEY (composerID)
);

-- Forms (Category Table)
-- DESC: The form or structure of a composition, such as a sonata, symphony, or concerto
CREATE OR REPLACE TABLE Forms(
    formID INT NOT NULL AUTO_INCREMENT,
    formName VARCHAR(50) NOT NULL,
    UNIQUE (formName),
    PRIMARY KEY (formID)
);

-- KeySignatures (Category Table)
-- DESC: The key for a composition or instrument
CREATE OR REPLACE TABLE KeySignatures(
    keyID INT NOT NULL AUTO_INCREMENT,
    keyName VARCHAR(25),
    keyType VARCHAR(11) NOT NULL,
    CHECK (keyType = "Major" OR keyType = "Minor" OR keyType = "Instrument"),
    UNIQUE (keyName),
    PRIMARY KEY (keyID)
);

-- Compositions
-- DESC: A single composition of one or more movements created by a composer
CREATE OR REPLACE TABLE Compositions(
    compositionID INT AUTO_INCREMENT NOT NULL,
    titleEnglish VARCHAR(255),  -- The english title of the composition
    titleNative VARCHAR(255),   -- The title of the composition in the original language
    CHECK(titleEnglish IS NOT NULL OR titleNative IS NOT NULL),
    subtitle VARCHAR(255),
    dedication VARCHAR(100),
    composerID INT NOT NULL,
    FOREIGN KEY (composerID) REFERENCES Composers(composerID) ON DELETE CASCADE,
    compositionYear SMALLINT UNSIGNED NOT NULL,
    formID INT NOT NULL,
    FOREIGN KEY (formID) REFERENCES Forms(formID) ON DELETE CASCADE,
    keyID INT,
    FOREIGN KEY (keyID) REFERENCES KeySignatures(keyID),
    infoText LONGTEXT,
    PRIMARY KEY (compositionID)
);

-- Movements
-- DESC: A single movement or section in a larger composition
CREATE OR REPLACE TABLE Movements(
    compositionID INT NOT NULL,
    FOREIGN KEY (compositionID) REFERENCES Compositions(compositionID) ON DELETE CASCADE,
    movementNum INT NOT NULL,
    title VARCHAR(255),
    PRIMARY KEY (compositionID, movementNum)
);

-- OpusNums
-- DESC: An opus number associated with a given composition, used for lookups
-- NOTE: For historical reasons, a composition may have 0 or more opus numbers
--       associated with it, necessitating the M:1 relationship
CREATE OR REPLACE TABLE OpusNums(
    compositionID INT NOT NULL,
    FOREIGN KEY (compositionID) REFERENCES Compositions(compositionID) ON DELETE CASCADE,
    opNum VARCHAR(9),
    PRIMARY KEY (compositionID, opNum)
);

-- Catalogues
-- DESC: An ordering of a specific composer’s body of work, assembled by an outside party
CREATE OR REPLACE TABLE Catalogues(
    catalogueID INT AUTO_INCREMENT NOT NULL,
    composerID INT NOT NULL,
    FOREIGN KEY (composerID) REFERENCES Composers(composerID) ON DELETE CASCADE,
    catalogueTitle VARCHAR(255) NOT NULL,
    authorFirst VARCHAR(50) NOT NULL,
    authorLast VARCHAR(50) NOT NULL,
    catalogueSymbol VARCHAR(17) NOT NULL,
    publicationYear SMALLINT UNSIGNED NOT NULL,
    PRIMARY KEY (catalogueID)
);

-- CatalogueNums
-- DESC: A catalogue number referring to a specific composition
CREATE OR REPLACE TABLE CatalogueNums(
    catalogueID INT NOT NULL,
    FOREIGN KEY (catalogueID) REFERENCES Catalogues(catalogueID) ON DELETE CASCADE,
    compositionID INT NOT NULL,
    FOREIGN KEY (compositionID) REFERENCES Compositions(compositionID) ON DELETE CASCADE,
    catNum VARCHAR(9) NOT NULL,
    PRIMARY KEY (catalogueID, catNum)
);

-- InstrumentFamilies (Category Table)
-- DESC: A family of musical instruments, such as Brass or Strings. 
--      Used for grouping instruments to aid in display and selection. 
CREATE OR REPLACE TABLE InstrumentFamilies(
    familyID INT NOT NULL AUTO_INCREMENT,
    familyName VARCHAR(25),
    PRIMARY KEY (familyID)
);

-- Instruments (Category Table)
-- DESC: A musical instrument, such as a piano or violin or an 
--       instrument ensemble, such as an orchestra or string quartet
CREATE OR REPLACE TABLE Instruments(
    instrumentID INT NOT NULL AUTO_INCREMENT,
    instrumentName VARCHAR(50) NOT NULL,
    familyID INT NOT NULL,
    FOREIGN KEY (familyID) REFERENCES InstrumentFamilies(familyID) ON DELETE CASCADE,
    scorePosition SMALLINT DEFAULT 99,
    UNIQUE (instrumentName),
    PRIMARY KEY (instrumentID)
);

-- FeaturedInstrumentation (Intersection Table)
-- DESC: The featured instrument(s) or ensemble utilized in the instrumentation 
--       of the composition. Used to query works by instrument
CREATE OR REPLACE TABLE FeaturedInstrumentation(
    compositionID INT,
    FOREIGN KEY (compositionID) REFERENCES Compositions(compositionID) ON DELETE CASCADE,
    instrumentID INT,
    FOREIGN KEY (instrumentID) REFERENCES Instruments(instrumentID) ON DELETE CASCADE,
    PRIMARY KEY (instrumentID, compositionID)
);

-- CompositionPlayers 
-- DESC: An entity representing a single player in the instrumentation  
--       ensemble for a given composition. Each player must hold one instrument,
--       with additional instruments added as DoubledInstruments.
CREATE OR REPLACE TABLE CompositionPlayers(
    playerID INT NOT NULL AUTO_INCREMENT,
    compositionID INT,
    FOREIGN KEY (compositionID) REFERENCES Compositions(compositionID) ON DELETE CASCADE,
    instrumentID INT,
    FOREIGN KEY (instrumentID) REFERENCES Instruments(instrumentID) ON DELETE CASCADE,
    keyID INT,
    FOREIGN KEY (keyID) REFERENCES KeySignatures(keyID) ON DELETE CASCADE,
    chairNum SMALLINT UNSIGNED NOT NULL,
    -- Chair number should be zero for unassigned percussion and un-numbered sections
    CHECK (chairNum >= 0),
    isSection BOOL,
    PRIMARY KEY (playerID)
);

-- DoubledInstruments
-- DESC: An additional instrument held by a CompositionPlayer
CREATE OR REPLACE TABLE DoubledInstruments(
    playerID INT,
    FOREIGN KEY (playerID) REFERENCES CompositionPlayers(playerID) ON DELETE CASCADE,
    instrumentID INT,
    FOREIGN KEY (instrumentID) REFERENCES Instruments(instrumentID) ON DELETE CASCADE,
    keyID INT,
    FOREIGN KEY (keyID) REFERENCES KeySignatures(keyID),
    PRIMARY KEY (playerID, instrumentID)
);

/* Triggers & Procedures */

-- Set delimiter for triggers
DELIMITER //

-- Validate cross-table constraints on creating and updating Composition Players
CREATE TRIGGER ValidateCompositionPlayersBeforeCREATE
BEFORE INSERT ON CompositionPlayers
FOR EACH ROW
BEGIN    
    DECLARE ensembleFamilyID INT;
    DECLARE instrumentKeyType VARCHAR(11);

    -- Check if the instrument belongs to the "Ensemble" family by comparing familyID
    SELECT familyID INTO ensembleFamilyID FROM InstrumentFamilies WHERE familyName = "Ensemble";
    IF (SELECT familyID FROM Instruments WHERE instrumentID = NEW.instrumentID) = ensembleFamilyID THEN
        SIGNAL SQLSTATE "45000"
        SET MESSAGE_TEXT = 'Cannot add instruments from the Ensemble family to instrumentation groups.';
    END IF;

    -- Check if the instrumentKey corresponds to an 'Instrument' type in KeySignatures
    SELECT keyType INTO instrumentKeyType FROM KeySignatures WHERE keyID = NEW.keyID;
    IF instrumentKeyType != 'Instrument' THEN
        SIGNAL SQLSTATE "45000" 
        SET MESSAGE_TEXT = 'Instrument keys must be of type "Instrument".';
    END IF;
END//

CREATE TRIGGER ValidateCompositionPlayersBeforeUPDATE
BEFORE UPDATE ON CompositionPlayers
FOR EACH ROW
BEGIN    
    DECLARE ensembleFamilyID INT;
    DECLARE instrumentKeyType VARCHAR(11);

    -- Check if the instrument belongs to the "Ensemble" family by comparing familyID
    SELECT familyID INTO ensembleFamilyID FROM InstrumentFamilies WHERE familyName = "Ensemble";
    IF (SELECT familyID FROM Instruments WHERE instrumentID = NEW.instrumentID) = ensembleFamilyID THEN
        SIGNAL SQLSTATE "45000" 
        SET MESSAGE_TEXT = 'Cannot add instruments from the Ensemble family to instrumentation groups.';
    END IF;

    -- Check if the instrumentKey corresponds to an 'Instrument' type in KeySignatures
    SELECT keyType INTO instrumentKeyType FROM KeySignatures WHERE keyID = NEW.keyID;
    IF instrumentKeyType != 'Instrument' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Instrument keys must be of type "Instrument".';
    END IF;
END//

CREATE TRIGGER ValidateDoubledInstrumentsBeforeCREATE
BEFORE INSERT ON DoubledInstruments
FOR EACH ROW
BEGIN    
    DECLARE ensembleFamilyID INT;
    DECLARE instrumentKeyType VARCHAR(11);

    -- Check if the instrument belongs to the "Ensemble" family by comparing familyID
    SELECT familyID INTO ensembleFamilyID FROM InstrumentFamilies WHERE familyName = "Ensemble";
    IF (SELECT familyID FROM Instruments WHERE instrumentID = NEW.instrumentID) = ensembleFamilyID THEN
        SIGNAL SQLSTATE "45000" 
        SET MESSAGE_TEXT = 'Cannot add instruments from the Ensemble family to instrumentation groups.';
    END IF;

    -- Check if the instrumentKey corresponds to an 'Instrument' type in KeySignatures
    SELECT keyType INTO instrumentKeyType FROM KeySignatures WHERE keyID = NEW.keyID;
    IF instrumentKeyType != 'Instrument' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Instrument keys must be of type "Instrument".';
    END IF;
END//

CREATE TRIGGER ValidateDoubledInstrumentsBeforeUPDATE
BEFORE UPDATE ON DoubledInstruments
FOR EACH ROW
BEGIN    
    DECLARE ensembleFamilyID INT;
    DECLARE instrumentKeyType VARCHAR(11);

    -- Check if the instrument belongs to the "Ensemble" family by comparing familyID
    SELECT familyID INTO ensembleFamilyID FROM InstrumentFamilies WHERE familyName = "Ensemble";
    IF (SELECT familyID FROM Instruments WHERE instrumentID = NEW.instrumentID) = ensembleFamilyID THEN
        SIGNAL SQLSTATE "45000" 
        SET MESSAGE_TEXT = 'Cannot add instruments from the Ensemble family to instrumentation groups.';
    END IF;

    -- Check if the instrumentKey corresponds to an 'Instrument' type in KeySignatures
    SELECT keyType INTO instrumentKeyType FROM KeySignatures WHERE keyID = NEW.keyID;
    IF instrumentKeyType != 'Instrument' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Instrument keys must be of type "Instrument".';
    END IF;
END//

-- Validate composition composer and catalogue composer are the same,
-- otherwise throw error
CREATE TRIGGER EnsureComposerMatchInCatalogueNum
BEFORE INSERT ON CatalogueNums
FOR EACH ROW
BEGIN
    DECLARE composition_composer INT;
    DECLARE catalogue_composer INT;

    -- Get composerID of the composition
    SELECT composerID INTO composition_composer
    FROM Compositions
    WHERE compositionID = NEW.compositionID;

    -- Get composerID of the catalogue
    SELECT composerID INTO catalogue_composer
    FROM Catalogues
    WHERE catalogueID = NEW.catalogueID;

    -- Check if the composers match, and throw error to abort insert if not
    IF composition_composer != catalogue_composer 
    THEN
        SIGNAL SQLSTATE "45000" 
        SET MESSAGE_TEXT = "Composer of the composition must match the composer associated with the catalogue";
    END IF;
END//

DELIMITER ;

/* Data Insertion */

/* Generally, the entity relationship heirarchy is as follows:
 * 
 * 1) Category Tables: InstrumentFamilies Instruments, Forms, KeySignatures
 * 2) Performers: Composers, Ensembles, EnsembleMembers
 * 3) Compositions: Compositions, Movements, Catalogues
 *  3.5) Composition Numbering: OpusNums, CatalogueNums 
 * 4) Instrumentation: FeaturedInstrumentation, Composition Players, DoubledInstruments
 *
 * Data insertion for lower-numbered entities should be carried out before insertion
 * for higher-numbered entities in order to avoid insertion errors due to FK constraints.
 *
 * NOTE: Intersection tables have been omitted above for simplicity, but they 
 *       require their related entities to exist before adding, and can be assumed 
 *       to fall in the heirarchy below the place of the lowest-numbered entity */

 /* Due to the interconnected nature of the database and the requirement 
  * for a minimum of 3 entries for each table, variables are used to reduce
  * the need for repeated queries of the same primary key */

-- Category Tables
INSERT INTO Forms (formName) 
VALUES
("Symphony"), ("Concerto"), ("Sonata"), ("Fugue"), ("Rhapsody"), ("Pavane"), ("Suite"),
("Opera"), ("Ballet"), ("Overture"), ("Dance"), ("Trio"), ("Quartet"), ("Variations"),
("Moderato"), ("Minuet"), ("Symphonic Poem"), ("Nocturne"), ("Fantasia"),
("Prelude"), ("Cantata"), ("Elegy"), ("Requium"), ("Intermezzo"), ("Ballade");

INSERT INTO KeySignatures (keyName, keyType) 
VALUES
("C major", "Major"), ("A minor", "Minor"), ("G major", "Major"), ("E minor", "Minor"), ("F major", "Major"), ("D minor", "Minor"), ("D major", "Major"),
("B minor", "Minor"), ("B flat major", "Major"), ("G minor", "Minor"), ("A major", "Major"), ("F sharp minor", "Minor"), ("E flat major", "Major"),
("C minor", "Minor"), ("E major", "Major"), ("C sharp minor", "Minor"), ("A flat major", "Major"), ("F minor", "Minor"), ("B major", "Major"),
("G sharp minor", "Minor"), ("D flat major", "Major"), ("B flat minor", "Minor"), ("F sharp major", "Major"), ("D sharp minor", "Minor"),
("G flat major", "Major"), ("E flat minor", "Minor"), ("C sharp major", "Major"), ("A sharp minor", "Minor"), ("C flat major", "Major"),
("A flat minor", "Minor"), ("A", "Instrument"), ("B", "Instrument"), ("C", "Instrument"), ("D", "Instrument"), ("E", "Instrument"), ("F", "Instrument"),
("G", "Instrument"), ("A flat", "Instrument"), ("B flat", "Instrument"), ("D flat", "Instrument"),  ("E flat", "Instrument");

INSERT INTO InstrumentFamilies (familyName) 
VALUES
("Woodwind"), ("Brass"), ("String"), ("Keyboard"), ("Percussion"), ("Choral"), ("Ensemble");

SET @Woodwind = (SELECT familyID FROM InstrumentFamilies WHERE familyName = "Woodwind");
SET @Brass = (SELECT familyID FROM InstrumentFamilies WHERE familyName = "Brass");
SET @String = (SELECT familyID FROM InstrumentFamilies WHERE familyName = "String");
SET @Keyboard = (SELECT familyID FROM InstrumentFamilies WHERE familyName = "Keyboard");
SET @Percussion = (SELECT familyID FROM InstrumentFamilies WHERE familyName = "Percussion");
SET @Choral = (SELECT familyID FROM InstrumentFamilies WHERE familyName = "Choral");
SET @Ensemble = (SELECT familyID FROM InstrumentFamilies WHERE familyName = "Ensemble");


INSERT INTO Instruments (instrumentName, familyID, scorePosition) 
VALUES
("Violin", @String, 2), ("Viola", @String, 3), ("Violoncello", @String, 4), ("Double Bass", @String, 5), ("French Horn", @Brass, 1), ("Trumpet", @Brass, 3), 
("Piccolo Trumpet", @Brass, 2), ("Bass Trumpet", @Brass, 4), ("Trombone", @Brass, 6), ("Alto Trombone", @Brass, 5), ("Tenor Trombone", @Brass, 6), 
("Bass Trombone", @Brass, 7), ("Contrabass Trombone", @Brass, 8), ("Tuba", @Brass, 10), ("Wagner Tuba", @Brass, 10), ("Cimbasso", @Brass, 9), 
("Flugelhorn", @Brass, 2), ("Soprano Saxophone", @Woodwind, 10), ("Alto Saxophone", @Woodwind, 11), ("Tenor Saxophone", @Woodwind, 12), 
("Baritone Saxophone", @Woodwind, 13), ("Bass Saxophone", @Woodwind, 14), ("Contrabass Saxophone", @Woodwind, 15), ("Concert Flute", @Woodwind, 1), 
("Piccolo Flute", @Woodwind, 4), ("Alto Flute", @Woodwind, 2), ("Bass Flute", @Woodwind, 3), ("Oboe", @Woodwind, 5), ("English Horn", @Woodwind, 6), ("Clarinet", @Woodwind, 7), 
("Bass Clarinet", @Woodwind, 8), ("Contrabass Clarinet", @Woodwind, 9), ("Bassoon", @Woodwind, 16), ("Contrabassoon", @Woodwind, 17), ("Accordion", @Keyboard, 3), 
("Guitar", @String, 1), ("Harp", @String, 1), ("Piano", @Keyboard, 0), ("Celesta", @Keyboard, 1), ("Harpsichord", @Keyboard, 2), ("Timpani", @Percussion, 0), ("String Quartet", @Ensemble, 1),
("Orchestra", @Ensemble, 0), ("Piano Trio", @Ensemble, 1), ("Wind Band", @Ensemble, 2), ("Chorus", @Ensemble, 2), ("Soprano", @Choral, 1), ("Alto", @Choral, 2), ("Tenor", @Choral, 3), 
("Bass", @Choral, 4), ("Triangle", @Percussion, 1), ("Snare Drum", @Percussion, 1), ("Cymbals", @Percussion, 1), ("Bass Drum", @Percussion, 1),
("Tam-tam", @Percussion, 1), ("Wood Block", @Percussion, 1), ("Whip", @Percussion, 1);

-- Performers

/* Composer and Ensemble data was sourced from Wikipedia */

INSERT INTO Composers (
    firstName, 
    lastName, 
    birthDate, 
    deathDate
) 
VALUES
("Maurice", "Ravel", "1875-03-07", "1937-12-28"),
("Nikolai", "Rimsky-Korsakov", "1844-03-18", "1908-06-21"),
("Gabriel", "Fauré", "1845-05-12", "1924-11-04"),
("Claude", "Debussy", "1862-08-22", "1918-03-25"),
("Antonín", "Dvořák", "1841-09-08", "1904-05-01");

SET @MauriceRavel = (SELECT composerID FROM Composers WHERE firstName = "Maurice" AND lastName = "Ravel");
SET @ClaudeDebussy = (SELECT composerID FROM Composers WHERE firstName = "Claude" AND lastName = "Debussy");
SET @GabrielFaure = (SELECT composerID FROM Composers WHERE firstName = "Gabriel" AND lastName = "Fauré");
SET @NikolaiRimskyKorsakov = (SELECT composerID FROM Composers WHERE firstName = "Nikolai" AND lastName = "Rimsky-Korsakov");
SET @AntoninDvorak = (SELECT composerID FROM Composers WHERE firstName = "Antonín" AND lastName = "Dvořák");

-- Compositions

/* Composition data was sourced from Wikipedia */

INSERT INTO Compositions (  
    titleEnglish, 
    titleNative, 
    dedication,
    composerID, 
    compositionYear, 
    formID, 
    keyID
)
VALUES 
(
    "Scheherazade", 
    "Shekherazada",
    NULL, 
    @NikolaiRimskyKorsakov, 
    1888, 
    (SELECT formID FROM Forms WHERE formName = "Suite"), 
    NULL
),
(
    "Piano Concerto for the Left Hand", 
    NULL, 
    "Paul Wittgenstein",
    @MauriceRavel,
    1930, 
    (SELECT formID FROM Forms WHERE formName = "Concerto"), 
    (SELECT keyID FROM KeySignatures WHERE keyName = "D major")
),
(
    "String Quartet in F Major", 
    NULL, 
    "Gabriel Fauré",
    @MauriceRavel,
    1903, 
    (SELECT formID FROM Forms WHERE formName = "Quartet"), 
    (SELECT keyID FROM KeySignatures WHERE keyName = "F major")
),
(
    "String Quartet in E Minor", 
    NULL, 
    "Camille Bellaigue",
    @GabrielFaure, 
    1924, 
    (SELECT formID FROM Forms WHERE formName = "Quartet"), 
    (SELECT keyID FROM KeySignatures WHERE keyName = "E minor")
),
(
    "String Quartet in G Minor", 
    NULL, 
    "Quatuor Ysaÿe",
    @ClaudeDebussy, 
    1893, 
    (SELECT formID FROM Forms WHERE formName = "Quartet"), 
    (SELECT keyID FROM KeySignatures WHERE keyName = "G minor")
),
(
    "Piano Concerto in G major", 
    NULL,
    "Marguerite Long",
    @MauriceRavel, 
    1931, 
    (SELECT formID FROM Forms WHERE formName = "Concerto"), 
    (SELECT keyID FROM KeySignatures WHERE keyName = "G major")
),
(
    "Ballade in F sharp Major", 
    NULL,
    "Camille Saint-Saëns",
    @GabrielFaure, 
    1879, 
    (SELECT formID FROM Forms WHERE formName = "Ballade"), 
    (SELECT keyID FROM KeySignatures WHERE keyName = "F sharp major")
);

SET @CompScheherezade = (SELECT compositionID FROM Compositions 
                         WHERE titleEnglish = "Scheherazade" 
                         AND composerID = (SELECT composerID FROM Composers 
                                           WHERE firstName = "Nikolai" AND lastName = "Rimsky-Korsakov"));
SET @CompLeftHand = (SELECT compositionID FROM Compositions 
                     WHERE titleEnglish = "Piano Concerto for the Left Hand" 
                     AND composerID = (SELECT composerID FROM Composers 
                                       WHERE firstName = "Maurice" AND lastName = "Ravel"));
SET @CompGConcerto = (SELECT compositionID FROM Compositions 
                      WHERE titleEnglish = "Piano Concerto in G Major" 
                      AND composerID = (SELECT composerID FROM Composers 
                                        WHERE firstName = "Maurice" AND lastName = "Ravel"));
SET @CompSQRavel = (SELECT compositionID FROM Compositions 
                      WHERE titleEnglish = "String Quartet in F Major" 
                      AND composerID = (SELECT composerID FROM Composers 
                                        WHERE firstName = "Maurice" AND lastName = "Ravel"));
SET @CompSQFaure = (SELECT compositionID FROM Compositions 
                      WHERE titleEnglish = "String Quartet in E Minor" 
                      AND composerID = (SELECT composerID FROM Composers 
                                        WHERE firstName = "Gabriel" AND lastName = "Fauré")); 
SET @CompSQDebussy = (SELECT compositionID FROM Compositions 
                      WHERE titleEnglish = "String Quartet in G Minor" 
                      AND composerID = (SELECT composerID FROM Composers 
                                        WHERE firstName = "Claude" AND lastName = "Debussy"));
SET @CompBallade = (SELECT compositionID FROM Compositions 
                    WHERE titleEnglish = "Ballade in F sharp Major" 
                    AND composerID = (SELECT composerID FROM Composers 
                                      WHERE firstName = "Gabriel" AND lastName = "Fauré"));

-- Movements

/* Composition data was sourced from Wikipedia */

-- Scheherezade by Nikolai Rimsky-Korsakov
INSERT INTO Movements (
    movementNum, 
    title, 
    compositionID
)
VALUES
(
    1, 
    "The Sea and Sinbad's Ship", 
    @CompScheherezade
),     
(
    2, 
    "The Story of the Kalendar Prince", 
    @CompScheherezade
),     
(
    3, 
    "The Young Prince and the Young Princess", 
    @CompScheherezade
),
(
    4, 
    "Festival at Baghdad - The Sea - The Ship Breaks against a Cliff Surmounted by a Bronze Horseman", 
    @CompScheherezade
),

-- Concerto for the Left Hand by Maurice Ravel
(
    1, 
    "Lento", 
    @CompLeftHand
),     
(
    2, 
    "Allegro", 
    @CompLeftHand
),     
(
    3, 
    "Tempo primo", 
    @CompLeftHand
),

-- Piano Concerto in G Major by Maurice Ravel
(
    1, 
    "Allegramente", 
    @CompGConcerto
),     
(
    2, 
    "Adagio assai", 
    @CompGConcerto
),     
(
    3, 
    "Presto", 
    @CompGConcerto
),

-- String Quartet in F Major by Maurice Ravel
(
    1, 
    "Allegro moderato - très doux", 
    @CompSQRavel
),                      
(
    2, 
    "Assez vif - très rythmé", 
    @CompSQRavel
),     
(
    3, 
    "Très lent", 
    @CompSQRavel
),     
(
    4, 
    "Vif et agité", 
    @CompSQRavel
),

-- String Quartet in E Minor by Gabriel Fauré:
(
    1, 
    "Allegro moderato", 
    @CompSQFaure
),
(
    2, 
    "Andante", 
    @CompSQFaure
),     
(
    3, 
    "Allegro", 
    @CompSQFaure
),

-- String Quartet in G Minor by Claude Debussy
(
    1, 
    "Animé et très décidé", 
    @CompSQDebussy
),
(
    2, "Assez vif et bien rythmé", 
    @CompSQDebussy
),     
(
    3, 
    "Andantino, doucement expressif", 
    @CompSQDebussy
),     
(
    4, 
    "Très modéré - En animant peu à peu - Très mouvementé et avec passion", 
    @CompSQDebussy
),

-- Ballade in F sharp Major by Gabriel Fauré
(
    1, 
    NULL, 
    @CompBallade
);

-- Opus Numbers
INSERT INTO OpusNums (
    compositionID, 
    opNum
)
VALUES 
(
    @CompScheherezade ,
    '35'
),
(
    @CompSQFaure,
    '121'
),
(
    @CompSQDebussy,
    '10'
),
(
    @CompBallade,
    '19'
);

-- Catalogues

/* Catalogue data was sourced from Wikipedia */

INSERT INTO Catalogues (
    composerID, 
    catalogueTitle, 
    authorFirst, 
    authorLast, 
    catalogueSymbol,
    publicationYear
)
VALUES (
    @MauriceRavel,
    "Maurice Ravel",
    "Marcel",
    "Marnat",
    "M.",
    1986
),
(
    @ClaudeDebussy,
    "Catalogue de l'œuvre de Claude Debussy",
    "François",
    "Lesure",
    "L.",
    1977
),
(
    @AntoninDvorak,
    "Antonín Dvořák, Complete Catalogue of Works",
    "Peter J. F.",
    "Herbert",
    "H.",
    1988
),
(
    @AntoninDvorak,
    "Antonín Dvořák: thematický katalog",
    "Jarmil",
    "Burghauser",
    "B.",
    1996
),
(
    @AntoninDvorak,
    "Dvořákś Werke ... ein vollständiges Verzeichnis in chronologischer thematischer und systematischer Anordnung",
    "Otakar",
    "Šourek",
    "S.",
    1917
),
(
    @AntoninDvorak,
    "Antonín Dvořák, Complete Catalogue of Works",
    "Ian T.",
    "Trufitt",
    "T.",
    1974
);

SET @CatalogueRavel = (SELECT catalogueID FROM Catalogues 
                       WHERE composerID = (SELECT composerID FROM Composers 
                                           WHERE firstName = 'Maurice' AND lastName = 'Ravel') 
                                           AND catalogueSymbol = 'M.');
SET @CatalogueDebussy = (SELECT catalogueID FROM Catalogues 
                         WHERE composerID = (SELECT composerID FROM Composers 
                                             WHERE firstName = 'Claude' AND lastName = 'Debussy') 
                                             AND catalogueSymbol = 'L.');

-- Catalogue Nums
INSERT INTO CatalogueNums (
    catalogueID, 
    compositionID, 
    catNum
)
VALUES 
(
    @CatalogueRavel,
    @CompLeftHand,
    '82'
),
(
    @CatalogueRavel,
    @CompSQRavel,
    '35'
),
(
    @CatalogueRavel,
    @CompGConcerto,
    '83'
),
(
    @CatalogueDebussy,
    @CompSQDebussy,
    '91'
);

-- Featured Instruments

INSERT INTO FeaturedInstrumentation (
    instrumentID, 
    compositionID 
)
VALUES
(
    (SELECT instrumentID FROM Instruments
     WHERE instrumentName = "Orchestra"),
    @CompScheherezade
),     
(
    (SELECT instrumentID FROM Instruments
     WHERE instrumentName = "Orchestra"), 
    @CompLeftHand
),     
(
    (SELECT instrumentID FROM Instruments
     WHERE instrumentName = "Piano"),  
    @CompLeftHand
),     
(
    (SELECT instrumentID FROM Instruments
     WHERE instrumentName = "Orchestra"), 
    @CompGConcerto
),     
(
    (SELECT instrumentID FROM Instruments
     WHERE instrumentName = "Piano"), 
    @CompGConcerto
),     
(
    (SELECT instrumentID FROM Instruments
     WHERE instrumentName = "String Quartet"), 
    @CompSQRavel
),                      
(
    (SELECT instrumentID FROM Instruments
     WHERE instrumentName = "String Quartet"), 
    @CompSQFaure
),
(
    (SELECT instrumentID FROM Instruments
     WHERE instrumentName = "String Quartet"), 
    @CompSQDebussy
),
(
    (SELECT instrumentID FROM Instruments
     WHERE instrumentName = "Piano"), 
    @CompBallade
);

-- Instrumentations

-- Define variables for instruments excluding family ID 8
SET @InsViolin = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Violin');
SET @InsViola = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Viola');
SET @InsVioloncello = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Violoncello');
SET @InsDoubleBass = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Double Bass');
SET @InsFrenchHorn = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'French Horn');
SET @InsTrumpet = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Trumpet');
SET @InsPiccoloTrumpet = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Piccolo Trumpet');
SET @InsBassTrumpet = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Bass Trumpet');
SET @InsTrombone = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Trombone');
SET @InsAltoTrombone = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Alto Trombone');
SET @InsTenorTrombone = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Tenor Trombone');
SET @InsBassTrombone = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Bass Trombone');
SET @InsContrabassTrombone = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Contrabass Trombone');
SET @InsTuba = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Tuba');
SET @InsWagnerTuba = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Wagner Tuba');
SET @InsCimbasso = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Cimbasso');
SET @InsFlugelhorn = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Flugelhorn');
SET @InsSopranoSaxophone = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Soprano Saxophone');
SET @InsAltoSaxophone = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Alto Saxophone');
SET @InsTenorSaxophone = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Tenor Saxophone');
SET @InsBaritoneSaxophone = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Baritone Saxophone');
SET @InsBassSaxophone = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Bass Saxophone');
SET @InsContrabassSaxophone = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Contrabass Saxophone');
SET @InsConcertFlute = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Concert Flute');
SET @InsPiccoloFlute = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Piccolo Flute');
SET @InsAltoFlute = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Alto Flute');
SET @InsBassFlute = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Bass Flute');
SET @InsOboe = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Oboe');
SET @InsEnglishHorn = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'English Horn');
SET @InsClarinet = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Clarinet');
SET @InsBassClarinet = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Bass Clarinet');
SET @InsContrabassClarinet = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Contrabass Clarinet');
SET @InsBassoon = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Bassoon');
SET @InsContrabassoon = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Contrabassoon');
SET @InsAccordion = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Accordion');
SET @InsGuitar = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Guitar');
SET @InsHarp = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Harp');
SET @InsPiano = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Piano');
SET @InsCelesta = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Celesta');
SET @InsHarpsichord = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Harpsichord');
SET @InsTimpani = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Timpani');
SET @InsTriangle = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Triangle');
SET @InsSnareDrum = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Snare Drum');
SET @InsCymbals = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Cymbals');
SET @InsBassDrum = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Bass Drum');
SET @InsTamTam = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Tam-tam');
SET @InsWoodBlock = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Wood Block');
SET @InsWhip = (SELECT instrumentID FROM Instruments WHERE instrumentName = 'Whip');

INSERT INTO CompositionPlayers (
    compositionID, 
    instrumentID, 
    keyID, 
    chairNum, 
    isSection
)
VALUES
-- Ravel String Quartet 
    (@CompSQRavel, @InsViolin, NULL, 1, FALSE),
    (@CompSQRavel, @InsViolin, NULL, 2, FALSE),
    (@CompSQRavel, @InsViola, NULL, 1, FALSE),
    (@CompSQRavel, @InsVioloncello, NULL, 1, FALSE),
-- Debussy String Quartet 
    (@CompSQDebussy, @InsViolin, NULL, 1, FALSE),
    (@CompSQDebussy, @InsViolin, NULL, 2, FALSE),
    (@CompSQDebussy, @InsViola, NULL, 1, FALSE),
    (@CompSQDebussy, @InsVioloncello, NULL, 1, FALSE),
-- Faure String Quartet 
    (@CompSQFaure, @InsViolin, NULL, 1, FALSE),
    (@CompSQFaure, @InsViolin, NULL, 2, FALSE),
    (@CompSQFaure, @InsViola, NULL, 1, FALSE),
    (@CompSQFaure, @InsVioloncello, NULL, 1, FALSE),
-- Ballade in F Sharp
    (@CompBallade, @InsPiano, NULL, 1, FALSE);

-- Piano Concerto in G
INSERT INTO CompositionPlayers (compositionID, instrumentID, keyID, chairNum, isSection)
VALUES
    -- Solo Piano
    (@CompGConcerto, @InsPiano, NULL, 1, FALSE),
    -- Woodwinds
    (@CompGConcerto, @InsPiccoloFlute, NULL, 1, FALSE),
    (@CompGConcerto, @InsConcertFlute, NULL, 1, FALSE),
    (@CompGConcerto, @InsOboe, NULL, 1, FALSE),
    (@CompGConcerto, @InsEnglishHorn, NULL, 1, FALSE),
    (@CompGConcerto, @InsClarinet, (SELECT keyID FROM KeySignatures WHERE keyName = 'E flat'), 1, FALSE),
    (@CompGConcerto, @InsClarinet, (SELECT keyID FROM KeySignatures WHERE keyName = 'B flat'), 2, FALSE),
    (@CompGConcerto, @InsBassoon, NULL, 1, FALSE),
    (@CompGConcerto, @InsBassoon, NULL, 2, FALSE),
    -- Brass
    (@CompGConcerto, @InsFrenchHorn, (SELECT keyID FROM KeySignatures WHERE keyName = 'F'), 1, FALSE),
    (@CompGConcerto, @InsFrenchHorn, (SELECT keyID FROM KeySignatures WHERE keyName = 'F'), 2, FALSE),
    (@CompGConcerto, @InsTrumpet, (SELECT keyID FROM KeySignatures WHERE keyName = 'C'), 1, FALSE),
    (@CompGConcerto, @InsTrombone, NULL, 1, FALSE),
    -- Percussion
    (@CompGConcerto, @InsTimpani, NULL, 0, FALSE),
    (@CompGConcerto, @InsTriangle, NULL, 0, FALSE),
    (@CompGConcerto, @InsSnareDrum, NULL, 0, FALSE),
    (@CompGConcerto, @InsCymbals, NULL, 0, FALSE),
    (@CompGConcerto, @InsBassDrum, NULL, 0, FALSE),
    (@CompGConcerto, @InsTamTam, NULL, 0, FALSE),
    (@CompGConcerto, @InsWoodBlock, NULL, 0, FALSE),
    (@CompGConcerto, @InsWhip, NULL, 0, FALSE),
    -- Strings
    (@CompGConcerto, @InsHarp, NULL, 1, FALSE),
    (@CompGConcerto, @InsViolin, NULL, 1, TRUE),
    (@CompGConcerto, @InsViolin, NULL, 2, TRUE),
    (@CompGConcerto, @InsViola, NULL, 0, TRUE),
    (@CompGConcerto, @InsVioloncello, NULL, 0, TRUE),
    (@CompGConcerto, @InsDoubleBass, NULL, 0, TRUE);


-- Left Hand Concerto
INSERT INTO CompositionPlayers (compositionID, instrumentID, keyID, chairNum, isSection)
VALUES 
    -- Woodwinds
    (@CompLeftHand, @InsPiccolo, NULL, 1, FALSE),
    (@CompLeftHand, @InsConcertFlute, NULL, 1, FALSE),
    (@CompLeftHand, @InsConcertFlute, NULL, 2, FALSE),
    (@CompLeftHand, @InsOboe, NULL, 1, FALSE),
    (@CompLeftHand, @InsOboe, NULL, 2, FALSE),
    (@CompLeftHand, @InsEnglishHorn, NULL, 1, FALSE),
    (@CompLeftHand, @InsClarinet, (SELECT keyID FROM KeySignatures WHERE keyName = 'E flat'), 1, FALSE),
    (@CompLeftHand, @InsClarinet, (SELECT keyID FROM KeySignatures WHERE keyName = 'A'), 1, FALSE),
    (@CompLeftHand, @InsClarinet, (SELECT keyID FROM KeySignatures WHERE keyName = 'A'), 2, FALSE),
    (@CompLeftHand, @InsBassClarinet, (SELECT keyID FROM KeySignatures WHERE keyName = 'A'), 1, FALSE),
    (@CompLeftHand, @InsBassoon, NULL, 1, FALSE),
    (@CompLeftHand, @InsBassoon, NULL, 2, FALSE),
    (@CompLeftHand, @InsContrabassoon, NULL, 1, FALSE),
    -- Brass
    (@CompLeftHand, @InsFrenchHorn, (SELECT keyID FROM KeySignatures WHERE keyName = 'F'), 1, FALSE),
    (@CompLeftHand, @InsFrenchHorn, (SELECT keyID FROM KeySignatures WHERE keyName = 'F'), 2, FALSE),
    (@CompLeftHand, @InsFrenchHorn, (SELECT keyID FROM KeySignatures WHERE keyName = 'F'), 3, FALSE),
    (@CompLeftHand, @InsFrenchHorn, (SELECT keyID FROM KeySignatures WHERE keyName = 'F'), 4, FALSE),
    (@CompLeftHand, @InsTrumpet, (SELECT keyID FROM KeySignatures WHERE keyName = 'C'), 1, FALSE),
    (@CompLeftHand, @InsTrumpet, (SELECT keyID FROM KeySignatures WHERE keyName = 'C'), 2, FALSE),
    (@CompLeftHand, @InsTrumpet, (SELECT keyID FROM KeySignatures WHERE keyName = 'C'), 3, FALSE),
    (@CompLeftHand, @InsTrombone, NULL, 1, FALSE),
    (@CompLeftHand, @InsTrombone, NULL, 2, FALSE),
    (@CompLeftHand, @InsTrombone, NULL, 3, FALSE),
    (@CompLeftHand, @InsTuba, NULL, 1, FALSE),
    -- Percussion
    (@CompLeftHand, @InsTimpani, NULL, 0, FALSE),
    (@CompLeftHand, @InsTriangle, NULL, 0, FALSE),
    (@CompLeftHand, @InsSnareDrum, NULL, 0, FALSE),
    (@CompLeftHand, @InsCymbals, NULL, 0, FALSE),
    (@CompLeftHand, @InsBassDrum, NULL, 0, FALSE),
    (@CompLeftHand, @InsWoodBlock, NULL, 0, FALSE),
    (@CompLeftHand, @InsTamTam, NULL, 0, FALSE),
    -- Strings
    (@CompLeftHand, @InsHarp, NULL, 1, FALSE),
    (@CompLeftHand, @InsViolin, NULL, 1, TRUE),
    (@CompLeftHand, @InsViolin, NULL, 2, TRUE),
    (@CompLeftHand, @InsViola, NULL, 0, TRUE),
    (@CompLeftHand, @InsVioloncello, NULL, 0, TRUE),
    (@CompLeftHand, @InsDoubleBass, NULL, 0, TRUE),
    -- Solo Piano
    (@CompLeftHand, @InsPiano, NULL, 1, FALSE);

-- Scheherezade
INSERT INTO CompositionPlayers (compositionID, instrumentID, keyID, chairNum, isSection)
VALUES 
    -- Woodwinds
    (@CompScheherezade, @InsConcertFlute, NULL, 1, FALSE),
    (@CompScheherezade, @InsConcertFlute, NULL, 2, FALSE),
    (@CompScheherezade, @InsPiccoloFlute, NULL, 1, FALSE),
    (@CompScheherezade, @InsOboe, NULL, 1, FALSE),
    (@CompScheherezade, @InsOboe, NULL, 2, FALSE),
    (@CompScheherezade, @InsClarinet, (SELECT keyID FROM KeySignatures WHERE keyName = 'A'), 1, FALSE),
    (@CompScheherezade, @InsClarinet, (SELECT keyID FROM KeySignatures WHERE keyName = 'A'), 2, FALSE),
    (@CompScheherezade, @InsBassoon, NULL, 1, FALSE),
    (@CompScheherezade, @InsBassoon, NULL, 2, FALSE),
    -- Brass
    (@CompScheherezade, @InsFrenchHorn, (SELECT keyID FROM KeySignatures WHERE keyName = 'F'), 1, FALSE),
    (@CompScheherezade, @InsFrenchHorn, (SELECT keyID FROM KeySignatures WHERE keyName = 'F'), 2, FALSE),
    (@CompScheherezade, @InsFrenchHorn, (SELECT keyID FROM KeySignatures WHERE keyName = 'F'), 3, FALSE),
    (@CompScheherezade, @InsFrenchHorn, (SELECT keyID FROM KeySignatures WHERE keyName = 'F'), 4, FALSE),
    (@CompScheherezade, @InsTrumpet, (SELECT keyID FROM KeySignatures WHERE keyName = 'A'), 1, FALSE),
    (@CompScheherezade, @InsTrumpet, (SELECT keyID FROM KeySignatures WHERE keyName = 'A'), 2, FALSE),
    (@CompScheherezade, @InsTrombone, NULL, 1, FALSE),
    (@CompScheherezade, @InsTrombone, NULL, 2, FALSE),
    (@CompScheherezade, @InsTrombone, NULL, 3, FALSE),
    (@CompScheherezade, @InsTuba, NULL, 1, FALSE),
    -- Percussion
    (@CompScheherezade, @InsTimpani, NULL, 1, FALSE),
    (@CompScheherezade, @InsBassDrum, NULL, 1, FALSE),
    (@CompScheherezade, @InsSnareDrum, NULL, 1, FALSE),
    (@CompScheherezade, @InsCymbals, NULL, 1, FALSE),
    (@CompScheherezade, @InsTriangle, NULL, 1, FALSE),
    (@CompScheherezade, @InsTambourine, NULL, 1, FALSE),
    (@CompScheherezade, @InsTamTam, NULL, 1, FALSE),
    -- Strings
    (@CompScheherezade, @InsHarp, NULL, 1, FALSE),
    (@CompScheherezade, @InsViolin, NULL, 1, TRUE),
    (@CompScheherezade, @InsViolin, NULL, 2, TRUE),
    (@CompScheherezade, @InsViola, NULL, 0, TRUE),
    (@CompScheherezade, @InsVioloncello, NULL, 0, TRUE),
    (@CompScheherezade, @InsDoubleBass, NULL, 0, TRUE);


SET @GConcertoClarinet2 = (SELECT playerID FROM CompositionPlayers 
                           WHERE CompositionID = @CompGConcerto 
                           AND instrumentID = @InsClarinet
                           AND chairNum = 2);
SET @ScheherezadeFlute2 = (SELECT playerID FROM CompositionPlayers 
                           WHERE CompositionID = @CompScheherezade 
                           AND instrumentID = @InsConcertFlute
                           AND chairNum = 2);
SET @ScheherezadeOboe2 = (SELECT playerID FROM CompositionPlayers 
                          WHERE CompositionID = @CompScheherezade 
                          AND instrumentID = @InsOboe
                          AND chairNum = 2);
SET @ScheherezadeClarinet1 = (SELECT playerID FROM CompositionPlayers 
                              WHERE CompositionID = @CompScheherezade 
                              AND instrumentID = @InsClarinet
                              AND chairNum = 1);
SET @ScheherezadeClarinet2 = (SELECT playerID FROM CompositionPlayers 
                              WHERE CompositionID = @CompScheherezade 
                              AND instrumentID = @InsClarinet
                              AND chairNum = 2);
SET @ScheherezadeTrumpet1 = (SELECT playerID FROM CompositionPlayers 
                             WHERE CompositionID = @CompScheherezade 
                             AND instrumentID = @InsTrumpet
                             AND chairNum = 1);                                            
SET @ScheherezadeTrumpet2 = (SELECT playerID FROM CompositionPlayers 
                             WHERE CompositionID = @CompScheherezade 
                             AND instrumentID = @InsTrumpet
                             AND chairNum = 2);                                            

INSERT INTO DoubledInstruments (playerID, instrumentID, keyID)
VALUES
    (@GConcertoClarinet2, @InsClarinet, (SELECT keyID FROM KeySignatures WHERE keyName = 'A')),
    (@ScheherezadeFlute2, @InsPiccoloFlute, NULL),
    (@ScheherezadeOboe2, @InsEnglishHorn, NULL),
    (@ScheherezadeClarinet1, @InsClarinet, (SELECT keyID FROM KeySignatures WHERE keyName = 'B flat')),
    (@ScheherezadeClarinet2, @InsClarinet, (SELECT keyID FROM KeySignatures WHERE keyName = 'B flat')),
    (@ScheherezadeTrumpet1, @InsTrumpet, (SELECT keyID FROM KeySignatures WHERE keyName = 'B flat')),
    (@ScheherezadeTrumpet2, @InsTrumpet, (SELECT keyID FROM KeySignatures WHERE keyName = 'B flat'));

-- Final Housekeeping
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;