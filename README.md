# Classical Compositions Database
### Team Data Pantry
**Team Members: Jacob Barber, Matthew Menold, Aiden Murphy**

## Overview
While the streaming era has brought access to popular music to fans in an unprecedented way, fans of classical and orchestral music have been less successful in capitalizing on this revolution in music consumption. The database structure utilized in popular streaming services is designed around the relatively lean amount of data attached to a song or album. By contrast, classical music and its recordings have a far more complex set of data and relationships, which modern streaming databases are simply not constructed to handle. 

While most songs by popular artists have only one recording, with potentially one or two covers by other artists, classical pieces can be recorded numerous times by different artists and ensembles. For the most popular pieces, like Debussy’s Clair de Lune or Beethoven’s Symphony No. 9, there may be hundreds of different recordings. This leaves fans of classical music unable to navigate services and discover recordings with the same ease as fans of popular music. It also presents unique challenges for cataloguing and listening to classical pieces, as the approaches to listening differ between the two groups. One piece of a larger solution, then, is to create a new database for navigating compositions and recordings of classical music. 

Our database will aim to be the first step towards answering that problem. Our classical composition database will collect and store information about composers and their compositions, providing robust metadata for each composer’s body of work. It will be able to catalogue compositions ranging from piano sonatas to grand symphonies. Any given composer may have dozens (or even hundreds) of compositions to their name, each of which can be made up of any number of movements. With our database, users will be able to filter works by form, instrumentation, and composition year.

For example, a user may want to discover all the concerti by Rachmaninoff. In a standard streaming service like Spotify, such a query is simply not possible, but in our database it can be accomplished by applying a filter for Compositions with a “Concerto” form where the composer is “Sergei Rachmaninoff”. When this database is complete, it could feasibly serve as a jumping off point to relate classical recordings by performers and ensembles to the works they are performing. This would allow far more robust searching of recordings and foster discovery of new pieces by fans. While this next step is out of scope for the project this term, we are designing our project with this feature set in mind.

## Database Outline
The database structure can be primarily broken down into 3 tiers:
1. Category Tables — Which hold stable, generic information common to many entities
2. Composers — Individuals who have composed a work stored in the database
3. Compositions — The works themselves and their associated organizational entities

Generally, the numbering describes the dependency chain of entities, in that lower-numbered entities rely on higher-numbered entities. This is a feature of the relationships we are modeling. Insertion of data into the database should therefore be carried out in an order following the hierarchy, otherwise insertions will not succeed. Additionally, deletion of higher-numbered entities will typically cascade to lower-numbered entities, again to ensure relational integrity and accurately reflect the relationships we are modeling.

*Note: Due to the restrictions of the year data type in MySQL (which only allows for entry of years between 1901-2500) all “year” attributes are represented using the unsigned small int data type.*

### Category Tables
**Forms**: Category Table. The form of a composition, such as a sonata, symphony, or concerto.
  * Attributes:
    * formName: varchar(50), UNIQUE, not NULL
    * formID: int, not NULL, auto_increment
  * Primary Key: formID
  * Relationship:
    * 1:M with Compositions (A composition can have one and only one form, but there can be many compositions with that form)
  
**KeySignatures**: Category Table. The key of a given composition
  * Attributes:
    * keyName: varchar(25), not NULL
  * Primary Key: keyName
  * Relationship:
    * 1:M with Compositions (If designated, a composition is generally referred to by a single key signature, but many compositions can be in the same key)

**Instruments**: Category Table. A musical instrument, such as a piano or violin, or an instrument ensemble, such as an orchestra or string quartet
  * Attributes:
    * instrumentName: varchar(50), UNIQUE not NULL
    * instrumentID: int, not NULL, auto_increment
  * Primary Key: instrumentName
  * Relationships: 
      * M:M with Compositions (Intersection Table - CompositionInstruments. An instrument can appear in the instrumentation for many compositions, and a compositions instrumentation can feature multiple instruments)

