import { Expose } from 'class-transformer';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity<T> {

	constructor(data?: Partial<T>) {

		if (!data) {
			return
		}
		Object.assign(this, data)

	}

	@PrimaryGeneratedColumn()
	@Expose()
	id: number

	@UpdateDateColumn({ select: false })
	dataAlteracao?: Date

	@CreateDateColumn({ select: true })
	dataCadastro?: Date

}