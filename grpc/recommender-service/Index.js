'use strict';
const _ = require('lodash');
const grpc = require('@grpc/grpc-js');
const loader  = require('@grpc/proto-loader');
const packageDefinition = loader.loadSync( __dirname + '/recommender-service.proto');
const root = grpc.loadPackageDefinition(packageDefinition);
const port = 50053;
const server = new grpc.Server();

function findMovieForRecommendation(movies) {
    return movies[Math.floor(Math.random() * movies.length)];
}
server.addService(root.RecommenderService.service,  {
    getRecommendedMovie: (call, callback) => {
        const movies = [];
        let h = false;
        call.on('data',function(recommenderRequest) {
            if (!h) {
               console.time("recommending movie");
               h = true;
            }

            let movie = recommenderRequest.movie;
            movies.push(movie);
        });
        call.on('end',function(){
            callback(null, {movie: findMovieForRecommendation(movies)});
            console.timeEnd("recommending movie");
            h = false;
        });
    },
})
server.bindAsync( `127.0.0.1:${port}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`recommender service grpc start at port ${port}`)
})


