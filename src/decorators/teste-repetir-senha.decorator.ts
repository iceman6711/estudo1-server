import {registerDecorator, ValidationOptions, ValidationArguments} from 'class-validator';

export function TesteRepetirSenha(fieldRepeat = 'repetirSenha', validationOptions: ValidationOptions = {}) {

    return (object: any, propertyName: string) => {
        

        const constraints = [fieldRepeat]
        
        validationOptions.message = validationOptions.message || 'Senha e repetição diferentes.';
        
        registerDecorator({
            name: 'testeRepetirSenha',
            target: object.constructor,
            propertyName,
            constraints,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {

                    const [relatedPropertyName] = args.constraints
                    const relatedValue = args.object[relatedPropertyName]

                    // console.log(value)

                    if (value && relatedValue !== value) {
                        return false
                    }

                    return true

                }
            }
        });

    };

}
