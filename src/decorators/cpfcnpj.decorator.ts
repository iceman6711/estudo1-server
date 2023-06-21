import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { validaCNPJ, validaCPF } from '../utils/validators';

export function ValidaCPFCNPJ(fieldLogic?: { rule: 'cpf' | 'cnpj' | 'test', propertyTest?: string, cpfVal?: string, cnpjVal?: string },
	validationOptions?: ValidationOptions) {

	return (object: any, propertyName: string) => {

		if (!fieldLogic) {
			fieldLogic = { rule: null, propertyTest: null, cpfVal: null, cnpjVal: null };
		}

		fieldLogic.rule = fieldLogic.rule || 'test';
		fieldLogic.propertyTest = fieldLogic.propertyTest || 'tipoPessoa';
		fieldLogic.cpfVal = fieldLogic.cpfVal || 'PF';
		fieldLogic.cnpjVal = fieldLogic.cnpjVal || 'PJ';

		const constraints = fieldLogic.rule === 'test' ? [fieldLogic.propertyTest] : [];

		if (!validationOptions) {
			validationOptions = {};
		}

		validationOptions.message = validationOptions.message || ((fieldLogic.rule === 'test' ? 'Documento' : fieldLogic.rule.toUpperCase()) + ' inválido.');

		registerDecorator({
			name: 'validaCPFCNPJ',
			target: object.constructor,
			propertyName,
			constraints,
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {

					const [relatedPropertyName] = args.constraints;
					const relatedValue = (args.object as any)[relatedPropertyName];

					const rule = (fieldLogic.rule === 'test' && !relatedValue ? (value?.length > 14 ? 'cnpj' : 'cpf') : fieldLogic.rule)

					// console.log('fieldLogic', fieldLogic)
					// console.log('relatedValue', relatedValue)
					// console.log('args', args)
					// console.log('value', value)

					if (rule === 'cpf' || relatedValue === fieldLogic.cpfVal) {
						return validaCPF(false, value);
					} else if (rule === 'cnpj' || relatedValue === fieldLogic.cnpjVal) {
						return validaCNPJ(false, value);
					} else {
						return false;
					}

					// you can return a Promise<boolean> here as well, if you want to make async validation

				}
			}
		});

	};

}
