import {Injectable} from '@nestjs/common';
import {ConfigService} from '../modules/config/config.service';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {

    constructor(private readonly config: ConfigService) {


    }


    encrypt(text: string): string {

        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.config.get('CRIPTO_KEY')), iv);
        let encrypted = cipher.update(text);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return iv.toString('hex') + ':' + encrypted.toString('hex');

    }

    decrypt(text: string): string {

        if (!text) {
            return ''
        }

        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');

        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.config.get('CRIPTO_KEY')), iv);
		
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();

    }

}
