import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Perfil } from '../perfil.entity';

export class OutPerfilFromListDTO extends Perfil {

	@Exclude()
	atualSenha: string

	@Exclude()
	@IsOptional()
	senha: string

	@Exclude()
	repetirSenha: string

}

export class OutPerfilTotalFromListDTO {

	@Expose()
	total: number

}

// @ApiTags('internal-api')
export class OutListPerfilDTO {

	@IsNotEmpty()
	@Expose()
	@Type(() => OutPerfilFromListDTO)
	@ValidateNested({ each: true })
	perfis: OutPerfilFromListDTO[];

	@IsNotEmpty()
	@Expose()
	@Type(() => OutPerfilTotalFromListDTO)
	perfisTotal: OutPerfilTotalFromListDTO

}
