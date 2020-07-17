const express = require('express');
const router = express.Router();

const filmController = require('../controllers/filmController');

router.get('/:id', filmController.getMovieDetails);

module.exports = router;