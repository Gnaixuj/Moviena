const axios = require('axios');
const tmdb = require('../api/tmdb');

const getPeopleDetails = async (req, res) => {
    const id = req.params.id;
    const apiurl = tmdb.getPeopleDetails(id);
    const apiurl2 = tmdb.getPeopleMovieCredits(id);
    const options = {
        method: 'GET',
        url: apiurl
    };
    try {
        var result = await axios(options);
        if (result.data.profile_path) {
            result.data.profile_path = tmdb.baseimgurl() + result.data.profile_path;
        }

        var castSet = new Set();
        var crewSet = new Set();
        var tempObj = {};

        options.url = apiurl2;
        var result2 = await axios(options);
        result2.data.cast.forEach(cast => {
            if (cast.poster_path) {
                cast.poster_path = tmdb.baseimgurl() + cast.poster_path;
            }
            // tempObj.id = cast.id;
            // tempObj.title = cast.title;
            // tempObj.poster_path = cast.poster_path;
            // castSet.add(tempObj);
        })
        result2.data.crew.forEach(crew => {
            if (crew.poster_path) {
                crew.poster_path = tmdb.baseimgurl() + crew.poster_path;
            }
            // tempObj.id = crew.id;
            // tempObj.title = crew.title;
            // tempObj.poster_path = crew.poster_path;
            // crewSet.add(tempObj);
        })
        // { cast: [...castSet], crew: [...crewSet] } }
        res.render('peopleDetailsView', { info: result.data, credits: result2.data });
    } catch (err) {
        console.error(err);
    }
}

module.exports = { getPeopleDetails };