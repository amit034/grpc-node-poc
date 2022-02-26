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
            getShortlistedMovies(userPreferencesRequest) {
                const message = UserPreferencesRequest.create({payload: userPreferencesRequest});
                const data =  UserPreferencesRequest.encode(message).finish();
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
                    const message = UserPreferencesResponse.decode(data);
                    return UserPreferencesResponse.toObject(message);
                });
            }
        }
    }
};