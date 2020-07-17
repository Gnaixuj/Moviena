const axios = require('axios');
const tmdb = require('../api/tmdb');

const getMovieDetails = async (req, res) => {
    const id = req.params.id;
    const apiurl = tmdb.getDetails(id);
    const options = {
        method: 'GET',
        url: apiurl
    };
    try {
        var result = await axios(options);
        if (result.data.backdrop_path) {
            result.data.backdrop_path = tmdb.baseimgurl() + result.data.backdrop_path;
        }
        if (result.data.poster_path) {
            result.data.poster_path = tmdb.baseimgurl() + result.data.poster_path;
        }
        res.render('movieDetailsView', { data: result.data });
    } catch (err) {
        console.error(err);
    }
}

module.exports = { getMovieDetails };