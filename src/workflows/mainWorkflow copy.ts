import { KafkaService } from '../services/kafkaService';
import { RestService } from '../services/restService';
import { Logger } from 'winston';
import { createWorkflowRunDir, logResponse, searchByJsonPath } from '../utils/journal';
import config from '../config/config';

export interface MainWorkflowDeps {
  kafkaService: KafkaService;
  restService: RestService;
  logger: Logger;
  config: typeof config;
}

export default async function mainWorkflow({
  kafkaService,
  restService,
  logger,
  config
}: MainWorkflowDeps): Promise<void> {
  logger.info('Starting workflow');

  const workflowDir = createWorkflowRunDir();

  await kafkaService.publish('topic1', 'Hello Kafka');
  logResponse({ data: 'example', status: 'success', importantField: 'abc123' }, 1, workflowDir);

  const restResponse = await restService.makeRequest('/endpoint', { key: 'value' });
  logResponse(restResponse, 2, workflowDir);

  logger.info('Workflow completed');

  // Example search
  const jsonPathQuery = '$.data.deeplyNestedField[?(@.attribute == "desiredValue")]';
  const searchResults = searchByJsonPath(jsonPathQuery);

  logger.info('Search Results:', searchResults);
}