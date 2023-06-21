import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { SocketService } from "../socket/socket.service";
import { MailService } from 'src/providers/mail.service';

@Injectable()
export class CronService {

	private readonly logger = new Logger(CronService.name);

	constructor(
		private config: ConfigService,
		private readonly socketService: SocketService,
		private readonly mailService: MailService,) {

	}

	// @Cron(CronExpression.EVERY_10_MINUTES)
	// async cronAssinatura() {

	// 	this.logger.debug('10 minutos - assinatura expira')

	// }

}