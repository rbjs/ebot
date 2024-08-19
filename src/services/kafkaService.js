// kafkaService.js
const { Kafka } = require('kafkajs');

module.exports = ({ config, logger }) => {
  const kafka = new Kafka({ clientId: 'my-app', brokers: [config.kafka.broker] });
  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId: 'my-group' });

  return {
    async publish(topic, message) {
      await producer.connect();
      await producer.send({ topic, messages: [{ value: message }] });
      await producer.disconnect();
      logger.info(`Published to Kafka: ${topic} - ${message}`);
    },
    async subscribe(topic, handler) {
      await consumer.connect();
      await consumer.subscribe({ topic });
      await consumer.run({
        eachMessage: async ({ message }) => {
          handler.handle(message.value.toString());
        },
      });
    },
  };
};