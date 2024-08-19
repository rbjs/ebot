import { Kafka, Consumer, Producer } from 'kafkajs';
import { Logger } from 'winston';
import config from '../config/config';

export interface KafkaService {
  publish(topic: string, message: string): Promise<void>;
  subscribe(topic: string, handler: { handle: (message: string) => void }): Promise<void>;
}

export default ({ config:any, logger }: { config: typeof config; logger: Logger }): KafkaService => {
  const kafka = new Kafka({ clientId: 'my-app', brokers: [config.kafka.broker] });
  const producer: Producer = kafka.producer();
  const consumer: Consumer = kafka.consumer({ groupId: 'my-group' });

  // Connect the producer once and keep it alive
  producer.connect().catch((err) => logger.error('Failed to connect producer', err));

  return {
    async publish(topic: string, message: string): Promise<void> {
      try {
        await producer.send({ topic, messages: [{ value: message }] });
        logger.info(`Published to Kafka: ${topic} - ${message}`);
      } catch (error) {
        logger.error(`Failed to publish message to ${topic}`, error);
      }
    },

    async subscribe(topic: string, handler: { handle: (message: string) => void }): Promise<void> {
      try {
        await consumer.connect();
        await consumer.subscribe({ topic });
        await consumer.run({
          eachMessage: async ({ message }) => {
            try {
              const value = message.value?.toString();
              if (value) {
                handler.handle(value);
              } else {
                logger.warn('Received empty message');
              }
            } catch (error) {
              logger.error('Error processing message', error);
            }
          },
        });
        logger.info(`Subscribed to Kafka topic: ${topic}`);
      } catch (error) {
        logger.error(`Failed to subscribe to ${topic}`, error);
      }
    },

    // async disconnect(): Promise<void> {
    //   await producer.disconnect();
    //   await consumer.disconnect();
    //   logger.info('Kafka producer and consumer disconnected.');
    // },
  };
};