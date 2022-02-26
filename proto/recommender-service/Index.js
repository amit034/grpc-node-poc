'use strict';
const _ = require('lodash');
const express = require('express');
const {loadSync, Reader} = require('protobufjs');
const bodyParser = require('body-parser')
const app = express();
const router = express.Router();
app.use(bodyParser.raw({limit: '50mb'}))
const port = 4053;
function findMovieForRecommendation({movies}) {
    return movies[Math.floor(Math.random() * movies.length)];
}

async function run() {
    const root = loadSync( __dirname + '/recommender-service.proto');
    router.post('/getRecommendedMovie', async function(req, res, next) {
        try {
            const RecommenderRequest = root.lookup('RecommenderRequest');
            const RecommenderResponse = root.lookup('RecommenderResponse');
            const messageIn = RecommenderRequest.decode(req.body);
            const recommenderRequest = RecommenderRequest.toObject(messageIn);
            const messageOut = RecommenderResponse.create({movie: findMovieForRecommendation(recommenderRequest)});
            const buf = RecommenderResponse.encode(messageOut).finish();
            res.send(buf);
        } catch (e) {
            next(e);
        }
    });
    router.use((error, req, res, next) => {
        res.status(error.status || 500);
        res.send(error.message);
    });
    app.use('/RecommenderService', router);
    return app.listen(port);
}

run().then(() => {
    console.log(`recommender service rest start at ${port}`);
}).catch(err => console.log(err));