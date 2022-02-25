'use strict';
const _ = require('lodash');
const grpc = require('@grpc/grpc-js');
const {loadSync}  = require('@grpc/proto-loader');
const packageDefinition = loadSync( __dirname + '/movie-store-service.proto');
const root = grpc.loadPackageDefinition(packageDefinition);
const port = 50051;
const Genre = _.reduce(root.Genre.type.value, (agg, {name, number}) => {
    agg[name] = number;
    return agg;
}, {})
const sample = [
    {title: 'No country for old men', description: 'Western crime thriller', rating: 8.1, genre: Genre.ACTION},
    {title: 'Bourne Ultimatum', description: 'Action thriller', rating: 7.0, genre: Genre.ACTION},
    {title: 'The taxi driver', description: 'Psychological thriller', rating: 8.2, genre: Genre.THRILLER},
    {title: 'The Hangover', description: 'Hilarious ride', rating: 7.7, genre: Genre.COMEDY},
    {title: 'Raiders of the Lost Arc', description: 'Expedition in search of the lost arc', rating: 7.4, genre: Genre.ACTION},
    {title: 'Cast Away', description: 'survival story', rating: 7.8, genre: Genre.DRAMA},
    {title: 'Gladiator', description: 'Period drama', rating: 8.5, genre: Genre.DRAMA},
    {title: 'Jaws', description: 'Shark thrills', rating: 8.0, genre: Genre.THRILLER},
    {title: 'Inception', description: 'Sci fi action', rating: 8.8, genre: Genre.ACTION},
    {title: 'The Dark Knight', description: 'Sci fi action', rating: 9.0, genre: Genre.ACTION}
]
const db = _.flatten(_.fill(Array(10000),sample));
function isEligible(movieStoreRequest, movie) {
    return movieStoreRequest.genre === movie.genre;
}
const server = new grpc.Server();
server.addService(root.MovieStoreService.service,  {
    getMovies: async(call) => {
        console.debug(`movie store size: ${_.size(db)}`);
        console.time("get movies from store");
        await Promise.all(_.map(db, movie => {
            if(isEligible(call.request, movie)) {
               call.write({movie});
            }
        }));
        call.end();
        console.timeEnd("get movies from store");
    }
})
server.bindAsync( `127.0.0.1:${port}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`movie store grpc start at ${port}`);
})