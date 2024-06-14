import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import { randomBytes } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';

const identity = randomBytes(8).toString('hex');

const name = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json')).toString('utf8'),
).name;

const format = winston.format((info) => {
  info.message = name + ' - ' + identity + ' - ' + info.message;
  return {
    clusterId: info?.clusterId,
    level: info?.level,
    message: info?.message,
    requestId: info?.requestId,
    timestamp: info?.timestamp,
  };
})();

if (process.env.NODE_ENV === 'local') {
  winston.loggers.add('occsapp', {
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
  });
}

export const logger = WinstonModule.createLogger({
  format,
  transports: [winston.loggers.get('occsapp')],
});
