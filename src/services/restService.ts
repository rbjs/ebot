import axios from 'axios';
import { Logger } from 'winston';
import config from '../config/config';

export interface RestService {
  makeRequest(endpoint: string, data: any): Promise<any>;
}

export default ({ config:any, logger }: { config: typeof config, logger: Logger }): RestService => {
  return {
    async makeRequest(endpoint: string, data: any): Promise<any> {
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