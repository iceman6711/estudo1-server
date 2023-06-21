import {registerDecorator, ValidationOptions, ValidationArguments} from 'class-validator';
import {validaCEP} from '../utils/validators';

export function ValidaCEP(validationOptions?: ValidationOptions) {

    return (object: object, propertyName: string) => {

        if (!validationOptions) {
            validationOptions = {};
        }

        validationOptions.message = 'CEP inválido.';

        registerDecorator({
            name: 'validaCEP',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {

                    if (!value) {
                        return true;
                    }

                    return validaCEP(false, value);

                }
            }
        });

    };

}
