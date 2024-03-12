// Import libraries
import React from 'react';
import styles from '../App.css'; //may modulate this later

// React component for homepage
function HomePage() {
  return (
    <>
      <div className="homepage-container">
        <div className="homepage-contents">
          <h2></h2>
          <p>While the streaming era has brought access to popular music to fans in an unprecedented way, fans of classical and orchestral music have been less successful in capitalizing on this revolution in music consumption. The database structure utilized in popular streaming services is designed around the relatively lean amount of data attached to a song or album. By contrast, classical music and its recordings have a far more complex set of data and relationships, which modern streaming databases are simply not constructed to handle.</p>
          <p>While most songs by popular artists have only one recording, with potentially one or two covers by other artists, classical pieces can be recorded numerous times by different artists and ensembles. For the most popular pieces, like Debussy’s Clair de Lune or Beethoven’s Symphony No. 9, there may be hundreds of different recordings. This leaves fans of classical music unable to navigate services and discover recordings with the same ease as fans of popular music. It also presents unique challenges for cataloguing and listening to classical pieces, as the approaches to listening differ between the two groups. One piece of a larger solution, then, is to create a new database for navigating compositions and recordings of classical music.</p>
          <p>Our database will aim to be the first step towards answering that problem. Our classical composition database will collect and store information about composers and their compositions, providing robust metadata for each composer’s body of work. It will be able to catalogue compositions ranging from piano sonatas to grand symphonies. Any given composer may have dozens (or even hundreds) of compositions to their name, each of which can be made up of any number of movements. With our database, users will be able to filter works by form, instrumentation, and composition year.</p>
          <p>For example, a user may want to discover all the concerti by Rachmaninoff. In a standard streaming service like Spotify, such a query is simply not possible, but in our database it can be accomplished by applying a filter for Compositions with a “Concerto” form where the composer is “Sergei Rachmaninoff”. When this database is complete, it could feasibly serve as a jumping off point to relate classical recordings by performers and ensembles to the works they are performing. This would allow far more robust searching of recordings and foster discovery of new pieces by fans. While this next step is out of scope for the project this term, we are designing our project with this feature set in mind.</p>
        </div>
      </div>
    </>
  );
}

export default HomePage;