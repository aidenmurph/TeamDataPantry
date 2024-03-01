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
    keyName VARCHAR(25),
    PRIMARY KEY (keyName)
);

-- Compositions
-- DESC: A single composition of one or more movements created by a composer
CREATE OR REPLACE TABLE Compositions(
    titleEnglish VARCHAR(255) NOT NULL, -- The english title of the composition
    -- titleNative VARCHAR(255),           -- The title of the composition in the original language
    compositionID INT AUTO_INCREMENT NOT NULL,
    composerID INT NOT NULL,
    compositionYear SMALLINT UNSIGNED NOT NULL,
    formID INT,
    musicalKey VARCHAR(25),
    PRIMARY KEY (compositionID),
    FOREIGN KEY (composerID) REFERENCES Composers(composerID) ON DELETE CASCADE,
    FOREIGN KEY (formID) REFERENCES Forms(formID),
    FOREIGN KEY (musicalKey) REFERENCES KeySignatures(keyName)
);

-- Movements
-- DESC: A single movement or section in a larger composition
CREATE OR REPLACE TABLE Movements(
    movementNum INT NOT NULL,
    compositionID INT NOT NULL,
    title VARCHAR(255),
    FOREIGN KEY (compositionID) REFERENCES Compositions(compositionID) ON DELETE CASCADE,
    PRIMARY KEY (compositionID, movementNum)
);

-- OpusNums
-- DESC: An opus number associated with a given composition, used for lookups
-- NOTE: For historical reasons, a composition may have 0 or more opus numbers
--       associated with it, necessitating the M:1 relationship
CREATE OR REPLACE TABLE OpusNums(
    compositionID INT NOT NULL,
    opNum VARCHAR(8),
    FOREIGN KEY (compositionID) REFERENCES Compositions(compositionID) ON DELETE CASCADE,
    PRIMARY KEY (compositionID, opNum)
);

-- Catalogues
-- DESC: An ordering of a specific composer’s body of work, assembled by an outside party
CREATE OR REPLACE TABLE Catalogues(
    catalogueID INT AUTO_INCREMENT NOT NULL,
    composerID INT NOT NULL,
    catalogueTitle VARCHAR(255) NOT NULL,
    authorFirst VARCHAR(50) NOT NULL,
    authorLast VARCHAR(50) NOT NULL,
    catalogueSymbol VARCHAR(16) NOT NULL,
    publicationYear SMALLINT UNSIGNED NOT NULL,
    FOREIGN KEY (composerID) REFERENCES Composers(composerID) ON DELETE CASCADE,
    PRIMARY KEY (catalogueID)
);

-- CatalogueNums
-- DESC: A catalogue number referring to a specific composition
CREATE OR REPLACE TABLE CatalogueNums(
    catalogueID INT NOT NULL,
    compositionID INT NOT NULL,
    catNum VARCHAR(8) NOT NULL,
    FOREIGN KEY (catalogueID) REFERENCES Catalogues(catalogueID) ON DELETE CASCADE,
    FOREIGN KEY (compositionID) REFERENCES Compositions(compositionID) ON DELETE CASCADE,
    PRIMARY KEY (catalogueID, catNum)
);

-- Instruments (Category Table)
-- DESC: A musical instrument, such as a piano or violin or an 
--       instrument ensemble, such as an orchestra or string quartet
CREATE OR REPLACE TABLE Instruments(
    /* The abstraction of considering ensembles as a single instrument 
     * is intended to allow, for example, for lookups of compositions 
     * for an orchestra. However this abstraction currently allows for
     * ensembles to be set as ComposerInstruments. A more nuanced approach
     * to most accurately reflect compositions instrumentation is 
     * necessary, but determined to be beyond the current project scope. */
    instrumentID INT NOT NULL AUTO_INCREMENT,
    instrumentName VARCHAR(50) NOT NULL,
    UNIQUE (instrumentName),
    PRIMARY KEY (instrumentID)
);

-- CompositionInstruments (Intersection Table)
-- DESC: An instrument (or group of instruments) included in the instrumentation 
--       for a single composition. Used for querying pieces by instrument
CREATE OR REPLACE TABLE CompositionInstruments(
    instrumentID INT,
    compositionID INT,
    FOREIGN KEY (instrumentID) REFERENCES Instruments(instrumentID)
    ON DELETE CASCADE,
    FOREIGN KEY (compositionID) REFERENCES Compositions(compositionID)
    ON DELETE CASCADE,
    PRIMARY KEY (instrumentID, compositionID)
);

/* Triggers & Procedures */

-- Set delimiter for triggers
DELIMITER //

-- Validate composition composer and catalogue composer are the same,
-- otherwise throw error
CREATE TRIGGER ensure_composer_match
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
 * 1) Category Tables: Instruments, Forms
 * 2) Performers: Composers, Ensembles, EnsembleMembers
 * 3) Compositions: Compositions, Movements, Catalogues
 *  3.5) Composition Numbering: OpusNums, CatalogueNums 
 * 4) Recordings: Recordings, Albums, AlbumTracks
 * 
 * NOTE: The entity "Performers" is excluded from this list as Performer entries are
 *       auto-generated upon insertion of Composer or Ensemble entries
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

