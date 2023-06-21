import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Perfil } from '../perfil.entity';


export class OutPerfilFromOneDTO extends Perfil {

	@Exclude()
	senha: string

	@Exclude()
	repetirSenha: string

}

// @ApiTags('internal-api')
export class OutOnePerfilDTO {

	@IsNotEmpty()
	@Expose()
	perfil: OutPerfilFromOneDTO;

}
