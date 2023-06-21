import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import bodyParser = require('body-parser');
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { join } from 'path';

import { AppController } from './app.controller';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { AppTransformInterceptor } from './interceptors/app-validation.interceptor';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './modules/config/config.module';
import { ConfigService } from './modules/config/config.service';
import { CronModule } from './modules/cron/cron.module';
import { MiscModule } from './modules/misc/misc.module';
import { PerfilModule } from './modules/perfil/perfil.module';
import { SocketModule } from './modules/socket/socket.module';
import { AppValidationPipe } from './pipes/app-validation.pipe';
import { SharedModule } from './shared.module';

// import * as helmet from 'helmet';
@Module({
	imports: [

		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			name: 'default',
			useFactory: async (config: ConfigService) => ({
				name: 'default',
				type: config.get('TYPEORM_CONNECTION') as any,
				host: config.get('TYPEORM_HOST2', config.get('TYPEORM_HOST')),
				port: config.getAsNumber('TYPEORM_PORT'),
				username: config.get('TYPEORM_USERNAME'),
				password: config.get('TYPEORM_PASSWORD'),
				database: config.get('TYPEORM_DATABASE'),
				charset: config.get('TYPEORM_CHARSET'),
				synchronize: config.getAsBoolean('TYPEORM_SYNCHRONIZE'),
				migrationsRun: config.getAsBoolean('TYPEORM_MIGRATIONS_RUN'),
				cli: {
					migrationsDir: config.get('TYPEORM_MIGRATIONS_DIR'),
				},
				logging: config.getAsBoolean('TYPEORM_LOGGING'),
				timezone: config.get('TYPEORM_TIMEZONE'),
				extra: config.getAsObject('TYPEORM_DRIVER_EXTRA'),
				entities: [join(__dirname, '/modules/**/*.entity{.ts,.js}')],
				subscribers: [join(__dirname, '/modules/**/*.subscriber{.ts,.js}')],
				migrations: [join(__dirname, '/database/migrations/*{.ts,.js}')]
			}),
			inject: [ConfigService],
		}),
		TypeOrmModule.forFeature([]),

		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => {

				const transport = {
					pool: config.getAsBoolean('MAIL_POOL'),
					host: config.get('MAIL_HOST'),
					port: config.get('MAIL_PORT'),
					secure: config.getAsBoolean('MAIL_TLS'),
					auth: {
						user: config.get('MAIL_USER'),
						pass: config.get('MAIL_PASS'),
					},
					tls: {
						rejectUnauthorized: false, // NÃO USAR ASSIM
					},
				};

				return {
					transport,
					defaults: {
						from: '"' + config.get('APP_NAME') + '" <' + config.get('MAIL_FROM') + '>',
						replyTo: '"' + config.get('APP_NAME') + '" <' + config.get('MAIL_REPLY') + '>',
						to: config.get('MAIL_TO'),
					},
					template: {
						dir: __dirname + '/templates', // todo: definir como será o acesso a esse path, pois em prod fica o conteúdo do dist na raiz e em dev no src
						adapter: new HandlebarsAdapter(), // or new PugAdapter()
						options: {
							strict: true,
						},
					},
				};
			},
			inject: [ConfigService],
		}),

		ServeStaticModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService) => [{
				rootPath: configService.get('PUBLIC_PATH'),
				serveRoot: '/',
				cacheControl: true,
				maxAge: 1000 * 60 * 60 * 24 * 365,
				serveStaticOptions: {
					setHeaders: (res, path, stat) => {
						res.setHeader("Access-Control-Allow-Origin", "*")
						res.setHeader("Cross-Origin-Resource-Policy", "*")
					}
				},
			}]
		}),

		HttpModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				timeout: config.getAsNumber('HTTP_TIMEOUT'),
				maxRedirects: config.getAsNumber('HTTP_MAX_REDIRECTS'),
			}),
			inject: [ConfigService],
		}),

		ConfigModule,
		ScheduleModule.forRoot(),
		CronModule,
		SocketModule,
		MiscModule,
		AuthModule,
		PerfilModule,
		SharedModule,
	],
	controllers: [
		AppController,
	],
	providers: [
		// AppService,
		{
			provide: APP_PIPE, // usando aqui pois foi criada para ser genérica
			useClass: AppValidationPipe,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: AppTransformInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ErrorsInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
	],
})
export class AppModule {

	constructor() {
		// console.log(__dirname)
	}

	configure(consumer: MiddlewareConsumer) {

		consumer
			.apply(
				helmet(),
				bodyParser.json({ limit: '50mb' }),
				bodyParser.urlencoded({ limit: '50mb', extended: true }),
				rateLimit({
					windowMs: 15 * 60 * 1000, // 15 minutes
					max: 1500, // limit each IP to 100 requests per windowMs
				}),
				cookieParser(),
				compression(),
				// UsuarioAcessoMiddleware,
				// AssignContratoMiddleware,
			)
			.forRoutes('*')

	}

}
