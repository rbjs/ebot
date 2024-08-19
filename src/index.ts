import container from './containers/container';

async function startApp() {
  const workflow = container.resolve('mainWorkflow');
  await workflow();
}

startApp().catch((err: any) => {
  const logger = container.resolve('logger');
  logger.error('Application startup failed', err);
});