
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PerfilModule } from '../perfil/perfil.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';
import { Perfil } from '../perfil/perfil.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared.module';

@Module({
	imports: [
		SharedModule,
		PerfilModule,
		ConfigModule,
		TypeOrmModule.forFeature([Perfil]),
		PassportModule.register({}),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				secret: config.get('JWT_SECRET'),
				signOptions: { expiresIn: '30d' }
			}),
			inject: [ConfigService],
		}),
	],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy
	],
	exports: [
		AuthService
	],
	controllers: [
		AuthController
	],
})
export class AuthModule { }
