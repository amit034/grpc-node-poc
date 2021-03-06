'use strict';
const _ = require('lodash');
const {loadPackageDefinition, credentials, makeGenericClientConstructor} = require('@grpc/grpc-js')
const {loadSync}  = require('@grpc/proto-loader');
const PROTO_PATH = __dirname + '/movie-store-service.proto';
const options = {
    keepCase: false,
    longs: true,
    enums: true,
    defaults: true,
    oneofs: true,
};
const packageDefinition = loadSync(PROTO_PATH, options);
const MovieStoreService = loadPackageDefinition(packageDefinition).MovieStoreService;
let client
module.exports = {
    getClient: () => {
        if (!client) {
            client = new MovieStoreService('localhost:50051', credentials.createInsecure());
        }
        return client;
    }
}
