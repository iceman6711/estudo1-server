import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { ConfigService } from '../modules/config/config.service';
import { Perfil } from '../modules/perfil/perfil.entity';

// automatiza as roles
@Injectable()
export class RolesGuard implements CanActivate {

	constructor(private readonly reflector: Reflector, public config: ConfigService) {

	}

	canActivate(context: ExecutionContext): boolean {

		const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		// console.log('roles', roles)

		// let roles = this.reflector.get<string[]>('roles', context.getHandler());

		// console.log('rolesHandler', roles)

		if (!roles) {
			return true;
			// roles = this.reflector.get<string[]>('roles', context.getClass());
			// console.log('rolesClass', roles)
			// if (!roles) {
			//     return true;
			// }
		}

		// return true

		let user: Perfil

		if (context.getType() === 'http') {

			user = context.switchToHttp().getRequest().user

		} else if (context.getType() === 'rpc') {

			// return context.switchToRpc().getRequest().user;

		}

		// else if (context.getType<GqlContextType>() === 'graphql') {

		//     const ctx = GqlExecutionContext.create(context);
		//     user = ctx.getContext().req.user;

		// }

		if (user?.isMasterAdmin) {
			return true
		}

		// não precisa
		// if (roles[0] === 'master-admin' && user?.isMasterAdmin) { // verificar usuário logado se é um dos masters
		// 	return true;
		// }

		// if (roles.includes('admin') && empresaPerfil?.cargo === EmpresaPerfilCargo.ADMIN) return true

		// if (roles.some(role => empresaPerfil.cargo === EmpresaPerfilCargo[role.toUpperCase()])) return true

		throw new UnauthorizedException('Você não tem permissão para acessar este recurso. Cargos requeridos: [' + roles.join(', ').toUpperCase() + '].')

		// const hasRole = () => user.roles.some((role) => roles.includes(role)); // exemplo de campo array roles da entity perfil

		// return user && user.roles && hasRole();

	}

}
