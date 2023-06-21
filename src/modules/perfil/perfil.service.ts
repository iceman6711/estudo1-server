import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PersistentService } from 'src/abstracts/persistent-service.abstract';
import { CryptoService } from 'src/providers/crypto.service';
import { deleteFile, writeFile } from 'src/utils/util';
import { validaEmail } from 'src/utils/validators';
import { DataSource, EntityManager, In, SelectQueryBuilder } from 'typeorm';
import uniqueFilename from 'unique-filename';

import { ConfigService } from '../config/config.service';
import { QSListPerfilDTO } from './dto/qs-list-perfil.dto';
import { Perfil } from './perfil.entity';

@Injectable()
export class PerfilService extends PersistentService {

	constructor(@InjectDataSource('default') public dataSource: DataSource, private readonly cryptoService: CryptoService,
		private readonly config: ConfigService) {

		super(dataSource)

	}

	getOne(): any { }

	async find(idOuDocumento: number | string, dataType: 'default' | 'loged' = 'default'): Promise<Perfil> {

		const qb = this.getRepository(Perfil).createQueryBuilder('usu')


		if (dataType === 'loged') {

			qb.addSelect('usu.senha')
			qb.addSelect('usu.dataCadastro')

			qb.orderBy({ 'usu.id': 'ASC' })

		}

		if (typeof idOuDocumento === 'number') {
			qb.andWhere('usu.id = :idOuDocumento', { idOuDocumento });

		}
		else {

			if (validaEmail(false, idOuDocumento)) {
				qb.andWhere('usu.email = :idOuDocumento', { idOuDocumento });
			}
			else {
				qb.andWhere('usu.documento = :idOuDocumento', { idOuDocumento });
			}
		}

		const rawAndEntities = await qb.getRawAndEntities()

		// rawAndEntities.entities.forEach(perfil => {
		// 	perfil.totalImoveis = +rawAndEntities.raw.find(raw => raw.usu_id === perfil.id).totalImoveis
		// })

		return rawAndEntities.entities[0]

	}

	async getMany(filters: QSListPerfilDTO): Promise<Perfil[]> {

		const qb = this.getRepository(Perfil).createQueryBuilder('usu')

		this.fetchWithChunk(qb, filters.pager)

		let orderBy: any = {}

		if (filters.order) {

			Object.entries(filters.order).forEach(ent => {

				if (ent[0] === 'nomeCompleto') {

					orderBy['usu.nome'] = ent[1]
					orderBy['usu.sobrenome'] = ent[1]

				} else {
					orderBy['usu.' + ent[0]] = ent[1]
				}

			})

		} else {
			orderBy['usu.nome'] = 'ASC'
			orderBy['usu.sobrenome'] = 'ASC'
		}

		qb.orderBy(orderBy)

		this.qbFilters(qb, filters)

		const rawAndEntities = await qb.getRawAndEntities()

		rawAndEntities.entities.forEach(perfil => {
			// perfil.totalImoveis = +rawAndEntities.raw.find(raw => raw.usu_id === perfil.id).totalImoveis
		})

		return rawAndEntities.entities

	}

	async getTotal(filters: QSListPerfilDTO): Promise<any> {

		const qb = await this.getRepository(Perfil).createQueryBuilder('usu')
		qb.distinct(true)
		qb.select('count(0) as total')

		this.qbFilters(qb, filters)


		return qb.getRawOne()
	}

	async getLast(): Promise<Perfil[]> {

		const qb = await this.getRepository(Perfil).createQueryBuilder('usu')

		qb.orderBy({ dataCadastro: 'DESC' })
		qb.limit(5)

		return qb.getMany()

	}

	async save(em: EntityManager, perfil: Perfil): Promise<Perfil> {

		const perfilRepository = this.getRepository(Perfil, em)

		if (perfil.senha) {
			// console.log(perfil.senha)
			perfil.senha = this.cryptoService.encrypt(perfil.senha)
			// console.log(perfil.senha)
		}

		// return

		if (perfil.fotoPerfilUpload?.substring(0, 15) === 'data:image/jpeg' || perfil.fotoPerfilUpload?.substring(0, 14) === 'data:image/png') {

			const ext = perfil.fotoPerfilUpload?.substring(0, 14) === 'data:image/png' ? 'png' : 'jpg'

			const filePath = uniqueFilename(this.config.get('IMG_PATH_PERFIL')) + '.' + ext;
			perfil.fotoPerfil = filePath.split('\\').pop().split('/').pop();

			const base64Data = perfil.fotoPerfilUpload.replace(/^data:image\/jpeg;base64,/, '');

			await writeFile(filePath, base64Data)
				.catch(async err => {
					throw err
				});

		}

		let perfilFind
		if (perfil.id) {
			perfilFind = await this.find(perfil.id)
		}

		const perfilSave = await perfilRepository.save(perfil)
			.catch(async err => {

				if (perfil.fotoPerfilUpload) {
					await deleteFile(this.config.get('IMG_PATH_PERFIL') + perfil.fotoPerfil)
						.catch(err => {
							// não fazer nada, para deixar rolar a ação
						})
				}

				throw err
			})

		if (perfilFind) {
			if (perfil.fotoPerfilUpload) {
				await deleteFile(this.config.get('IMG_PATH_PERFIL') + perfilFind.fotoPerfil)
					.catch(err => {
						// não fazer nada, para deixar rolar a ação
					})
			}
		}

		return perfilSave

	}

	delete(em: EntityManager, ids: number[]) {

		return this.getRepository(Perfil, em).softDelete({
			id: In(ids)
		}).catch(err => {
			throw err
		})

		// não apaga imagem por conta de ser soft delete

	}

	qbFilters(qb: SelectQueryBuilder<any>, filters: QSListPerfilDTO) {

		if (filters.id) {
			qb.andWhere('usu.id = :id', { id: filters.id })
		}

		if (filters.colabOnly) {
			qb.andWhere('usu.isMasterAdmin = 0')
		}

		if (filters.busca) {

			const splitTermos = filters.busca.split(' ')

			const buscaWhere = []

			splitTermos.forEach(termo => {
				if (termo.trim()) {
					termo = termo.trim().replace(/'/g, '')
					buscaWhere.push(' (usu.nome like \'%' + termo + '%\' or usu.sobrenome like \'%' + termo + '%\' or usu.email like \'%' + termo + '%\') ')
				}
			})

			qb.andWhere('(' + buscaWhere.join(' AND ') + ')')

		}

		// if (filters.busca) {
		// 	qb.andWhere(' (concat(usu.nome, " ", usu.sobrenome) like :busca)',
		// 		{
		// 			busca: filters.busca.toLowerCase() + '%',

		// 		})
		// }

		if (filters.perfilTipo) qb.andWhere('usu.tipo = :tipo', { tipo: filters.perfilTipo })

		if (typeof filters.ativo === 'boolean') {
			qb.andWhere('usu.ativo = :ativo', { ativo: filters.ativo })
		}

	}

}

