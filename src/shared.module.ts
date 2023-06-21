import { Module } from '@nestjs/common'
import { CryptoService } from 'src/providers/crypto.service'
import { MessageService } from 'src/providers/message.service'
import { ConfigModule } from './modules/config/config.module'
import { AppLoggerService } from './providers/app-logger.service'
import { MailService } from './providers/mail.service'

@Module({
	imports: [
		ConfigModule,
	],
	controllers: [],
	providers: [CryptoService, MessageService, MailService, AppLoggerService],
	exports: [CryptoService, MessageService, MailService, AppLoggerService, ConfigModule],
})
export class SharedModule { }
