
import { SetMetadata } from '@nestjs/common';

export const OutAppValidation = (...roles: string[]) => SetMetadata('out-app-roles', roles);
