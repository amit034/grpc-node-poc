'use strict';
const {loadPackageDefinition, credentials} = require('@grpc/grpc-js')
const {loadSync}  = require('@grpc/proto-loader');
const PROTO_PATH = __dirname + '/user-preferences-service.proto';
const options = {
    keepCase: false,
    longs: true,
    enums: true,
    defaults: true,
    oneofs: true,
};
const packageDefinition = loadSync(PROTO_PATH, options);
const UserPreferencesService = loadPackageDefinition(packageDefinition).UserPreferencesService;
let client
module.exports = {
    getClient: () => {
        if (!client) {
            client = new UserPreferencesService('localhost:50052', credentials.createInsecure());
        }
        return client;
    }
}