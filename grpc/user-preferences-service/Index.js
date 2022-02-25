'use strict';
const _ = require('lodash');
const grpc = require('@grpc/grpc-js');
const loader  = require('@grpc/proto-loader');
const port = 50052;
const packageDefinition = loader.loadSync( __dirname + '/user-preferences-service.proto');
const root = grpc.loadPackageDefinition(packageDefinition);

const usersPreferences = {
    1: ({rating}) => rating >= 8.0,
    2: ({rating}) => rating >= 8.5,
    default: () => true
}
function isEligible(userId, movie) {
    return _.get(usersPreferences, `${userId}`, usersPreferences.default)(movie);
}

const server = new grpc.Server();

server.addService(root.UserPreferencesService.service,  {
    getShortlistedMovies: (call) => {
        call.on('data', function(movieRequest){
            let userId = movieRequest.userId;
            let movie = movieRequest.movie;
            if (isEligible(userId, movie)) {
                call.write({movie});
            }
        });
        call.on('end', () => {
            call.end();
        })
    }
})
server.bindAsync( `127.0.0.1:${port}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`user preferences grpc service  start at port ${port}`)
})