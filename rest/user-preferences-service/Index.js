'use strict';
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const router = express.Router();
app.use(bodyParser.json({limit: '50mb'}))
const port = 3052
const usersPreferences = {
    1: ({rating}) => rating >= 8.0,
    2: ({rating}) => rating >= 8.5,
    default: () => true
}
async function isEligible(userId, movie) {
    return _.get(usersPreferences, `${userId}`, usersPreferences.default)(movie);
}
async function run() {
    router.post('/getShortlistedMovies', async function(req, res, next) {
        try {
            const shortListed = _.filter(req.body,(movieRequest) => {
                let userId = movieRequest.userId;
                let movie = movieRequest.movie;
                return isEligible(userId, movie);
            });
            res.send(shortListed);
        } catch (e) {
            next(e);
        }
    });
    router.use((error, req, res, next) => {
        res.status(error.status || 500);
        res.send(error.message);
    });
    app.use('/UserPreferencesService', router);
    return app.listen(port);
}

run().then(() => {
    console.log(`user Preferences rest start at ${port}`);
}).catch(err => console.log(err));