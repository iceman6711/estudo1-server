require('elastic-apm-node').start({

  active: process.env.NODE_ENV === 'production',

  // Override service name from package.json
  // Allowed characters: a-z, A-Z, 0-9, -, _, and space
  // serviceName: '',

  // Use if APM Server requires a token
  // secretToken: '',

  // Set custom APM Server URL (default: http://localhost:8200)
//   serverUrl: 'http://srv-captain--apm-server:8200',
  transactionIgnoreUrls: ['/socket.io/*']
})

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLoggerService } from './providers/app-logger.service';
import bodyParser = require('body-parser');
import { NestExpressApplication } from '@nestjs/platform-express/interfaces/nest-express-application.interface';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

declare const module: any;

async function bootstrap() {
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useLogger(new AppLoggerService());

  app.enableCors()

  app.setBaseViewsDir(join(__dirname, 'templates'));
  app.setViewEngine('hbs'); // uso nos emails

  app.use(helmet());

  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

  // app.use(
  //     rateLimit({
  //         windowMs: 15 * 60 * 1000, // 15 minutes
  //         max: 1500, // limit each IP to 100 requests per windowMs
  //     }),
  // );

  // app.use(cookieParser());

  // app.use(compression());

  // const {httpAdapter} = app.get(HttpAdapterHost);
  // The useGlobalFilters() method does not set up filters for gateways or hybrid applications.
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // está inserido dentro o @Module (AppValidationPipe já faz o auto-transform) para os DTOs
  // dessa forma, os parâmetros do controlador que não usam DTO, são transformados também
  // segundo pipe de entrada para fazer a transformação
  // todo: tentar fazer isso no AppValidationPipe
  // app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
  .setTitle('Base Server')
  .setDescription('Swagger de exemplo')
  .setVersion('1.0')
  .addBearerAuth({
	type:'http',
	scheme: 'bearer',
	bearerFormat: 'JWT',
	in: 'header'
  },'access_token')
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000)

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

}
bootstrap();
