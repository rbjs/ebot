const { createContainer, asFunction } = require('awilix');
const config = require('../config/config');
const KafkaService = require('../services/kafkaService');
const RestService = require('../services/restService');
const Logger = require('../utils/logger');
const mainWorkflow = require('../workflows/mainWorkflow');

const container = createContainer();

container.register({
  config: asFunction(() => config).singleton(),
  logger: asFunction(Logger).singleton(),
  kafkaService: asFunction(KafkaService).singleton(),
  restService: asFunction(RestService).singleton(),
  mainWorkflow: asFunction(mainWorkflow).singleton()
});

module.exports = container;