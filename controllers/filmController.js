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
        var directors = new Set();
        var producers = new Set();
        var writers = new Set();
        var editors = new Set();
        var cinematography = new Set();
        var productionDesign = new Set();
        var artDirection = new Set();
        var visualEffects = new Set();
        var composers = new Set();
        var sound = new Set();
        var costumeDesignMakeUp = new Set();
        
        result2.data.crew.forEach(crew => {
            var person = {
                id: crew.id,
                name: crew.name
            }
            if (crew.job == "Director") {
                directors.add(person);
            } 
            else if (crew.job == "Producer" || crew.job == "Executive Producer" || 
            crew.job == "Supervising Producer" || crew.job == "Production Supervisor") {
                producers.add(person);
            }
            else if (crew.job == "Screenplay") {
                writers.add(person);
            }
            else if (crew.job == "Editor") {
                editors.add(person);   
            }
            else if (crew.job == "Director of Photography" || crew.job == "Cinematography" || 
            crew.job == "Supervising Producer") {
                cinematography.add(person);
            }
            else if (crew.job == "Production Design") {
                productionDesign.add(person);
            }
            else if (crew.job == "Art Direction" || crew.job == "Supervising Art Director" ||
            crew.job == "Assistant Art Director") {
                artDirection.add(person);
            }
            else if (crew.job == "Visual Effects Producer" || crew.job == "Visual Effects Supervisor" ||
            crew.job == "VFX Artist" || crew.job == "Animation Director") {
                visualEffects.add(person);
            }
            else if (crew.job == "Original Music Composer" ||crew.job == "Music") {
                composers.add(person);
            }
            else if (crew.job == "Sound Designer" || crew.job == "Sound Re-Recording Mixer" ||
            crew.job == "Supervising Sound Editor" || crew.job == "Sound Effects Editor" ||
            crew.job == "Supervising Dialogue Editor") {
                sound.add(person);
            }
            else if (crew.department == "Costume & Make-Up") {
                costumeDesignMakeUp.add(person);
            }
        });
        var crew = { directors: [...directors], producers: [...producers], writers: [...writers], 
            editors: [...editors], cinematography: [...cinematography], productionDesign: [...productionDesign], 
            artDirection: [...artDirection], visualEffects: [...visualEffects], composers: [...composers], 
            sound: [...sound], costumeDesignMakeUp: [...costumeDesignMakeUp] };

        options.url = apiurl3;
        var result3 = await axios(options);

        res.render('movieDetailsView', { data: result.data, cast: result2.data.cast, crew, altlang: result3.data });
    } catch (err) {
        console.error(err);
    }
}

module.exports = { getMovieDetails };