'use strict';
const axios = require('axios').default;
module.exports = {
    getClient: () => {
        return  {
            getRecommendedMovie(recommenderRequest) {
                return axios({
                    method: 'post',
                    url: 'http://localhost:3053/RecommenderService/getRecommendedMovie',
                    data: recommenderRequest,
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                }).then((response) => response.data);
            }
        }
    }
};