import { createContainer, asFunction, AwilixContainer } from 'awilix';
import config from '../config/config';
import KafkaService from '../services/kafkaService';
import RestService from '../services/restService';
import Logger from '../utils/logger';
import mainWorkflow, { MainWorkflowDeps } from '../workflows/mainWorkflow';

// Define the container interface
export interface AppContainer extends AwilixContainer {
  config: typeof config;
  kafkaService: ReturnType<typeof KafkaService>;
  restService: ReturnType<typeof RestService>;
  logger: ReturnType<typeof Logger>;
  mainWorkflow: () => Promise<void>;
}

// Create the container
const container = createContainer<AppContainer>();

container.register({
  config: asFunction(() => config).singleton(),
  kafkaService: asFunction(KafkaService).singleton(),
  restService: asFunction(RestService).singleton(),
  logger: asFunction(Logger).singleton(),
  // Register mainWorkflow as a function that returns a Promise<void>
  mainWorkflow: asFunction((deps: MainWorkflowDeps) => () => mainWorkflow(deps)).singleton(),
});

export default container;