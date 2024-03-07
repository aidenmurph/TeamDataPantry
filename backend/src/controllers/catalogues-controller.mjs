// Import dependencies
import * as catalogues from '../models/catalogues-model.mjs';

// CREATE Controller *******************************************
function createCatalogueController(req, res) {
  catalogues.createCatalogue(req.body)
    .then(result => {
      console.log('Create result:', result);
      res.json({ success: true, message: 'Catalogue created successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error creating catalogue' });
    });
}

// RETRIEVE Controllers ****************************************
function retrieveCataloguesController(req, res) {
  catalogues.retrieveCatalogues()
    .then(rows => {
      res.json(rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error fetching catalogues');
    });
}

// UPDATE Controller *******************************************
function updateCatalogueController(req, res) {
  catalogues.updateCatalogue(req.params.id, req.body)
    .then(result => {
      console.log('Update result:', result);
      res.json({ success: true, message: 'Catalogue updated successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error updating catalogue' });
    });
}

// DELETE Controller *******************************************
function deleteCatalogueController(req, res) {
  console.log(`Attempting to delete catalogue with ID: ${req.params.id}`);
  
  catalogues.deleteCatalogue(req.params.id)
    .then(result => {
      console.log('Delete result:', result);
      res.json({ success: true, message: 'Catalogue deleted successfully' });
    })
    .catch(err => {
      console.error('Error in deleteCatalogueController:', err);
      res.status(500).json({ error: 'Error deleting catalogue' });
    });
}

export {
  createCatalogueController,
  retrieveCataloguesController,
  updateCatalogueController,
  deleteCatalogueController
};