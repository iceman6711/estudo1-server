import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ConfigService } from '../config/config.service'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) implements OnModuleInit {

	private authService: AuthService

	constructor(private moduleRef: ModuleRef, public config: ConfigService) {

		// private readonly authService: AuthService,

		super()

	}

	async onModuleInit() {

		// feito assim para evitar Error: Unknown authentication strategy "jwt"
		// depois que passou o inject scope desse provider para REQUEST, deve ser pq ele não reconhece esse scope do JWT como REQUEST
		this.authService = await this.moduleRef.resolve(AuthService)

	}

	async validate(username: string, password: string): Promise<any> {

		const user = await this.authService.login(username, password)

		if (!user) {
			throw new UnauthorizedException({ message: 'Dados de acesso inválidos.' })
		}

		return user
	}
}
