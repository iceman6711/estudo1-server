import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AppSession } from 'src/interfaces/app-session.interface'

export const Session = createParamDecorator((data: unknown, context: ExecutionContext) => {

	if (context.getType() === 'http') {

		const session: AppSession = {
			perfil: context.switchToHttp().getRequest().user,
		}

		return session

	} else if (context.getType() === 'rpc') {

		// return context.switchToRpc().getRequest().user

	} // else if (context.getType<GqlContextType>() === 'graphql') {

	// const ctx = GqlExecutionContext.create(context)
	// return ctx.getContext().req.user

	// }

})
