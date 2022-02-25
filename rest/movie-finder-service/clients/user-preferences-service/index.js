'use strict';
const axios = require('axios').default;
module.exports = {
    getClient: () => {
        return  {
            getShortlistedMovies(userPreferencesRequest) {
                return axios({
                    method: 'post',
                    url: 'http://localhost:3052/UserPreferencesService/getShortlistedMovies',
                    data: userPreferencesRequest,
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                }).then((response) => response.data);
            }
        }
    }
};