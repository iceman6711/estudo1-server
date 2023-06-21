import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared.module';

import { ConfigModule } from '../config/config.module';
import { PerfilModule } from '../perfil/perfil.module';
import { SocketModule } from '../socket/socket.module';
import { GatewayService } from './gateway.service';

@Module({
	imports: [
		SharedModule,
		ConfigModule,
		HttpModule,
		SocketModule,
		PerfilModule,
	],
	controllers: [],
	providers: [GatewayService],
	exports: [GatewayService]
})
export class GatewayModule { }
