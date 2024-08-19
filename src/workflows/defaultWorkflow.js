module.exports = async ({ kafkaService, restService, logger }) => {
  logger.info("Starting workflow");
  await kafkaService.publish("topic1", "Hello Kafka");
  const restResponse = await restService.makeRequest("/endpoint", {
    key: "value",
  });
  logger.info("Workflow completed", restResponse);
};
