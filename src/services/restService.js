

// restService.js
const axios = require('axios');

module.exports = ({ config, logger }) => {
  return {
    async makeRequest(endpoint, data) {
      try {
        const response = await axios.post(`${config.api.baseUrl}${endpoint}`, data);
        logger.info('REST request successful', response.data);
        return response.data;
      } catch (error) {
        logger.error('REST request failed', error);
        throw error;
      }
    },
  };
};