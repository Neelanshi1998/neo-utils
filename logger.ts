import { createLogger, format, transports } from 'winston';
import { PRODUCTION, TEST_PRODUCTION } from '../env';
import { isObject } from 'lodash/fp';
import { isUndefined } from 'lodash';

const { DD_ENV, ENABLE_ALL_LOGS } = process.env;
const logTransports = [];

if ([PRODUCTION, TEST_PRODUCTION].includes(DD_ENV) && ENABLE_ALL_LOGS === '1') {
  const httpTransportOptions = {
    host: 'http-intake.logs.datadoghq.com',
    path: '/v1/input/0f15dd904e91780bb8eb99d591b5f7fa?ddsource=nodejs&service=neo-fh',
    ssl: true,
  };

  logTransports.push(new transports.Http(httpTransportOptions));
}

logTransports.push(
  new transports.Console({
    format: format.simple(),
  }),
);

const logger = createLogger({
  level: 'info',
  exitOnError: false,
  format: format.json(),
  transports: logTransports,
});

const log = (level: string, data: any[]) => {
  for (const value of data) {
    if (isObject(value)) {
      logger.log(level, JSON.parse(JSON.stringify(value)));
    } else {
      logger.log(level, value);
    }
  }
};

export default {
  info: (arg1: any, arg2?: any) => {
    if (isUndefined(arg2)) {
      return logger.info(JSON.stringify(arg1));
    } else {
      return logger.info(JSON.stringify(arg1) + JSON.stringify(arg2));
    }
  },
  error: (arg1: any, arg2?: any) => {
    if (isUndefined(arg2)) {
      return logger.error(JSON.stringify(arg1));
    } else {
      return logger.error(JSON.stringify(arg1) + JSON.stringify(arg2));
    }
  },
};
