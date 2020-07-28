const express = require('express');
const router = express.Router();

const searchController = require('../controllers/searchController');

router.get('/', searchController.search);

router.post('/results', searchController.searching);

router.get('/films/:query/page/:page', searchController.searchFilm);

router.get('/films/:query', searchController.searchFilm);

router.get('/people/:query', searchController.searchPeople);

module.exports = router;