import {
    Injectable, NestInterceptor, ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import {Observable} from 'rxjs';
import { map} from 'rxjs/operators';

@Injectable()
export class AppTransformInterceptor<T> implements NestInterceptor<Partial<T>, T> {

    constructor(private readonly reflector: Reflector) {

    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		
		const roles = this.reflector.getAllAndOverride<string[]>('out-app-roles', [
			context.getHandler(),
			context.getClass(),
		])
        
        return next.handle().pipe(map(async data => {
			
            const object = plainToInstance(data.constructor, data, {
                strategy: this.testRole(roles, 'no-exclude-all') ? null : 'excludeAll',
                enableImplicitConversion: true,
            })

            // const errors = await validate(object);

            // se haver alterações nas regras do banco, alguns registros podem se tornar inválidos com o tempo
            // usar esse interceptor apenas para trabalhar o Expose / Exclude e a enableImplicitConversion
            // if (errors.length > 0) {

            //     const erros: any[] = [];
            //     errors.forEach(e => {

            //         let errorTxt = Object.values(e.constraints || e.children[0].constraints || e.children[0].children[0].constraints)[0];

            //         errorTxt = errorTxt.replace('must', 'deve');
            //         errorTxt = errorTxt.replace(' be ', ' ser ');
            //         errorTxt = errorTxt.replace(' a ', ' um ');
            //         errorTxt = errorTxt.replace(' an ', ' um ');
            //         errorTxt = errorTxt.replace(' or ', ' ou ');
            //         errorTxt = errorTxt.replace('number', 'número');
            //         errorTxt = errorTxt.replace('empty', 'vazio');
            //         errorTxt = errorTxt.replace('should not', 'não pode');
            //         errorTxt = errorTxt.replace('integer', 'inteiro');
            //         errorTxt = errorTxt.replace('instance', 'instância');
            //         errorTxt = errorTxt.replace('valid', 'válido');
            //         errorTxt = errorTxt.replace('is not', 'não é');
            //         errorTxt = errorTxt.replace('longer than', 'maior que');
            //         errorTxt = errorTxt.replace(' conforming to the specified constraints', '');
            //         errorTxt = errorTxt.replace(' not ', ' não ');
            //         errorTxt = errorTxt.replace(' greater ', ' maior ');
            //         errorTxt = errorTxt.replace(' less ', ' menor ');
            //         errorTxt = errorTxt.replace(' than ', ' que ');
            //         errorTxt = errorTxt.replace(' equal to ', ' igual a ');
            //         errorTxt = errorTxt.replace('characters', 'caracteres');

            //         let push: string = errorTxt.substr(0, 1).toUpperCase() + errorTxt.substr(1) + '';

            //         if (push.substr(-1, 1) !== '.') {
            //             push = push + '.';
            //         }

            //         erros.push(push);

            //     });

            //     throw new InternalServerErrorException(erros, 'Falha na validação: ' + data.constructor);
            // }

            return object

        }));

    }

    testRole(roles: string[], role: string): boolean {
        return !!roles?.includes(role)
    }

}
