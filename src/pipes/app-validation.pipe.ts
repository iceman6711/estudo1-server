import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform,
	ValidationError,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AppValidationPipe implements PipeTransform<any> {

	async transform(value, metadata: ArgumentMetadata) {

		const { metatype, type } = metadata;

		// string, any
		if (!metatype || metatype === Object || value === undefined) { // Perfil = @User()
			return value
		}

		if (metatype === Boolean) {
			return (value === 'true' || value === true || value === 1 || value === '1') ? true : false
		}

		if (typeof value === 'string' && value[0] === '{' && value[value.length - 1] === '}' && metatype !== String) {

			let okJSON: boolean
			try {
				okJSON = !!JSON.parse(value)
			} catch {
				okJSON = false
			}

			if (okJSON) {
				value = JSON.parse(value)
			} else {
				throw new BadRequestException('String JSON com problemas.', 'Falha na validação: ' + metatype)
			}

		}

		const object: any = plainToInstance(metatype, value, {
			strategy: 'excludeAll', // facilitar os dados do DTO, não precisaria colocar todos
			enableImplicitConversion: true, // tenta converter o valor para o type que está na classe bem como o valor default
		})

		if (typeof object !== 'object') {
			return object
		}

		const errors = await validate(object);

		const allErrors = this.getAllErrors(errors)

		if (allErrors.length > 0) {

			const erros: any[] = [];

			allErrors.forEach(error => {

				// let errorTxt = Object.values(te.constraints || te.children[0].constraints || te.children[0].children[0].constraints)[0];

				const errorProperty = error.property;
				let errorTxts = Object.values(error.constraints);

				errorTxts.forEach(errorTxt => {

					const splitLetters = errorTxt.split('')
					const lettersParsed: string[] = []
					
					splitLetters.forEach((letter, idx) => {

						if (!idx) {
							lettersParsed.push(letter)
							return
						}

						const isMinusculaPrev = splitLetters[idx - 1].charCodeAt(0) >= 'a'.charCodeAt(0) && splitLetters[idx - 1].charCodeAt(0) <= 'z'.charCodeAt(0)
						// const isMinusculaCurr = letter.charCodeAt(0) >= 'a'.charCodeAt(0) && letter.charCodeAt(0) <= 'z'.charCodeAt(0)

						// const isMaiusculaPrev = splitLetters[idx - 1].charCodeAt(0) >= 'A'.charCodeAt(0) && splitLetters[idx - 1].charCodeAt(0) <= 'Z'.charCodeAt(0)
						const isMaiusculaCurr = letter.charCodeAt(0) >= 'A'.charCodeAt(0) && letter.charCodeAt(0) <= 'Z'.charCodeAt(0)

						if (isMinusculaPrev && isMaiusculaCurr) {
							lettersParsed.push(' ')
						}

						lettersParsed.push(letter)

					})

					errorTxt = lettersParsed.join('')

					errorTxt = errorTxt.replace('Id ', ' ')

					errorTxt = errorTxt.replace('must', 'deve');
					errorTxt = errorTxt.replace(' be ', ' ser ');
					errorTxt = errorTxt.replace(' a ', ' um ');
					errorTxt = errorTxt.replace(' an ', ' um ');
					errorTxt = errorTxt.replace(' or ', ' ou ');
					errorTxt = errorTxt.replace(' shorter ', ' menor ');
					errorTxt = errorTxt.replace(' value', ' valor');
					errorTxt = errorTxt.replace('number', 'número');
					errorTxt = errorTxt.replace('empty', 'vazio');
					errorTxt = errorTxt.replace('should not', 'não pode');
					errorTxt = errorTxt.replace('integer', 'inteiro');
					errorTxt = errorTxt.replace('instance', 'instância');
					errorTxt = errorTxt.replace('valid ', 'válido ');
					errorTxt = errorTxt.replace('is not', 'não é');
					errorTxt = errorTxt.replace('longer than', 'maior que');
					errorTxt = errorTxt.replace(' conforming to the specified constraints', '');
					errorTxt = errorTxt.replace(' not ', ' não ');
					errorTxt = errorTxt.replace(' greater ', ' maior ');
					errorTxt = errorTxt.replace(' less ', ' menor ');
					errorTxt = errorTxt.replace(' than ', ' que ');
					errorTxt = errorTxt.replace(' equal to ', ' igual a ');
					errorTxt = errorTxt.replace('characters', 'caracteres');

					let push: string = errorTxt.substr(0, 1).toUpperCase() + errorTxt.substr(1) + '';

					if (push.substr(-1, 1) !== '.') {
						push = push + '.';
					}

					// erros.push(push);
					erros.push({ property: errorProperty, text: push });

				})
			});

			throw new BadRequestException(erros, 'Falha na validação: ' + metatype);
			// throw new BadRequestException(erros, 'Falha na validação!'); // jeito certo?
		}

		return object; // value
	}

	private getAllErrors(errors: ValidationError[]): ValidationError[] {

		if (!errors) {
			return []
		}

		return [...errors.filter(error => error.constraints), ...errors.reduce((prev, error) => [...prev, ...this.getAllErrors(error.children)], [])]

	}

	private toValidate(metatype): boolean {

		// const types: (() => void)[] = [String, Boolean, Number, Array, Object];
		const types = [String, Boolean, Number, Array, Object];
		return types.includes(metatype); // || type === 'custom';

	}

}
