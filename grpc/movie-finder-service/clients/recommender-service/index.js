'use strict';
const {loadPackageDefinition, credentials} = require('@grpc/grpc-js')
const {loadSync}  = require('@grpc/proto-loader');
const PROTO_PATH = __dirname + '/recommender-service.proto';
const packageDefinition = loadSync(PROTO_PATH);
const RecommenderService = loadPackageDefinition(packageDefinition).RecommenderService;
let client
module.exports = {
    getClient: () => {
        if (!client) {
            client = new RecommenderService('localhost:50053', credentials.createInsecure());
        }
        return client;
    }
}