import { cleanEnv, str, url } from 'envalid';
import path from 'path';

const config = cleanEnv(process.env, {
  KAFKA_BROKER: str({ desc: 'Kafka broker URL' }),
  API_BASE_URL: url({ desc: 'Base URL for the API' }),
  LOG_LEVEL: str({ choices: ['error', 'warn', 'info', 'debug'], default: 'info' }),
  LOG_DIR: str({ desc: 'Directory for logs', default: path.join(__dirname, '../../logs') }),
});

export default {
  kafka: {
    broker: config.KAFKA_BROKER,
  },
  api: {
    baseUrl: config.API_BASE_URL,
  },
  logLevel: config.LOG_LEVEL,
  logDir: config.LOG_DIR,
  indexFile: path.join(config.LOG_DIR, 'index.json'),
};