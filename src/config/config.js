const Joi = require('joi');
const dotenv = require('dotenv');

// Load environment variables from .env file (if present)
dotenv.config();

// Define the configuration schema
const configSchema = Joi.object({
  KAFKA_BROKER: Joi.string().required(),
  API_BASE_URL: Joi.string().uri().required(),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
  // Add other config validations as needed
}).unknown() // Allow additional properties that aren't specified in the schema
  .required();

// Validate the process.env against the schema
const { error, value: envVars } = configSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Build the config object with validated environment variables
const config = {
  kafka: {
    broker: envVars.KAFKA_BROKER,
  },
  api: {
    baseUrl: envVars.API_BASE_URL,
  },
};

module.exports = config;