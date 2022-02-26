'use strict';
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {loadSync, BufferWriter, Reader} = require('protobufjs');
const app = express();
const router = express.Router();
app.use(bodyParser.raw({limit: '50mb'}));
const port = 4052
const usersPreferences = {
    1: ({rating}) => rating >= 8.0,
    2: ({rating}) => rating >= 8.5,
    default: () => true
}
async function isEligible(userId, movie) {
    return _.get(usersPreferences, `${userId}`, usersPreferences.default)(movie);
}
async function run() {
    const root = loadSync( __dirname + '/user-preferences-service.proto');
    router.post('/getShortlistedMovies', async function(req, res, next) {
        try {
            const UserPreferencesRequest = root.lookup('UserPreferencesRequest');
            const UserPreferencesResponse = root.lookup('UserPreferencesResponse');
            const messageIn = UserPreferencesRequest.decode(req.body);
            const {payload} = UserPreferencesRequest.toObject(messageIn);
            const shortListed = _.reduce(payload,(agg, userPreferencesRequest) => {
                let userId = userPreferencesRequest.userId;
                let movie = userPreferencesRequest.movie;
                if (isEligible(userId, movie)) {
                    agg.push(movie);
                }
                return agg;
            }, []);

            const messageOut = UserPreferencesResponse.create({movies: shortListed});
            res.setHeader('Content-Type', 'application/octet-stream');
            res.send( UserPreferencesResponse.encode(messageOut).finish());
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