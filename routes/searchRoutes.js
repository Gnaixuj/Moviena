const express = require('express');
const router = express.Router();

const searchController = require('../controllers/searchController');

router.get('/', searchController.search);

router.post('/results', searchController.searchItem);

router.get('/:id', searchController.getMovieDetails);

module.exports = router;