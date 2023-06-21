import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared.module';

import { ConfigModule } from '../config/config.module';
import { PerfilModule } from '../perfil/perfil.module';
import { MiscController } from './misc.controller';
import { MiscService } from './misc.service';

@Module({
	imports: [
		SharedModule,
		ConfigModule,
		PerfilModule,
	],
	controllers: [MiscController],
	providers: [MiscService],
	exports: [MiscService]
})
export class MiscModule { }
