import React from 'react';

function Movements() {
  const movementsData = [
    {
      composition: 'Scheherazade',
      composer: 'Rimsky-Korsakov',
      movements: [
        { number: 1, title: 'The Sea and Sinbad\'s Ship' },
        { number: 2, title: 'The Story of the Kalendar Prince' },
        { number: 3, title: 'The Young Prince and the Young Princess' },
        { number: 4, title: 'Festival at Baghdad - The Sea - The Ship Breaks against a Cliff Surmounted by a Bronze Horseman' },
      ],
    },
    {
      composition: 'Concerto for the Left Hand',
      composer: 'Ravel',
      movements: [
        { number: 1, title: 'Lento' },
        { number: 2, title: 'Allegro' },
        { number: 3, title: 'Tempo primo' },
      ],
    },
    {
      composition: 'String Quartet in F Major',
      composer: 'Ravel',
      movements: [
        { number: 1, title: 'Allegro moderato - très doux' },
        { number: 2, title: 'Assez vif - très rythmé' },
        { number: 3, title: 'Très lent' },
        { number: 4, title: 'Vif et agité' },
      ],
    },
    {
      composition: 'String Quartet in E Minor',
      composer: 'Fauré',
      movements: [
        { number: 1, title: 'Allegro moderato' },
        { number: 2, title: 'Andante' },
        { number: 3, title: 'Allegro' },
      ],
    },
    {
      composition: 'String Quartet in G Minor',
      composer: 'Debussy',
      movements: [
        { number: 1, title: 'Animé et très décidé' },
        { number: 2, title: 'Assez vif et bien rythmé' },
        { number: 3, title: 'Andantino, doucement expressif' },
        { number: 4, title: 'Très modéré - En animant peu à peu - Très mouvementé et avec passion' },
      ],
    },
    {
      composition: 'Piano Concerto in G Major',
      composer: 'Ravel',
      movements: [
        { number: 1, title: 'Allegramente' },
        { number: 2, title: 'Adagio assai' },
        { number: 3, title: 'Presto' },
      ],
    },
    {
      composition: 'Ballade in F-sharp Major',
      composer: 'Fauré',
      movements: [
        { number: 1, title: 'Andante cantabile' },
      ],
    }
];
  // Handlers for Edit and Delete actions - to be implemented
  const handleEdit = (compositionName, movementNumber) => {
    // Implement edit functionality
  };

  const handleDelete = (compositionName, movementNumber) => {
    // Implement delete functionality
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Composition</th>
            <th>Composer</th>
            <th>Movement</th>
            <th>Title</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {movementsData.map((item) => 
            item.movements.map((movement) => (
              <tr key={`${item.composition}-${movement.number}`}>
                <td>{item.composition}</td>
                <td>{item.composer}</td>
                <td>{movement.number}</td>
                <td>{movement.title}</td>
                <td><button onClick={() => handleEdit(item.composition, movement.number)}>Edit</button></td>
                <td><button onClick={() => handleDelete(item.composition, movement.number)}>Delete</button></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Movements;