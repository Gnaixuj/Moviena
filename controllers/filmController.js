const axios = require('axios');
const tmdb = require('../api/tmdb');
const ISO6391 = require('iso-639-1');

const getMovieDetails = async (req, res) => {
    const id = req.params.id;
    const apiurl = tmdb.getDetails(id);
    const apiurl2 = tmdb.getCredits(id);
    const apiurl3 = tmdb.getAlternativeTitles(id);
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
        result.data.tagline = result.data.tagline.slice(0, result.data.tagline.length - 1);
        result.data.spoken_languages.forEach(lang => {
            lang.name = ISO6391.getName(lang.iso_639_1);
        });

        options.url = apiurl2;
        var result2 = await axios(options);
        var directors = []
        result2.data.crew.forEach(crew => {
            if (crew.job == "Director") {
                directors.push(crew.name);
            } 
        });

        options.url = apiurl3;
        var result3 = await axios(options);

        res.render('movieDetailsView', { data: result.data, cast: result2.data.cast, crew: result2.data.crew, directors, altlang: result3.data });
    } catch (err) {
        console.error(err);
    }
}

module.exports = { getMovieDetails };