'use strict';
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const router = express.Router();
app.use(bodyParser.json())
const movieStore = require('./clients/movie-store-service');
const userPreferences = require('./clients/user-preferences-service');
const recommender = require('./clients/recommender-service');

function addUserId(userId)  {
    return (movies) => {
        return _.map(movies, ({movie})=> {
            return {userId, movie};
        }, []);
    }
}
async function run() {
    router.post('/findMovie', async function(req, res, next) {
        try {
            console.time("find movie");
            const movieStoreClient = movieStore.getClient();
            const userPreferencesClient = userPreferences.getClient();
            const recommenderClient = recommender.getClient();
            const {userId, genre} = req.body;
            const recommenderResponse = await movieStoreClient.getMovies({genre})
            .then(addUserId(userId))
            .then(userPreferencesClient.getShortlistedMovies)
            .then(recommenderClient.getRecommendedMovie);
            console.timeEnd("find movie");
            return res.send(recommenderResponse);
        } catch (e) {
            next(e);
        }
    });
    router.use((error, req, res, next) => {
        res.status(error.status || 500);
        res.send(error.message);
    })
    app.use('/MovieFinderService', router);
    return app.listen(4000);
}

run().then(() => {

    console.log('movie finder rest start at 4000');
}).catch(err => console.log(err));




