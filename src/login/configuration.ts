import { Logger } from '@nestjs/common';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const logger = new Logger('configuration');

const configuration = {
  idp: {
    privateKey: null,
    publicKey: null,
  },
  sp: [],
};
try {
  const pathIdp = join(__dirname, '..', '..', 'config', 'idp');
  configuration.idp.privateKey = readFileSync(join(pathIdp, 'privateKey.pem'));
  configuration.idp.publicKey = readFileSync(join(pathIdp, 'publicKey.cer'));

  const pathSp = join(__dirname, '..', '..', 'config', 'sp');
  const spFiles = readdirSync(pathSp);
  spFiles.forEach((f) =>
    configuration.sp.push({
      host: f.replace(/\.[^.]+$/, ''),
      cert: readFileSync(join(pathSp, f)),
    }),
  );
} catch (ex) {
  logger.error('configuration not loaded: ' + JSON.stringify(ex));
}
export default () => configuration;
