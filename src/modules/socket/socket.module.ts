import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from 'src/shared.module';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { PerfilModule } from '../perfil/perfil.module';
import { SocketService } from './socket.service';

@Module({
	imports: [
		SharedModule,
		forwardRef(() => PerfilModule),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				secret: config.get('JWT_SECRET'),
				signOptions: { expiresIn: '30d' }
			}),
			inject: [ConfigService],
		}),
	],
	providers: [SocketService],
	controllers: [],
	exports: [SocketService]
})
export class SocketModule { }