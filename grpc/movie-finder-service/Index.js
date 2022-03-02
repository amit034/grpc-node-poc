'use strict';
const express = require('express');
const bodyParser = require('body-parser')
const app = express();

const router = express.Router();
app.use(bodyParser.json())
const stream =  require('stream');
const {Transform, pipeline} = stream;
const movieStore = require('./clients/movie-store-service');
const userPreferences = require('./clients/user-preferences-service');
const recommender = require('./clients/recommender-service');
function addUserIdTransform(userId) {
    return new Transform({
        objectMode: true,
        transform({movie}, encoding, callback) {
            callback(null, {userId, movie});
        }
    });
}
async function run() {
    router.post('/findMovie', async function(req, res, next) {
        try {
            const movieStoreClient = movieStore.getClient();
            const userPreferencesClient = userPreferences.getClient();
            const recommenderClient = recommender.getClient();
            const {userId, genre} = req.body;
            const recommendMovieStream = recommenderClient.getRecommendedMovie((err, recommenderResponse) => {
                if (err) {
                    console.error(err);
                    return next(err)
                }
                return res.send(recommenderResponse);
            })
            pipeline(
                movieStoreClient.getMovies({genre}),
                new Transform({
                    objectMode: true,
                    transform({movie}, encoding, callback) {
                        callback(null, {userId, movie});
                    }
                }),
                userPreferencesClient.getShortlistedMovies(),
                recommenderClient.getRecommendedMovie((err, recommenderResponse) => {
                    if (err) {
                        console.error(err);
                        return next(err)
                    }
                    return res.send(recommenderResponse);
                }),
                (err) => {
                    if (err) {
                        next({message: err.message})
                    }
                }
            );
        } catch (e) {
            next(e);
        }

    });
    router.use((error, req, res, next) => {
        res.status(error.status || 500);
        res.send(error.message);
    })
    app.use('/MovieFinderService', router);
    return app.listen(5000);
}

run().then(() => {
    console.log('movie finder grpc start at 5000');
}).catch(err => console.log(err));




