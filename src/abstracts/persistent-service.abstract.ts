import { PagerDTO } from 'src/dto/pager.dto';
import { QSListDTO } from 'src/dto/qs-list.dto';
import {
    DataSource,
    DeleteResult,
    EntityManager,
    EntitySchema,
    ObjectType,
    Repository,
    SelectQueryBuilder,
    UpdateResult,
} from 'typeorm';

import { BaseEntity } from './base-entity.abstract';

export abstract class PersistentService {

	constructor(protected dataSource: DataSource) {

	}


	abstract getOne<T>(id: number, dataType: string): Promise<BaseEntity<T>>

	abstract getMany<T>(filters: QSListDTO): Promise<BaseEntity<T>[]>

	abstract getTotal(filters: QSListDTO): Promise<{ [property: string]: any }>

	abstract save<T>(entityManager: EntityManager, entity: BaseEntity<T>): Promise<BaseEntity<T>>

	abstract delete(entityManager: EntityManager, ids: number[]): Promise<UpdateResult | DeleteResult>

	abstract qbFilters(qb: SelectQueryBuilder<BaseEntity<any>>, filters: QSListDTO): void


	fetchWithChunk<T>(queryBuilder: SelectQueryBuilder<T>, pager?: PagerDTO): SelectQueryBuilder<T> {

		if (pager?.take) {

			if (pager.skip) {
				queryBuilder.skip(pager.skip)
			}

			queryBuilder.take(pager.take)
		}

		if (pager?.offset) {
			queryBuilder.offset(pager.offset)
		}
		if (pager?.limit) {
			queryBuilder.limit(pager.limit)
		}

		return queryBuilder

	}

	protected getRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string, entityManager?: EntityManager): Repository<Entity> {

		// 1. isola a transaction de fato, mas precisa passar parâmetro [CORRETO]
		// 2. cada quero acaba recebendo um novo EM e neste caso, não gera mesma transaction entre elas
		return (entityManager || this.dataSource.createEntityManager()).getRepository(target)

	}



}