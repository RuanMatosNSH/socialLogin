import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { logger } from './logger';

const router = express.Router();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  await app.listen(3000);

  const server = app.getHttpServer();
  const appRouter = server._events.request._router;
  router.use('/v1/single-sign-on/', appRouter);
}

bootstrap();

export = router;
