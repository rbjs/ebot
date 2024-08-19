import { KafkaService } from '../services/kafkaService';
import { RestService } from '../services/restService';
import { Logger } from 'winston';
import config from '../config/config';

export interface MainWorkflowDeps {
  kafkaService: KafkaService;
  restService: RestService;
  logger: Logger;
  config: typeof config;
}

export default async function mainWorkflow({ kafkaService, restService, logger }: MainWorkflowDeps): Promise<void> {
  logger.info('Starting workflow');


}