import express from 'express';
import routers from './routers';
import config from './config';
import log4js from 'log4js';
import mongoose from 'mongoose';

export default async () => {
  const app = express();

  log4js.configure(config.log4js);

  // Отключаем кэширование запросов, возвращающих 304 вместо 200
  app.disable('etag');

  app.use(express.json({ limit: '1mb' }));

  app.use((req, _, next) => {
    const dateReviver = (_: string, value: unknown) => {
      if (value && typeof value === 'string') {
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
        if (dateRegex.test(value)) {
          return new Date(value);
        }
      }
      return value;
    };

    req.body = JSON.parse(JSON.stringify(req.body), dateReviver);
    next();
  });

  app.use('/api', routers);

  const { port, address } = config;
  app.listen(port, address, () => {
    log4js.getLogger().info(`Example app listening on port ${address}:${port}`);
  });

  await mongoose.connect(config.mongoAddress, {
    socketTimeoutMS: 30000,
  });

  return app;
};
