const axios = require('axios');
const tmdb = require('../api/tmdb');

const search = (req, res) => {
    res.render('searchView');
}

const searchItem = async (req, res) => {
    let apiurl, results;
	const baseimgurl = tmdb.baseimgurl('w500');
    var options = {
        method: 'GET'
    };
    try {
        const query = '&query=' + req.body.query;
        if (req.body.searchBy == 'byMovie') {
            apiurl = tmdb.searchMovies + query;
            options.url = apiurl;
            results = await axios(options);
			res.render('searchResultView', { query: req.body.query, data: results.data, baseimgurl });
        }
        else if (req.body.searchBy == 'byPerson') {
            apiurl = tmdb.searchPerson + query;
            options.url = apiurl;
            const persons = await axios(options);
            var personsInfo = [];
            persons.data.results.forEach(person => {
                var personInfo = {};
                personInfo.known_for = person.known_for_department;
                personInfo.uri = tmdb.getMovieCredits(person.id)
                personsInfo.push(personInfo);
            });
    
            var data = {
                results: [],
                total_results: 0
            };
            const promises = personsInfo.map(async personInfo => {
                options.url = personInfo.uri;
                const results = axios(options);
                return results;
            });
            const results = await Promise.all(promises);

            for (let i = 0; i < results.length; i++) {
                if (personsInfo[i].known_for == "Acting") {
                    data.total_results = data.total_results + results[i].data.cast.length;
                    data.results.push(...results[i].data.cast);
                }
                else {
                    data.total_results = data.total_results + results[i].data.crew.length;
                    data.results.push(...results[i].data.crew);
                }
            }
            // console.log(data);
            res.render('searchResultView', { query: req.body.query, data, baseimgurl });
        }
    } catch (err) {
        console.error(err);
    }
}

module.exports = { search, searchItem };