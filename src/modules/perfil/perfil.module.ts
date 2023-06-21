import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SharedModule } from 'src/shared.module'
import { Perfil } from './perfil.entity'
import { PerfilController } from './perfil.controller'
import { PerfilService } from './perfil.service'

@Module({
	imports: [
		SharedModule,
		TypeOrmModule.forFeature([Perfil]),
	],
	controllers: [PerfilController],
	providers: [PerfilService],
	exports: [PerfilService],
})
export class PerfilModule { }