INSERT INTO KeySignatures (keyName) 
VALUES
("C major"), ("A minor"), ("G major"), ("E minor"), ("F major"), ("D minor"), ("D major"),
("B minor"), ("B-flat major"), ("G minor"), ("A major"), ("F-sharp minor"), ("E-flat major"),
("C minor"), ("E major"), ("C-sharp minor"), ("A-flat major"), ("F minor"), ("B major"),
("G-sharp minor"), ("D-flat major"), ("B-flat minor"), ("F-sharp major"), ("D-sharp minor"),
("G-flat major"), ("E-flat minor"), ("C-sharp major"), ("A-sharp minor"), ("C-flat major"),
("A-flat minor");

INSERT INTO Instruments (instrumentName) 
VALUES
("Violin"), ("Viola"), ("Violoncello"), ("Double Bass"), ("French Horn"), ("Trumpet"), 
("Piccolo Trumpet"), ("Bass Trumpet"), ("Alto Trombone"), ("Tenor Trombone"), 
("Bass Trombone"), ("Contrabass Trombone"), ("Tuba"), ("Wagner Tuba"), ("Cimbasso"), 
("Flugelhorn"), ("Soprano Saxophone"), ("Alto Saxophone"), ("Tenor Saxophone"), 
("Baritone Saxophone"), ("Bass Saxophone"), ("Contrabass Saxophone"), ("Concert Flute"), 
("Piccolo"), ("Alto Flute"), ("Bass Flute"), ("Oboe"), ("English Horn"), ("Clarinet"), 
("Bass Clarinet"), ("Contrabass Clarinet"), ("Bassoon"), ("Contrabassoon"), ("Accordion"), 
("Guitar"), ("Harp"), ("Piano"), ("Celesta"), ("Harpsichord"), ("Timpani"), ("String Quartet"),
("Orchestra"), ("Piano Trio"), ("Wind Band"), ("Chorus"), ("Soprano"), ("Alto"), ("Tenor"), 
("Bass");

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
    -- titleNative, 
    composerID, 
    compositionYear, 
    formID, 
    musicalKey
)
VALUES 
(
    "Scheherazade", 
    -- "Shekherazada", 
    (SELECT composerID FROM Composers WHERE firstName = "Nikolai" AND lastName = "Rimsky-Korsakov"), 
    1888, 
    (SELECT formID FROM Forms WHERE formName = "Suite"), 
    NULL
),
(
    "Concerto for the Left Hand", 
    -- NULL, 
    (SELECT composerID FROM Composers WHERE firstName = "Maurice" AND lastName = "Ravel"), 
    1930, 
    (SELECT formID FROM Forms WHERE formName = "Concerto"), 
    (SELECT keyName FROM KeySignatures WHERE keyName = "D major")
),
(
    "String Quartet in F Major", 
    -- NULL, 
    (SELECT composerID FROM Composers WHERE firstName = "Maurice" AND lastName = "Ravel"), 
    1903, 
    (SELECT formID FROM Forms WHERE formName = "Quartet"), 
    (SELECT keyName FROM KeySignatures WHERE keyName = "F major")
),
(
    "String Quartet in E Minor", 
    -- NULL, 
    (SELECT composerID FROM Composers WHERE firstName = "Gabriel" AND lastName = "Fauré"), 
    1924, 
    (SELECT formID FROM Forms WHERE formName = "Quartet"), 
    (SELECT keyName FROM KeySignatures WHERE keyName = "E minor")
),
(
    "String Quartet in G Minor", 
    -- NULL, 
    (SELECT composerID FROM Composers WHERE firstName = "Claude" AND lastName = "Debussy"), 
    1893, 
    (SELECT formID FROM Forms WHERE formName = "Quartet"), 
    (SELECT keyName FROM KeySignatures WHERE keyName = "G minor")
),
(
    "Piano Concerto in G major", 
    -- NULL,
    (SELECT composerID FROM Composers WHERE firstName = "Maurice" AND lastName = "Ravel"), 
    1931, 
    (SELECT formID FROM Forms WHERE formName = "Concerto"), 
    (SELECT keyName FROM KeySignatures WHERE keyName = "G major")
),
(
    "Ballade in F-sharp Major", 
    -- NULL,
    (SELECT composerID FROM Composers WHERE firstName = "Gabriel" AND lastName = "Fauré"), 
    1879, 
    (SELECT formID FROM Forms WHERE formName = "Ballade"), 
    (SELECT keyName FROM KeySignatures WHERE keyName = "F-sharp major")
);

SET @CompScheherezade = (SELECT compositionID FROM Compositions 
                         WHERE titleEnglish = "Scheherazade" 
                         AND composerID = (SELECT composerID FROM Composers 
                                           WHERE firstName = "Nikolai" AND lastName = "Rimsky-Korsakov"));
SET @CompLeftHand = (SELECT compositionID FROM Compositions 
                     WHERE titleEnglish = "Concerto for the Left Hand" 
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
                    WHERE titleEnglish = "Ballade in F-sharp Major" 
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

-- Ballade in F-sharp Major by Gabriel Fauré
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

-- Composition Instruments

INSERT INTO CompositionInstruments (
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

-- Final Housekeeping
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
