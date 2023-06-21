import { Injectable, Scope, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { SignOptions } from 'jsonwebtoken';
import { IAuthInterface } from './auth.interface';
import { plainToClass } from 'class-transformer';
import { CryptoService } from 'src/providers/crypto.service';
import { PerfilService } from '../perfil/perfil.service';
import { Perfil } from '../perfil/perfil.entity';

@Injectable({ scope: Scope.DEFAULT })
export class AuthService {
	constructor(
		private readonly perfilService: PerfilService, public config: ConfigService,
		private readonly jwtService: JwtService,
		private readonly cryptoService: CryptoService,
	) {
	}

	async login(idOuCPFOuEmail: number | string, pass: string, passEncrypted = true): Promise<any> {

		const perfilObj: Perfil = await this.perfilService.find(idOuCPFOuEmail, 'loged');

		if (perfilObj) {

			if (passEncrypted && this.cryptoService.decrypt(perfilObj.senha) === pass) {
				return perfilObj
			} else if (!passEncrypted && perfilObj.senha === pass) {
				return perfilObj
			}

		}

		return null
	}

	async jwtSign(perfil: any, options?: any) {

		const payload = { id: perfil.id, senha: perfil.senha };

		return {
			access_token: this.jwtService.sign(payload, options),
		};

	}

	async userLoginData(perfil: Perfil, options?: SignOptions): Promise<IAuthInterface> {

		if (!perfil.ativo && !perfil.isMasterAdmin) {
			throw new BadRequestException('Usuário desativado.');
		}

		const data: any = {
			perfil
		}

		Object.assign(data, await this.jwtSign(perfil, options))

		const perfilLogin = new Perfil;

		perfilLogin.ultimoLogin = new Date();
		perfilLogin.id = data.perfil.id;

		this.perfilService.save(null, perfilLogin);

		return plainToClass(IAuthInterface, data)

	}

}


