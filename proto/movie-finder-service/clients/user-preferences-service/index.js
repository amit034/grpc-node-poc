'use strict';
const _ = require('lodash');
const axios = require('axios').default;
const {loadSync,Reader, BufferWriter} = require('protobufjs');
const root = loadSync( __dirname + '/user-preferences-service.proto');
module.exports = {
    getClient: () => {
        const UserPreferencesRequest = root.lookup('UserPreferencesRequest');
        const UserPreferencesResponse = root.lookup('UserPreferencesResponse');
        return  {
            getShortlistedMovies(userPreferencesRequests) {
                const buffer = _.reduce(userPreferencesRequests, (buf, userPreferencesRequest ) => {
                    const message = UserPreferencesRequest.create(userPreferencesRequest);
                    UserPreferencesRequest.encodeDelimited(message, buf);
                    return buf;
                }, new BufferWriter())

                const data = buffer.finish();
                return axios({
                    method: 'post',
                    url: 'http://localhost:4052/UserPreferencesService/getShortlistedMovies',
                    data,
                    responseType: 'arraybuffer',
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        'Accept': 'application/octet-stream'
                    }
                }).then(({data}) => {
                    const userPreferencesResponses = [];
                    const reader = Reader.create(data);
                    while (reader.pos < reader.len) {
                        const message = UserPreferencesResponse.decodeDelimited(reader);
                        userPreferencesResponses.push(UserPreferencesResponse.toObject(message));
                    }
                    return userPreferencesResponses;
                });
            }
        }
    }
};