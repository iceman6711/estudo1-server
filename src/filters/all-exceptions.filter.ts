import { Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
// import {GqlArgumentsHost, GqlContextType} from '@nestjs/graphql';
import { HttpArgumentsHost, RpcArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { ConfigService } from 'src/modules/config/config.service';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {

	constructor(private config: ConfigService) {
		super()
	}

	catch(exception: unknown, host: ArgumentsHost) {
		const anyException = exception as any;

		const error = anyException.response || anyException // BadRequestException(err). || Error direto

		const messageSystem = error.message?.message || error.message || 'Erro desconhecido.'

		if (error.constructor.name === 'EntityNotFoundError') {

			error.messageCustom = 'Informação não encontrada. Ela pode ter sido excluída.'
		}

		if (error.code === 'ER_DUP_ENTRY') {

			error.messageCustom = 'Já existe um cadastro com ' + error.message.split('\'')[1] +
				'. Você deve utilizar outro.'
		}

		if (error.code === 'ER_NO_DEFAULT_FOR_FIELD' || error.code === 'ER_BAD_NULL_ERROR') {

			error.messageCustom = 'O campo ' + error.message.split('\'')[1].split('Id')[0] +
				' é obrigatório.'
		}

		// guardar log aqui

		let message = error.messageCustom || messageSystem

		delete error.messageCustom

		console.error('>>> ', anyException);
		console.error('>>> ', 'Erro amigável: ' + message);

		if (host.getType() === 'http') {

			const ctx: HttpArgumentsHost = host.switchToHttp();
			const response = ctx.getResponse();
			const request = ctx.getRequest();

			const status =
				exception instanceof HttpException
					? exception.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR;

			if (status === HttpStatus.UNAUTHORIZED) {

				message =  error.message !== 'Unauthorized' ?  error.message : 'Acesso não autorizado. Efetue login para continuar.'
			}

			const json = {
				...error,
				statusCode: status,
				timestamp: new Date().toISOString(),
				path: request.url,
				title: error.message?.title || error.title || 'Ops!',
				message,
				messageSystem,
			}

			if (this.config.get('NODE_ENV') === 'production') {
				delete json.query
				delete json.sql
				delete json.parameters
				delete json.sqlMessage
				delete json.sqlState
				delete json.name
				delete json.messageSystem
				delete json.code
				delete json.errno
				delete json.index
			}

			response.status(status).json(json);

		} else if (host.getType() === 'rpc') {

			const ctx: RpcArgumentsHost = host.switchToRpc();

			return exception;

		} // else if (host.getType<GqlContextType>() === 'graphql') {

		// const gqlHost = GqlArgumentsHost.create(host);

		// return exception;

		// }

	}

}
