import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsOptional, Length } from 'class-validator';
import { Column, DeleteDateColumn, Entity, OneToMany, Unique } from 'typeorm';

import { BaseEntity } from '../../abstracts/base-entity.abstract';
import { ValidaCPFCNPJ } from '../../decorators/cpfcnpj.decorator';
import { NullIfEmpty } from '../../decorators/null-if-empty.decorator';
import { Trim } from '../../decorators/trim.decorator';

export const MASTER_ADMIN = 'master-admin'

// Em caso de alteração, corrigir os DTO de UPDATE e CREATE
export enum PerfilTipo {
	USUARIO = 'USUARIO',
	EMPRESA = 'EMPRESA',
}

export enum PerfilTipoStr {
	USUARIO = 'Usuário',
	EMPRESA = 'Empresa',
}

@Entity()
@Unique('documento', ['documento'])
export class Perfil extends BaseEntity<Perfil> {

	@Column({ type: 'boolean', default: false })
	@Expose()
	@IsOptional()
	@IsBoolean()
	isMasterAdmin?: boolean

	@Column({ type: 'boolean', default: true })
	@Expose()
	@IsOptional()
	@IsBoolean()
	ativo?: boolean

	@Column({ type: 'enum', enum: PerfilTipo, default: PerfilTipo.USUARIO })
	@Expose()
	@IsEnum(PerfilTipo)
	tipo: PerfilTipo

	@Column({ length: 100, select: false, nullable: true })
	@Length(6, 20)
	// @TesteRepetirSenha() // se tentar validar no OUT, o campo repetirSenha não existe e vai dar erro
	senha: string

	@Column({ length: 50, unique: true, nullable: true })
	@Expose()
	@IsEmail()
	@IsOptional()
	@Trim()
	email?: string

	@Column({ length: 30 })
	@Expose()
	@Length(3, 30)
	@Trim()
	nome: string

	@Column({ length: 30 })
	@Expose()
	@Length(3, 30)
	@Trim()
	sobrenome: string

	@Column({ length: 18, nullable: false, unique: false })
	@Expose()
	@ValidaCPFCNPJ({ rule: 'test' })
	@Length(14, 18)
	documento: string

	@Column({ length: 36, unique: true, nullable: true })
	@Expose()
	@IsOptional()
	@Length(3, 36)
	fotoPerfil: string // md5.jpg -> 36 caracteres

	@Column({ type: 'datetime', nullable: true })
	@Expose()
	@IsOptional()
	dataNascimento?: Date

	// Endereço
	@Column({ length: 9, nullable: true })
	@Expose()
	@IsOptional()
	@NullIfEmpty()
	@Length(0, 9)
	@Trim()
	enderecoCEP?: string

	@Column({ length: 60, nullable: true })
	@Expose()
	@IsOptional()
	@NullIfEmpty()
	@Length(0, 60)
	@Trim()
	enderecoLogradouro?: string

	@Column({ length: 10, nullable: true })
	@Expose()
	@IsOptional()
	@NullIfEmpty()
	@Length(0, 10)
	@Trim()
	enderecoNumero?: string

	@Column({ length: 30, nullable: true })
	@Expose()
	@IsOptional()
	@NullIfEmpty()
	@Length(0, 30)
	@Trim()
	enderecoComplemento?: string

	@Column({ length: 40, nullable: true })
	@Expose()
	@IsOptional()
	@NullIfEmpty()
	@Length(0, 40)
	@Trim()
	enderecoBairro?: string

	@Column({ length: 40, nullable: true })
	@Expose()
	@IsOptional()
	@NullIfEmpty()
	@Length(0, 40)
	@Trim()
	enderecoCidade?: string

	@Column({ length: 2, nullable: true })
	@Expose()
	@IsOptional()
	@NullIfEmpty()
	@Length(0, 2)
	@Trim()
	enderecoEstado?: string

	@Column({ length: 40, nullable: true })
	@Expose()
	@IsOptional()
	@NullIfEmpty()
	@Length(0, 40)
	@Trim()
	enderecoReferencia?: string

	@Column({ length: 15, nullable: true })
	@NullIfEmpty()
	@Length(0, 15)
	@Expose()
	@IsOptional()
	@Trim()
	telefone?: string

	@Column({ length: 15, nullable: true })
	@NullIfEmpty()
	@Length(0, 15)
	@Expose()
	@IsOptional()
	@Trim()
	celular?: string

	@Column({ type: 'datetime', nullable: true })
	@Expose()
	ultimoLogin?: Date

	@DeleteDateColumn()
	dataExclusao?: Date

	///////// LIGAÇÕES //////////

	///////// NÃO É DATABASE /////////

	@Expose()
	nomeCompleto?: string

	@Expose()
	fotoPerfilUrl?: string

	fotoPerfilUpload?: string

}