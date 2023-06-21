import { Expose, Type } from 'class-transformer';
import { OutPerfilFromOneDTO } from '../perfil/dto/out-one-perfil.dto';

export class IAuthInterface {

	// @IsString()
	@Expose()
	readonly access_token: string;

	@Expose()
	@Type(() => OutPerfilFromOneDTO)
	readonly perfil: OutPerfilFromOneDTO;

}
