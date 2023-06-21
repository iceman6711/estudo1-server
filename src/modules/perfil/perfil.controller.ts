import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { BaseController } from 'src/abstracts/base-controller.abstract';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Session } from 'src/decorators/session.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { AppSession } from 'src/interfaces/app-session.interface';
import { CryptoService } from 'src/providers/crypto.service';

import { ConfigService } from '../config/config.service';
import { InCreatePerfilDTO } from './dto/in-create-perfil.dto';
import { InUpdatePerfilDTO } from './dto/in-update-perfil.dto';
import { OutListPerfilDTO } from './dto/out-list-perfil.dto';
import { OutOnePerfilSimplesDTO } from './dto/out-one-perfil-simples.dto';
import { OutOnePerfilDTO } from './dto/out-one-perfil.dto';
import { QSListPerfilDTO } from './dto/qs-list-perfil.dto';
import { MASTER_ADMIN, Perfil } from './perfil.entity';
import { PerfilService } from './perfil.service';

@Controller('perfil')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PerfilController extends BaseController {

	constructor(private readonly perfilService: PerfilService, private readonly config: ConfigService, private cryptoService: CryptoService) {

		super()

	}

	@Get('simples')
	@Public()
	async getOne(@Query('filters') filters: QSListPerfilDTO, @Session() session: AppSession): Promise<OutOnePerfilSimplesDTO> {

		const perfil = await this.perfilService.find(filters.documento)

		return plainToClass(OutOnePerfilSimplesDTO, { perfil })

	}

	@Get()
	@Roles(MASTER_ADMIN)
	async getMany(@Query('filters') filters: QSListPerfilDTO, @Session() session: AppSession): Promise<OutListPerfilDTO> {

		// await new Promise(a => setTimeout(() => a(true), 1000))

		const perfis = await this.perfilService.getMany(filters)
		const perfisTotal = await this.perfilService.getTotal(filters)

		return plainToClass(OutListPerfilDTO, { perfis, perfisTotal })

	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@Roles(MASTER_ADMIN)
	create(@Body() perfilData: InCreatePerfilDTO, @Session() session: AppSession): Promise<OutOnePerfilDTO> {

		return this.save(session, perfilData)

	}

	@Put(':id')
	@Roles(MASTER_ADMIN)
	update(@Body() perfilData: InUpdatePerfilDTO, @Param('id') id: number, @Session() session: AppSession): Promise<OutOnePerfilDTO> {
		return this.save(session, perfilData, id)

	}

	async save(session: AppSession, perfilData: InCreatePerfilDTO)
	async save(session: AppSession, perfilData: InUpdatePerfilDTO, id: number)
	async save(session: AppSession, perfilData: InCreatePerfilDTO | InUpdatePerfilDTO, id: number = null): Promise<OutOnePerfilDTO> {

		if (perfilData instanceof InUpdatePerfilDTO) {

			if (perfilData.perfil.id !== session.perfil.id && !session.perfil.isMasterAdmin) {
				throw new BadRequestException('Você não tem permissão para editar outro usuário.')
			}

			if (perfilData.perfil.senha) {

				if (!session.perfil.isMasterAdmin && perfilData.perfil.atualSenha && perfilData.perfil.atualSenha !== this.cryptoService.decrypt(session.perfil.senha)) {
					throw new BadRequestException('Senha atual incorreta.')
				}

			} else {
				delete perfilData.perfil.senha
			}

		}

		let perfil: Perfil = plainToClass(Perfil, perfilData.perfil)

		if (!session?.perfil?.isMasterAdmin) {
			delete perfil.isMasterAdmin
			// delete perfil.ativo --> Porque tinha essa trava? novo cadastro não estava funcionando
		}

		perfil = await this.perfilService.save(null, perfil)

		return plainToClass(OutOnePerfilDTO, { perfil })

	}

	@Delete('bulk/:ids')
	@Roles(MASTER_ADMIN)
	async delete(@Param('ids') ids: string, @Session() session: AppSession): Promise<any> { // poderia criar um tipo de resposta genérica para delete solo e bulk

		const idsArr = ids.split(',').map(id => parseInt(id))

		const result = await this.perfilService.delete(null, idsArr)
			.catch(err => {
				throw new BadRequestException({ ...err, messageCustom: 'Erro tentando excluir.' })
			})

		return {}

	}

	// @Delete('disable/:id')
	// @Roles('master-admin')
	// async desativaPerfil(@Param('id') id: number, @Session() session: AppSession): Promise<any> { // poderia criar um tipo de resposta genérica para delete solo e bulk

	// 	if (!(id === session.perfil.id) && !session.perfil.isMasterAdmin) {
	// 		throw new BadRequestException('Usuário inválido')
	// 	}

	// 	const perfil: Perfil = await this.perfilService.find(id);

	// 	perfil.ativo = false;

	// 	this.perfilService.save(perfil).catch(err => {
	// 		throw new BadRequestException('Erro ao desativar Usuário!', err);
	// 	})

	// 	return {}

	// }



}
