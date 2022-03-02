'use strict';
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const router = express.Router();
app.use(bodyParser.json())
const port = 3051;
const Genre = {
    COMEDY: 0,
    ACTION: 1,
    THRILLER: 2,
    DRAMA: 3,
};
const sample = [
    {title: 'No country for old men', description: 'Western crime thriller', rating: 8.1, genre: Genre.ACTION},
    {title: 'Bourne Ultimatum', description: 'Action thriller', rating: 7.0, genre: Genre.ACTION},
    {title: 'The taxi driver', description: 'Psychological thriller', rating: 8.2, genre: Genre.THRILLER},
    {title: 'The Hangover', description: 'Hilarious ride', rating: 7.7, genre: Genre.COMEDY},
    {title: 'Raiders of the Lost Arc', description: 'Expedition in search of the lost arc', rating: 7.4, genre: Genre.ACTION},
    {title: 'Cast Away', description: 'survival story', rating: 7.8, genre: Genre.DRAMA},
    {title: 'Gladiator', description: 'Period drama', rating: 8.5, genre: Genre.DRAMA},
    {title: 'Jaws', description: 'Shark thrills', rating: 8.0, genre: Genre.THRILLER},
    {title: 'Inception', description: 'Sci fi action', rating: 8.8, genre: Genre.ACTION},
    {title: 'The Dark Knight', description: 'Sci fi action', rating: 9.0, genre: Genre.ACTION}
]

const db = _.flatten(_.fill(Array(10),sample));
async function isMovieEligible(movieStoreRequest, movie) {
    return new Promise((resolve) => setTimeout(() =>  resolve(movieStoreRequest.genre === movie.genre), 10));
}
async function run() {
    router.post('/getMovies', async function(req, res, next) {
        try {
            console.debug(`movie store size: ${_.size(db)}`);
            const movies  = [];
            for (let i = 0; i < db.length; ++i) {
                const movie = db[i];
                const isEligible = await isMovieEligible(req.body, movie);
                if (isEligible) movies.push(movie);

            }
            res.send(movies);
        } catch (e) {
            next(e);
        }
    });
    router.use((error, req, res, next) => {
        res.status(error.status || 500);
        res.send(error.message);
    });
    app.use('/MovieStoreService', router);
    return app.listen(port);
}

run().then(() => {
    console.log(`movie store rest start at ${port}`);
}).catch(err => console.log(err));