### Composers
**Composers**: A composer of one or more compositions stored in the database
  * Attributes:
    * composerID: int, not NULL, auto_increment
    * firstName: varchar(50), not NULL
    * lastName: varchar(50), not NULL
    * birthDate: date, not NULL
    * deathDate, date, optional
      * CHECK: deathDate is NULL or >= birthDate
  * Primary Key: composerID
  * Relationships 
      * 1:M with Compositions (an composer can compose zero or more compositions)
      * 1:M with Catalogues (a composer can have zero or more catalogues associated with their body of work)

### Compositions
**Compositions**: A single composition of one or more movements created by a composer
  * Attributes:
    * name: varchar(255), not NULL
    * compositionID: int, auto_increment, not NULL
    * composerID: int, not NULL, FK
      * FK: composerID from Composers
    * compositionYear: unsigned small int, not NULL
    * formID: int, not NULL, FK
      * FK: formIDfrom Forms
    * musicalKey: varchar(25), not NULL, FK
      * FK: keyName from KeySIgnatures
  * Primary Key: compositionID
  * Relationships: 
    * 1:1 with Composers (A composition can be composed by one and only one Composer)
    * 1:M with Movements (A composition can have one or more movements)
    * 1:1 with Forms (A composition can have only one form)
    * M:M with Instruments (Intersection Table - CompositionInstruments. A composition’s instrumentation can have one or more associated instruments, and an instrument can be part of many compositions’ instrumentation)
    * M:M with Catalogues (Via the 1:M CatalogueNums relation. A composition can appear in zero or more Catalogues, and thus may have many catalogue numbers)
    * 1:M with OpusNums (A composition can have zero or more opus numbers)
    * 1:1 with KeySignatures (A composition can be designated with one and only one key)

**Movements**: A single movement in a larger composition. Compositions that are not further subdivided are considered to have a single movement with a NULL title. 
  * Attributes:
    * name: varchar(255), optional
    * compositionID: not NULL, FK
      * FK: compositionID from Compositions
    * movementNum: int, not NULL
  * Primary Key: compositionID, movementNum
  * Relationships: 
    * 1:1 with Compositions (A movement can be associated with one and only one composition)

**OpusNums**: The opus number associated with a given composition
  * Attributes:
    * compositionID: int, not NULL, FK
      * FK: compositionID from Compositions
    * opNum: varchar(8), not NULL
  * Primary Key: compositionID, opNum
  * Relationships: 
      * 1:1 with Compositions (An opus number can be related to one and only one composition)

**Catalogues**: An ordering of a specific composer’s body of work, assembled by an outside party (typically a musicologist).
  * Attributes:
    * catalogueID: int, not NULL
    * composerID: int, not NULL, FK
      * FK: composerID from Composers
    * catalogueTitle: varchar(255) not NULL
    * authorFirst: varchar(50), not NULL
    * authorLast: varchar(50), not NULL
    * catalogueSymbol: varchar(16), not NULL (the identifier associated with the catalogue used when referencing the composition)
    * publicationYear: unsigned small int, not NULL
  * Primary Key: catalogueID
  * Relationships: 
    * 1:1 with Composers (A catalogue can only cover a single composer’s body of work)
    * M:M with Compositions (Via the 1:M CatalogueNums relation. A catalogue will include 1 or more numbered compositions, and multiple catalogues can include the same composition.)
  
**CatalogueNums**: A catalogue number referring to a specific composition
  * Attributes:
    * catalogueID: int, not NULL
    * compositionID: int, not NULL, FK
      * FK: compositionID from Compositions
    * catNum: varchar(8) not NULL
  * Primary Key: catalogueID, catNum
  * Relationships: 
    * M:1 with Catalogues (There can be many catalogue numbers associated with a single catalogue)
    * 1:1 with Composition (A catalogue number can refer to only one composition)
  
**CompositionInstruments**: An instrument (or group of instruments) included in the instrumentation for a single composition. Used for querying pieces by instrument
  * Attributes:
    * instrumentID: int, not NULL, FK
      * FK: instrumentID from Instruments
    * compositionID: int, not NULL, FK
      * FK: compositionID from Compositions
  * Primary Key: instrument, compositionID
  * Relationships: 
    * M:1 with Instruments (Intersection Table)
    * M:1 with Compositions (Intersection Table)
