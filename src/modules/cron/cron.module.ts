import { SharedModule } from './../../shared.module';
import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ConfigModule } from '../config/config.module';
// import { EventosLogsModule } from '../eventos-logs/eventos-logs.module';
import { SocketModule } from '../socket/socket.module';

@Module({
	imports: [ConfigModule, SocketModule, SharedModule],
	controllers: [],
	providers: [CronService],
	exports: [],
})

export class CronModule { }