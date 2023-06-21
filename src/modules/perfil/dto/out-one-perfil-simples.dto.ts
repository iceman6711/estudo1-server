import { Expose } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Perfil, PerfilTipo } from '../perfil.entity';



export class OutPerfilSimplesFromOneDTO {

	@Expose()
	id: number

	@Expose()
	nome: string;

	@Expose()
	nomeCompleto: string

	@Expose()
	tipo: PerfilTipo

	@Expose()
	documento: string

}

// @ApiTags('internal-api')
export class OutOnePerfilSimplesDTO {

	@IsNotEmpty()
	@Expose()
	perfil: OutPerfilSimplesFromOneDTO;

}
