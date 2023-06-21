import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { OutAppValidation } from 'src/decorators/out-app-validation.decorator';
import { Session } from 'src/decorators/session.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { AppSession } from 'src/interfaces/app-session.interface';
import { JSONParsePipe } from 'src/pipes/json-parse.pipe';

import { ConfigService } from '../config/config.service';
import { PerfilTipo, PerfilTipoStr } from '../perfil/perfil.entity';
import { PerfilService } from '../perfil/perfil.service';

@Controller('misc')
export class MiscController {

	constructor(private config: ConfigService, private readonly perfilService: PerfilService) {

	}

	@Get('start')
	@OutAppValidation('no-exclude-all')
	async start(@Query('environment') environment: string) {

		// throw new BadRequestException('Errooooo')
		// await new Promise(r => setTimeout(() => r(null), 3000))

		const environmentReturn = {
			environment: {
				configs: {
					FOTO_MAX_WIDTH: 400,
					FOTO_MAX_HEIGHT: 400,
				},
				enums: {
					PerfilTipo: PerfilTipo,
					PerfilTipoStr: PerfilTipoStr,
				},
				data: {
					estados: [
						{ sigla: 'AC', nome: 'Acre' },
						{ sigla: 'AL', nome: 'Alagoas' },
						{ sigla: 'AP', nome: 'Amapá' },
						{ sigla: 'AM', nome: 'Amazonas' },
						{ sigla: 'BA', nome: 'Bahia' },
						{ sigla: 'CE', nome: 'Ceará' },
						{ sigla: 'DF', nome: 'Distrito Federal' },
						{ sigla: 'ES', nome: 'Espírito Santo' },
						{ sigla: 'GO', nome: 'Goiás' },
						{ sigla: 'MA', nome: 'Maranhão' },
						{ sigla: 'MT', nome: 'Mato Grosso' },
						{ sigla: 'MS', nome: 'Mato Grosso do Sul' },
						{ sigla: 'MG', nome: 'Minas Gerais' },
						{ sigla: 'PA', nome: 'Pará' },
						{ sigla: 'PB', nome: 'Paraíba' },
						{ sigla: 'PR', nome: 'Paraná' },
						{ sigla: 'PE', nome: 'Pernambuco' },
						{ sigla: 'PI', nome: 'Piauí' },
						{ sigla: 'RJ', nome: 'Rio de Janeiro' },
						{ sigla: 'RN', nome: 'Rio Grande do Norte' },
						{ sigla: 'RS', nome: 'Rio Grande do Sul' },
						{ sigla: 'RO', nome: 'Rondônia' },
						{ sigla: 'RR', nome: 'Roraima' },
						{ sigla: 'SC', nome: 'Santa Catarina' },
						{ sigla: 'SP', nome: 'São Paulo' },
						{ sigla: 'SE', nome: 'Sergipe' },
						{ sigla: 'TO', nome: 'Tocantins' }
					]
				}
			},
		}

		return environmentReturn

	}

	@Get('getSelectDatas')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@OutAppValidation('no-exclude-all')
	async getSelectDatas(@Query('filters', JSONParsePipe) filters: any, @Session() session: AppSession): Promise<any> {

		let perfilId: any = filters.perfilId && await this.perfilService.find(filters.perfilId)
		let usuarioId: any = filters.usuarioId && await this.perfilService.find(filters.usuarioId)
		let empresaId: any = filters.empresaId && await this.perfilService.find(filters.empresaId)

		!perfilId || (perfilId = { id: perfilId.id, text: perfilId.nomeCompleto })
		!usuarioId || (usuarioId = { id: usuarioId.id, text: usuarioId.nomeCompleto })
		!empresaId || (empresaId = { id: empresaId.id, text: empresaId.nomeCompleto })

		return {
			perfilId,
			usuarioId,
			empresaId,
		}

	}

}
