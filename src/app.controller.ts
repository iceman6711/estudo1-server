import { Controller, Get, UnauthorizedException } from '@nestjs/common';

@Controller()
export class AppController {

	@Get()
	rootGet() {

		throw new UnauthorizedException('Você não tem permissão para acessar.')

	}

}
