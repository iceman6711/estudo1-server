import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Request, Response} from 'express';
import {AppLoggerService} from '../providers/app-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

	appLoggerService: AppLoggerService

	constructor() {

		this.appLoggerService = new AppLoggerService('LoggingInterceptor')

	}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        const request: Request = context.switchToHttp().getRequest();

        if (request) {
            this.appLoggerService.log('Request (' + request.method + '): ' + request.url + '', 'Logging Interceptor');
        } else {
            this.appLoggerService.log('Request (' + (context as any).contextType + ')', 'Logging Interceptor');
        }

        // console.dir(request, {depth: 8});

        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap(() => this.appLoggerService.log(`Response: ${Date.now() - now}ms`, 'Logging Interceptor')),
                // map(data => ({ data })), ex. alterar resposta
                catchError(err => {

                    const response: Response = context.switchToHttp().getResponse();

                    this.appLoggerService.error(`Response Error (${response.statusCode}): ${Date.now() - now}ms`, 'Logging Interceptor');
                    return throwError(err);
                }),
            );
    }

}
