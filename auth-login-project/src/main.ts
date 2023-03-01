import { NestFactory } from '@nestjs/core';
import {
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      // All the configuration Here

      // And add this line
      exceptionFactory(errors: ValidationError[]) {
        return new UnprocessableEntityException(
          errors?.length
            ? errors.map((err) => ({
                property: err.property,
                message: Object.keys(err.constraints).map(
                  (key) => err.constraints[key],
                ),
              }))
            : errors,
        );
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
