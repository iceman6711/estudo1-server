import { Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { QSListDTO } from 'src/dto/qs-list.dto';

import { PerfilTipo } from '../perfil.entity';

export class QSListPerfilDTO extends QSListDTO {

	@Expose()
	@IsOptional()
	@IsBoolean()
	ativo?: boolean

	@Expose()
	@IsOptional()
	@IsBoolean()
	colabOnly?: boolean

	@Expose()
	@IsEnum(PerfilTipo)
	perfilTipo: PerfilTipo

	@Expose()
	@IsOptional()
	documento?: string

}