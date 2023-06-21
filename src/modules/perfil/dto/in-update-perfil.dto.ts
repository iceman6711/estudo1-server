import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional, Length, ValidateNested } from 'class-validator';
import { TesteRepetirSenha } from 'src/decorators/teste-repetir-senha.decorator';
import { Perfil } from '../perfil.entity';

// @ApiTags('internal-api')
export class InUpdatePerfilFromUpdateDTO extends Perfil {

	@Expose()
	@IsOptional()
	@Length(0, 20)
	@TesteRepetirSenha()
	senha

	@Expose()
	@IsOptional()
	@Length(0, 20)
	atualSenha

	@Expose()
	@IsOptional()
	@Length(0, 20)
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

export class InUpdatePerfilDTO {

	@Expose()
	@Type(() => InUpdatePerfilFromUpdateDTO)
	@ValidateNested()
	perfil: InUpdatePerfilFromUpdateDTO

}