const axios = require('axios');
const tmdb = require('../api/tmdb');

const search = (req, res) => {
    res.render('searchView');
}

const searching = (req, res) => {
    if (req.body.searchBy == "byMovie") {
        res.redirect('/search/films/' + req.body.query);
    } 
    else if (req.body.searchBy == "byPerson") {
        res.redirect('/search/people/' + req.body.query);
    }
}

const searchPeople = async (req, res) => {
    let apiurl, results;
	const baseimgurl = tmdb.baseimgurl();
    var options = {
        method: 'GET'
    };
    try {
        const query = '&query=' + req.params.query;
        apiurl = tmdb.searchPerson + query;
        if (req.params.page) {
            const page = '&page=' + req.params.page;
            apiurl += page;
        }
        options.url = apiurl;
        results = await axios(options);
        var output = {
            page: results.data.page,
            total_results: results.data.total_results,
            total_pages: results.data.total_pages,
            data: []
        };
        results.data.results.forEach(person => {
            output.data.push({
                id: person.id,
                name: person.name,
                img: person.profile_path ? baseimgurl + person.profile_path : null,
                movies: person.known_for
            });
        });
        res.render('searchResultView', { query: req.params.query, output });
    } catch (err) {
        console.error(err);
    }
}

const searchFilm = async (req, res) => {
    let apiurl, results;
	const baseimgurl = tmdb.baseimgurl();
    var options = {
        method: 'GET'
    };
    try {
        const query = '&query=' + req.params.query;
        apiurl = tmdb.searchMovies + query;
        if (req.params.page) {
            const page = '&page=' + req.params.page;
            apiurl += page;
        }
        options.url = apiurl;
        results = await axios(options);
        var output = {
            page: results.data.page,
            total_results: results.data.total_results,
            total_pages: results.data.total_pages,
            data: []
        };
        results.data.results.forEach(movie => {
            output.data.push({
                id: movie.id,
                title: movie.title,
                img: movie.poster_path ? baseimgurl + movie.poster_path : null,
                year: movie.release_date ? (movie.release_date.split('-'))[0] : null,
                overview: movie.overview
            });
        });
		res.render('searchResultView', { query: req.params.query, output });
    } catch (err) {
        console.error(err);
    }
}

module.exports = { search, searching, searchFilm, searchPeople };