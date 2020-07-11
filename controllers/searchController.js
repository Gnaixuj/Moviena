const axios = require('axios');
const tmdb = require('../api/tmdb');

const search = (req, res) => {
    res.render('searchView');
}

const searchItem = async (req, res) => {
    let apiurl;
    const query = '&query=' + req.body.query;
    if (req.body.searchBy == 'byMovie') {
        apiurl = tmdb.searchMovies + query;
    }
    else if (req.body.searchBy == 'byPerson') {
        apiurl = tmdb.searchPerson + query;
    }
    const options = {
        url: apiurl,
        method: 'GET'
    };
    try {
        const results = await axios(options);
        // console.log(results.data.results[0].known_for);
        const baseimgurl = tmdb.baseimgurl('w500');
        res.render('searchResultView', { query: req.body.query, data: results.data, baseimgurl });
    }
    catch (err) {
        console.error(err);
    }
}

module.exports = { search, searchItem };