import { HttpService } from '@nestjs/axios';
import { Injectable, Scope } from '@nestjs/common';
import pagarme from 'pagarme';
import { EntityManager } from 'typeorm/entity-manager/EntityManager';

import { ConfigService } from '../config/config.service';
import { PerfilService } from '../perfil/perfil.service';

@Injectable({ scope: Scope.DEFAULT })
export class GatewayService {

	private gateway: 'pagar.me' = 'pagar.me'
	private antiFraude = true

	constructor(private readonly config: ConfigService, private readonly httpService: HttpService,
		 private readonly perfilService: PerfilService) {


	}


	// Não usa - Valida apenas por 5 minutos
	async criarHashCartao_(numero: string, validade: string, cvv: string, nomeCompleto: string) {

		if (this.gateway === 'pagar.me') {

			const url = 'https://api.pagar.me/1/transactions/card_hash_key'

			let res: any = await this.httpService.get(url + '?api_key=' + this.config.get('PAGARME_API')).toPromise()
				.catch(err => {
					console.error(err.response.data.errors)
					throw new Error('Falha na criação do hash key na Pagar.me!')
				})

			console.log('res api', res)
			res = await pagarme.client.connect({ encryption_key: res.data?.public_key })
				.catch(err => {
					throw new Error('Falha na conexão com o Pagar.me!')
				})

			numero = numero.replace(/\./g, '').replace(/\ /g, '')
			validade = validade.replace('-', '').replace('/', '')

			// console.log('nomeCompleto:', nomeCompleto)
			// console.log('numero:', numero)
			// console.log('validade:', validade)
			// console.log('cvv:', cvv)

			res = await res.security.encrypt({
				card_number: numero,
				card_holder_name: nomeCompleto,
				card_expiration_date: validade,
				card_cvv: cvv
			})
				.catch(err => {
					throw new Error('Falha na criação do card hash na Pagar.me!')
				})

			return res

		}
	}

	async criarCartao(numero: string, validade: string, cvv: string, nomeCompleto: string) {

		if (this.gateway === 'pagar.me') {
			const url = 'https://api.pagar.me/1/cards'

			numero = numero.replace(/\./g, '').replace(/\ /g, '')
			validade = validade.replace('-', '').replace('/', '')

			if (validade.length === 6) validade = validade.substring(0, 2) + validade.substring(4, 6)

			const body = {
				api_key: this.config.get('PAGARME_API'),
				card_number: numero,
				card_expiration_date: validade, // MMAA - 4 Digitos
				card_cvv: cvv,
				card_holder_name: nomeCompleto,
			}

			//console.log('registrando cartão:', body)
			const result = await this.httpService.post(url, body).toPromise()
				.catch(err => {
					console.error(err.response.data.errors)
					throw new Error('Falha na criação do cartão de crédito na Pagar.me!')
				})

			//console.log(result.data)
			return result?.data

			/*
			{
				"object": "card",
				"id": "card_cj428xxsx01dt3f6dvre6belx",
				"date_created": "2017-06-18T05:03:19.907Z",
				"date_updated": "2017-06-18T05:03:20.318Z",
				"brand": "visa",
				"holder_name": "Aardvark Silva",
				"first_digits": "401872",
				"last_digits": "8048",
				"country": "RU",
				"fingerprint": "TaApkY+9emV9",
				"customer": null,
				"valid": true,
				"expiration_date": "1122"
			}
			*/

		}

	}

	async pagar(em: EntityManager, transacao: any, cartao: any) {
		console.log('pagar');
	}



}
