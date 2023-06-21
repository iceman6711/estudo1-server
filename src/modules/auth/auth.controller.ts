import { Controller, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import { OutAppValidation } from 'src/decorators/out-app-validation.decorator';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { MailService } from 'src/providers/mail.service';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { ConfigService } from '../config/config.service';
import { PerfilService } from '../perfil/perfil.service';
import { IAuthInterface } from './auth.interface';
import { AuthService } from './auth.service';

// import * as crypto from 'crypto';

@Controller('auth')
// @ApiTags('internal-api') 
export class AuthController {

	constructor(public authService: AuthService, public config: ConfigService, public perfilService: PerfilService,
		private readonly mailService: MailService) {

	}

	@UseGuards(LocalAuthGuard)
	@Get('login')
	login(@Request() req: any): Promise<IAuthInterface> {

		return this.authService.userLoginData(req.user)
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get('loged')
	async acessar(@Request() req: any): Promise<IAuthInterface> {

		const ret = this.authService.userLoginData(req.user);

		return ret
	}

	@Get('recuperar-senha')
	@OutAppValidation('no-exclude-all')
	recuperarSenha(@Request() req, @Param('paramRedeem') paramRedeem: any, @Query('cpf') cpf: string) {

		return new Promise(async (resolve, reject) => {

			if (paramRedeem) {

				return paramRedeem;
			}

			const perfil = await this.perfilService.find(cpf, 'loged');

			if (!perfil) {
				return reject({ message: 'Cadastro não localizado.' });
			}

			const loginData = await this.authService.userLoginData(perfil, { expiresIn: '1 days' });

			const redeem = loginData.access_token;

			const link = this.config.get('CLIENT_URL') + 'recuperar-senha/' + redeem;
			// const link = 'http://localhost:4200/recuperar-senha/' + redeem;

			const mailData = this.config.getMailDefaultData();

			mailData.body = {
				title: 'Prezado ' + perfil.nome + ',',
				subtitle: 'tudo bem?',
				message: 'Você solicitou a recuperação de conta. Acesse abaixo para continuar.'
			};

			mailData.button = { text: 'Recuperar Senha', link };

			this.mailService.sendMail('Recuperar Senha', mailData, 'mail-padrao', loginData.perfil.email)
				.then(() => {

					resolve({ title: 'E-mail enviado', message: 'Verifique instruções na sua caixa de entrada.' });

				}).catch((err) => {

					reject({ message: 'Erro ao enviar e-mail de recuperação de senha.', error: 'mailSendError', err });

				});

		});

	}

}
