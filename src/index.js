const container = require('./containers/container');
const mainWorkflow = require('./workflows/mainWorkflow');

async function startApp() {
  const workflow = container.resolve('mainWorkflow');
  await workflow();
}

startApp().catch((err) => {
  const logger = container.resolve('logger');
  logger.error('Application startup failed', err);
});