import { Exclude, Expose, Type } from 'class-transformer';
import { Length, ValidateIf, ValidateNested } from 'class-validator';

import { Perfil, PerfilTipo } from '../perfil.entity';

// @ApiTags('internal-api')
export class InCreatePerfilFromCreateDTO extends Perfil {

	@Exclude()
	id

	@Expose()
	@ValidateIf((perfil) => [PerfilTipo.USUARIO].includes(perfil.tipo))
	senha

	@Expose()
	@ValidateIf((perfil) => [PerfilTipo.USUARIO].includes(perfil.tipo))
	@Length(6, 20)
	repetirSenha

	@Expose()
	fotoPerfilUpload

	@Exclude()
	transacoes

	@Exclude()
	apostas

	@Exclude()
	indicacoes
}

export class InCreatePerfilDTO {

	@Expose()
	@Type(() => InCreatePerfilFromCreateDTO)
	@ValidateNested()
	perfil: InCreatePerfilFromCreateDTO

}