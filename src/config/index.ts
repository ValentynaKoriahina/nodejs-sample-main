import { Configuration } from 'log4js';

type ConfigType = {
  port: number;
  address: string;
  mongoAddress: string;
  chessApiAddress: string;
  log4js: Configuration;
};

const devConfig: ConfigType = {
  port: 8888,
  address: 'localhost',
  mongoAddress: 'mongodb://127.0.0.1:27018',
  chessApiAddress: 'http://localhost:8080/api',
  log4js: {
    appenders: {
      console: { type: 'console' },
      ms: {
        type: 'dateFile',
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true,
        filename: 'log/ms',
        maxLogSize: 1000000,
        compress: true,
      },
    },
    categories: {
      default: {
        appenders: ['ms', 'console'],
        level: 'debug',
      },
    },
  },
};

const prodConfig: ConfigType = {
  port: 8888,
  address: '0.0.0.0',
  mongoAddress: 'mongodb://db:27017',
  chessApiAddress: 'http://localhost:8080/api/',
  log4js: {
    appenders: {
      console: { type: 'console' },
      ms: {
        type: 'dateFile',
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true,
        filename: 'log/ms',
        maxLogSize: 1000000,
        compress: true,
      },
    },
    categories: {
      default: {
        appenders: ['ms', 'console'],
        level: 'debug',
      },
    },
  },
};

const config = {
  dev: devConfig,
  prod: prodConfig,
};

type EnvType = 'dev' | 'prod';
const env: EnvType = (process.env.NODE_ENV || 'dev').trim() === 'dev' ? 'dev' : 'prod';

export default config[env];
