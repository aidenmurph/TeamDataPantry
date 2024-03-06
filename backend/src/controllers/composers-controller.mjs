// Import dependencies
import composers from '../models/composers-model';

// CREATE Controller *******************************************
async function createComposer(req, res) {
  try {
    const result = await composers.createComposer(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating composer');
  }
}

// RETRIEVE Controllers ****************************************
async function getAllComposers(req, res) {
    try {
      const rows = await composers.retrieveComposers();
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching composers');
    }
  }

// UPDATE Controller *******************************************
async function updateComposer(req, res) {
  try {
    const result = await composers.updateComposer(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating composer');
  }
}

// DELETE Controller *******************************************
async function deleteComposer(req, res) {
  try {
    const result = await composers.deleteComposer(req.params.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting composer');
  }
}

export {
  getAllComposers,
  createComposer,
  updateComposer,
  deleteComposer
};
