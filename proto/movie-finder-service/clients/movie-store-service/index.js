'use strict';
const axios = require('axios').default;
const {loadSync,Reader} = require('protobufjs');
const root = loadSync( __dirname + '/movie-store-service.proto');

module.exports = {
    getClient: () => {
        const MovieStoreRequest = root.lookup('MovieStoreRequest');
        const MovieStoreResponse = root.lookup('MovieStoreResponse');
        return  {
            getMovies(movieStoreRequest) {
                const message = MovieStoreRequest.create(movieStoreRequest)
                const data  = MovieStoreRequest.encode(message).finish();
                return axios({
                    method: 'post',
                    url: 'http://localhost:4051/MovieStoreService/getMovies',
                    data,
                    responseType: 'arraybuffer',
                    headers: {
                        "Content-Type": "application/octet-stream",
                        'Accept': 'application/octet-stream'
                    }
                }).then(({data}) => {
                    const movieStoreResponses = [];
                    const reader = Reader.create(data);
                    while (reader.pos < reader.len) {
                        const message = MovieStoreResponse.decodeDelimited(reader);
                        movieStoreResponses.push(MovieStoreResponse.toObject(message));
                    }
                    return movieStoreResponses;
                });
            }
        }
    }
}