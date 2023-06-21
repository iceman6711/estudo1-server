import {ConsoleLogger, Injectable} from '@nestjs/common';

@Injectable()
export class AppLoggerService extends ConsoleLogger {

    error(message: string, trace: string, context?: string) {

        super.error(message, trace, context);
    }

    log(message: string, context?: string) {

        super.log(message, context);
    }

    warn(message: string, context?: string) {

        super.warn(message, context);
    }

    debug(message: string, context?: string) {

        super.debug(message, context);
    }

    verbose(message: string, context?: string) {

        super.verbose(message, context);
    }

}
