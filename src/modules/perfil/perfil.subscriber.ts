import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { LoadEvent } from 'typeorm/subscriber/event/LoadEvent';

import { ConfigService } from '../config/config.service';
import { Perfil, PerfilTipo } from './perfil.entity';

@EventSubscriber()
export class PerfilSubscriber implements EntitySubscriberInterface<Perfil> {

	listenTo() {
		return Perfil;
	}

	async afterLoad(perfil: Perfil, event: LoadEvent<Perfil>) {

		const config: ConfigService = new ConfigService(`${process.env.NODE_ENV || 'development'}.env`)

		perfil.nomeCompleto = (perfil.tipo === PerfilTipo.EMPRESA) ? perfil.nome : perfil.nome + (perfil.sobrenome ? ' ' + perfil.sobrenome : '')

		if (perfil.fotoPerfil) {
			perfil.fotoPerfilUrl = config.get('SERVER_URL') + config.get('IMG_URL_PERFIL') + perfil.fotoPerfil
		} else {
			// perfil.fotoPerfilUrl = 'assets/images/imoveis/imovel-padrao.png'
		}

	}

	beforeInsert(event: InsertEvent<any>) {

		if (!event.entity) { // acontecendo nos filhos que vão para update juntos, vindo undefined
			return;
		}

		this.testChangingMaster(event)

	}

	beforeUpdate(event: UpdateEvent<any>) {

		if (!event.entity) {
			return;
		}

		this.testChangingMaster(event)

	}

	beforeRemove() {

		throw new Error('Não é permitido remover.');

	}

	private testChangingMaster(event: InsertEvent<any>)
	private testChangingMaster(event: UpdateEvent<any>)
	private testChangingMaster(event: InsertEvent<any> | UpdateEvent<any>) {


		event.entity.isMasterAdmin

	}

}
