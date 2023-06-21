
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { Perfil } from '../perfil/perfil.entity';
import { ModuleRef } from '@nestjs/core';
import { AuthService } from './auth.service';
import { CryptoService } from 'src/providers/crypto.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

	constructor(private moduleRef: ModuleRef, public config: ConfigService, private readonly authService: AuthService, private cryptoService: CryptoService) {

		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.get('JWT_SECRET'),
		})

	}

	async validate(payload: any): Promise<Perfil> {

		const perfilObj = await this.authService.login(payload.id, this.cryptoService.decrypt(payload.senha))

		if (!perfilObj) {
			throw new UnauthorizedException({ message: 'Dados de acesso inválidos. Talvez a senha tenha sido alterada.' })
		}

		return perfilObj

	}

}
