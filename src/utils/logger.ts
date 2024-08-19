import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) => `[${timestamp}] [${level}]: ${message}`
    )
    // format.json()
  ),
  transports: [
    new transports.Console(),
    // new transports.File({ filename: 'logs/journal.log' })
  ]
});

export default (): WinstonLogger => logger;