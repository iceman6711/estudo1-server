import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function NullIfEmpty(validationOptions?: ValidationOptions) {

    return (object: any, propertyName: string) => {

        if (!validationOptions) {
            validationOptions = {};
        }

        registerDecorator({
            name: 'nullIfEmpty',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {

					object[propertyName] = value

                    if (value === '') {
                        object[propertyName] = null
                    }

                    return true

                }
            }
        });

    };

}
