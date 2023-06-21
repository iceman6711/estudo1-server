import {
    Injectable, NestInterceptor, ExecutionContext,
    CallHandler, InternalServerErrorException,
} from '@nestjs/common';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        return next
            .handle()
            .pipe(tap(data => {
                    if (data === undefined) {
                        throw new InternalServerErrorException('O servidor não está respondendo!');
                    }
                }),
                catchError(err => {
                    return throwError(err);
                }),
            );

    }

}
