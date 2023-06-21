import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class ConfigService {

	private readonly envConfig: { [key: string]: string };

	constructor(filePath: string) {

		this.envConfig = dotenv.parse(fs.readFileSync(filePath));

		// console.log('ConfigService_________________')

	}

	private envPriorityOrigin(key: string, orDefault: any) {

		const env = process.env[key] !== undefined ? process.env[key] : this.envConfig[key];

		if (env === undefined) {
			if (orDefault !== undefined) {
				return orDefault
			}
			throw new Error('Variável de ambiente "' + key + '" inexistente.');
		}

		return env;

	}

	get(key: string, orDefault?: any): string {

		return this.envPriorityOrigin(key, orDefault);
	}

	getAsNumber(key: string, orDefault?: any): number {
		return parseInt(this.envPriorityOrigin(key, orDefault), 10);
	}

	getAsFloat(key: string, orDefault?: any): number {
		return parseFloat(this.envPriorityOrigin(key, orDefault));
	}

	getAsBoolean(key: string, orDefault?: any): boolean {
		return (this.envPriorityOrigin(key, orDefault) === 'true' ? true : (this.envPriorityOrigin(key, orDefault) === 'false' ? false : !!this.envPriorityOrigin(key, orDefault)));
	}

	getAsObject(key: string, orDefault?: any): boolean {
		return JSON.parse(this.envPriorityOrigin(key, orDefault));
	}

	getMailDefaultData(): any {

		return {
			baseUrl: this.get('CLIENT_URL') + this.get('CLIENT_ASSETS_URL'),
			// baseUrl: 'http://localhost:3000/',
			footer: {
				mail: this.get('MAIL_REPLY')
			}
		} as any;

	}

}
