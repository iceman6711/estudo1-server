import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {AuthGuard} from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {

	constructor(private reflector: Reflector) {
		
		super();

	}

	canActivate(context: ExecutionContext) {

		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
		  context.getHandler(),
		  context.getClass(),
		]);
		
		if (isPublic) {
		  return true;
		}

		return super.canActivate(context);

	}

    getRequest(context: ExecutionContext) {

        if (context.getType() === 'http') {

            return context.switchToHttp().getRequest();

        } else if (context.getType() === 'rpc') {

            // return context.switchToRpc().getRequest();

        } 
        // else if (context.getType<GqlContextType>() === 'graphql') {

        //     const ctx = GqlExecutionContext.create(context);
        //     return ctx.getContext().req;

        // }

    }

}
