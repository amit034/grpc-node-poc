'use strict';
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const router = express.Router();
app.use(bodyParser.json({limit: '50mb'}))
const port = 3053;
function findMovieForRecommendation(movies) {
    return movies[Math.floor(Math.random() * movies.length)];
}

async function run() {
    router.post('/getRecommendedMovie', async function(req, res, next) {
        try {
            res.send({movie: findMovieForRecommendation(req.body)});
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