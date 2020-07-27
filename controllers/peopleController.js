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

        var castId = new Set();
        var crewId = new Set();
        var castList = [];
        var crewList = [];

        options.url = apiurl2;
        var result2 = await axios(options);
        result2.data.cast.forEach(cast => {
            if (cast.poster_path) {
                cast.poster_path = tmdb.baseimgurl() + cast.poster_path;
            }
            if (!castId.has(cast.id)) {
                castId.add(cast.id);
                castList.push(cast);
            }
        })
        result2.data.crew.forEach(crew => {
            if (crew.poster_path) {
                crew.poster_path = tmdb.baseimgurl() + crew.poster_path;
            }
            if (!crewId.has(crew.id)) {
                crewId.add(crew.id);
                crewList.push(crew);
            }
        })
        
        res.render('peopleDetailsView', { info: result.data, credits: { cast: castList, crew: crewList } });
    } catch (err) {
        console.error(err);
    }
}

module.exports = { getPeopleDetails };