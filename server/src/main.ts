import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SwaggerModule, DocumentBuilder} from '@nestjs/swagger';

async function main() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('AREA API')
    .setDescription('The AREA API description')
    .setVersion('1.0')
    .addTag('AREA')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(8080);
  
}
main();
