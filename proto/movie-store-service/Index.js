'use strict';
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {loadSync, BufferWriter} = require('protobufjs');
const app = express();
app.use(bodyParser.raw());
const router = express.Router();
const port = 4051;
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

const db = _.flatten(_.fill(Array(10000),sample));
function isEligible(movieStoreRequest, movie) {
    return movieStoreRequest.genre === movie.genre;
}

async function run() {
    const root = loadSync( __dirname + '/movie-store-service.proto');
    router.post('/getMovies', async function(req, res, next) {
        try {
            const MovieStoreRequest = root.lookup('MovieStoreRequest');
            const MovieStoreResponse = root.lookup('MovieStoreResponse');
            const messageIn = MovieStoreRequest.decode(req.body);
            const movieStoreRequest = MovieStoreRequest.toObject(messageIn);
            console.debug(`movie store size: ${_.size(db)}`);
            const movies  = _.filter(db, (movie) => {
                return isEligible(movieStoreRequest, movie);
            });
            const buffer = _.reduce(movies, (buf, movie ) => {
                const message = MovieStoreResponse.create({movie});
                MovieStoreResponse.encodeDelimited(message, buf);
                return buf;
            }, new BufferWriter())

            const movieStoreResponse = buffer.finish();
            res.setHeader('Content-Type', 'application/octet-stream');
            res.send(movieStoreResponse);
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