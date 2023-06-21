import {BadRequestException, Injectable} from '@nestjs/common';
import {MailerService} from '@nestjs-modules/mailer';
import { ConfigService } from 'src/modules/config/config.service';

@Injectable()
export class MailService {

    constructor(
        private readonly config: ConfigService, private readonly mailerService: MailerService) {

    }

    sendTemplate(template: 'avisoTravado' | 'avisoBuy' | 'avisoSell', symbols?: string[]) {

        const mailData = this.config.getMailDefaultData()

        if (template === 'avisoTravado') {

            mailData.body = {
                title: 'botActions Travado',
                subtitle: 'Atenção', 
                message: `
                <div style="text-align: center;">
                    A rotina botActions está sem operar por mais de 120 segundos.
                </div>
                ` 
            }

            const link = 'https://captain.caprover.spartans.dev.br/#/apps/details/base-server'

            mailData.button = {text: 'Acessar CapRover', link};

            this.sendMail('Base  Server', mailData, 'mail-padrao', 
            ['thiago@spartans.dev.br'])
                .catch((err) => {
					throw new BadRequestException(err)
				})

        }

    }

    sendMail(subject: string, dataOrHtml: string | any, template = 'mail-padrao', to?: string | string[]): Promise<any> {

        const options: any = {
            subject
        };

        if (to) {
            options.to = to;
        }

        if (typeof dataOrHtml === 'string') {

            options.html = dataOrHtml;

        } else {

            options.template = template;
            options.context = dataOrHtml;
        }

        return this.mailerService.sendMail(options);

    }

}
