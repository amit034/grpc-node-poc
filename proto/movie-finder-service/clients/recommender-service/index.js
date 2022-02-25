'use strict';
const _ = require('lodash');
const axios = require('axios').default;
const {loadSync,Reader, BufferWriter} = require('protobufjs');
const root = loadSync( __dirname + '/recommender-service.proto');
module.exports = {
    getClient: () => {
        const RecommenderRequest = root.lookup('RecommenderRequest');
        const RecommenderResponse = root.lookup('RecommenderResponse');
        return  {
            getRecommendedMovie(recommenderRequests) {
                const buffer = _.reduce(recommenderRequests, (buf, recommenderRequest) => {
                    const message = RecommenderRequest.create(recommenderRequest);
                    RecommenderRequest.encodeDelimited(message, buf);
                    return buf;
                }, new BufferWriter())

                const data = buffer.finish();
                return axios({
                    method: 'post',
                    url: 'http://localhost:4053/RecommenderService/getRecommendedMovie',
                    data,
                    responseType: 'arraybuffer',
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        'Accept': 'application/octet-stream'
                    }
                }).then(({data}) => {
                    const message = RecommenderResponse.decode(data);
                    return RecommenderResponse.toObject(message);
                });
            }
        }
    }
};