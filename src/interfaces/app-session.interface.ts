import { Expose, Type } from "class-transformer";
import { Perfil } from "src/modules/perfil/perfil.entity";

class PerfilLoged extends Perfil {

	@Expose()
	senha: string

}
export class AppSession {

	@Expose()
	@Type(() => PerfilLoged)
	perfil: PerfilLoged

}