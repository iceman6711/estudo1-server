import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class JSONParsePipe implements PipeTransform<string, number> {

  transform(value: string, metadata: ArgumentMetadata): any {

    if (!value || value === 'undefined' || value === 'null') {
      return {}
    }

    const jsonParsed = JSON.parse(value)

    if (!jsonParsed) {
      throw new BadRequestException('Falha ao abrir JSON.');
    }

    return jsonParsed;
  }

}