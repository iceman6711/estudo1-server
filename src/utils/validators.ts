import {BadRequestException} from '@nestjs/common';

export function validaCPF(autoThrow, cpf) {

    if (!cpf) {
        return false;
    }

    cpf = cpf.replace('-', '').replace('.', '').replace('.', '');

    let numeros;
    let digitos;
    let soma;
    let i;
    let resultado;
    let digitosIguais;

    let result;

    digitosIguais = 1;

    if (cpf.length < 11) {
        if (autoThrow) {
            throw new BadRequestException('CPF inválido.');
        }
        return false;
    }

    for (i = 0; i < cpf.length - 1; i++) {
        if (cpf.charAt(i) !== cpf.charAt(i + 1)) {
            digitosIguais = 0;
            break;
        }
    }

    if (!digitosIguais) {

        numeros = cpf.substring(0, 9);
        digitos = cpf.substring(9);
        soma = 0;
        for (i = 10; i > 1; i--) {
            soma += numeros.charAt(10 - i) * i;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado.toString() !== digitos.charAt(0)) {
            if (autoThrow) {
                throw new BadRequestException('CPF inválido.');
            }
            return false;
        }
        numeros = cpf.substring(0, 10);
        soma = 0;
        for (i = 11; i > 1; i--) {
            soma += numeros.charAt(11 - i) * i;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        result = resultado.toString() === digitos.charAt(1);

    } else {

        result = false;
    }

    if (autoThrow && !result) {
        throw new BadRequestException('CPF inválido.');
    }

    return result;

}

export function validaCNPJ(autoThrow, cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj === '') {
        if (autoThrow) {
            throw new BadRequestException('CNPJ inválido.');
        }
        return false;
    }

    if (cnpj.length !== 14) {
        if (autoThrow) {
            throw new BadRequestException('CNPJ inválido.');
        }
        return false;
    }

    // Elimina CNPJs invalidos conhecidos
    if (cnpj === '00000000000000' ||
        cnpj === '11111111111111' ||
        cnpj === '22222222222222' ||
        cnpj === '33333333333333' ||
        cnpj === '44444444444444' ||
        cnpj === '55555555555555' ||
        cnpj === '66666666666666' ||
        cnpj === '77777777777777' ||
        cnpj === '88888888888888' ||
        cnpj === '99999999999999') {

        if (autoThrow) {
            throw new BadRequestException('CNPJ inválido.');
        }

        return false;
    }

    // Valida DVs
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) {
            pos = 9;
        }
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado+'' !== digitos.charAt(0)) {
        if (autoThrow) {
            throw new BadRequestException('CNPJ inválido.');
        }
        return false;
    }

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) {
            pos = 9;
        }
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado+'' !== digitos.charAt(1)) {

        if (autoThrow) {
            throw new BadRequestException('CNPJ inválido.');
        }

        return false;
    }

    return true;

}

export function validaEmail(autoThrow, email) {
    
    let result;

    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
    result = re.test(String(email).toLowerCase());

    if (autoThrow && !result) {
        throw new BadRequestException('Email inválido.');
    }
    
    return result;
    
}

export function validaCEP(autoThrow, cep)  {

    let result;

    // Caso o CEP não esteja nesse formato ele é inválido!
    const objER = /^[0-9]{5}-[0-9]{3}$/;

    if (cep.length === 0) {

        result = false;
    } else {
        result = objER.test(cep);
    }

    if (autoThrow && !result) {
        throw new BadRequestException('CEP inválido.');
    }

    return result;

}
