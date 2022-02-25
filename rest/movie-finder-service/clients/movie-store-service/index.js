'use strict';
const axios = require('axios').default;
module.exports = {
    getClient: () => {
        return  {
            getMovies(movieStoreRequest) {
                return axios({
                    method: 'post',
                    url: 'http://localhost:3051/MovieStoreService/getMovies',
                    data: movieStoreRequest,
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                }).then((response) => response.data);
            }
        }
    }
}