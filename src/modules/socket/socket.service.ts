import { Injectable } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ISocketInterface } from "./socket.interface";
import { Subject } from 'rxjs'
import { MessageService } from "src/providers/message.service";
import { JwtService } from "@nestjs/jwt";
import { PerfilService } from "../perfil/perfil.service";
import { Perfil } from "../perfil/perfil.entity";
import { AppLoggerService } from "src/providers/app-logger.service";
import { Server, Socket } from "socket.io";

export enum IdDataSocket {
	INIT = 'INIT',
	INFO = 'INFO',
	BANNER_ENCERRADO = 'BANNER_ENCERRADO',
	CERIMONICIA_ENCERRADA = 'CERIMONICIA_ENCERRADA',
	CERIMONIA_CADASTRADA = 'CERIMONIA_CADASTRADA',
	BANNER_CADASTRADO = 'BANNER_CADASTRADA'
}

@Injectable()
@WebSocketGateway({ cors: true })
export class SocketService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server

	private logger: AppLoggerService = new AppLoggerService('AppSocket')
	private subjects: { [ID: string]: Subject<any> } = {}
	private conexoes: ISocketInterface[] = []

	constructor(private messageService: MessageService, private readonly jwtService: JwtService,
		private readonly perfilService: PerfilService) { }

	afterInit() {

		this.logger.log('Socket: Init')

	}

	handleConnection(client: Socket) {

		const conexao: ISocketInterface = new ISocketInterface

		this.logger.log('Socket Connected: ' + client.id + ' (Total: ' + (this.conexoes.length + 1) + ')')

		conexao.socketId = client.id
		conexao.socket = client;

		this.addConexao(conexao)

		this.msgClient(client, IdDataSocket.INFO, { id: conexao.socketId })
	}

	handleDisconnect(client: Socket) {

		this.logger.log('Socket Disconnected: ' + client.id + ' (Total: ' + (this.conexoes.length - 1) + ')')
		this.removeConexao(client.id)

	}

	@SubscribeMessage('server.' + IdDataSocket.INFO)
	async serverInfo(client: Socket, msg: string) {

		this.logger.log(`Socket INFO: ${client.id}`)

		const dados = JSON.parse(msg)

		if (dados) {

			const log = await this.setConexao(client.id, dados)

		}

	}

	addConexao(conexao: ISocketInterface) {

		this.conexoes = [...this.conexoes, conexao]
	}

	removeConexao(socketId: string) {

		const perfilPos = this.conexoes.findIndex(conexao => socketId === conexao.socketId)

		if (perfilPos >= 0) {
			this.conexoes.splice(perfilPos, 1)
		}

	}

	async setConexao(socketId: string, dados: any): Promise<ISocketInterface> {

		const perfilFindCon = this.findConexaoBySocketId(socketId)

		if (perfilFindCon) {

			if (dados.uuid) {
				perfilFindCon.uuid = dados.uuid
			}

			// if (dados.perfilId >= 0) {
			// perfilFind.perfilId = (dados.perfilId === 0 ? null : dados.perfilId)
			// }

			let perfilFind: Perfil

			if (dados.access_token) {

				const payload: any = this.jwtService.decode(dados.access_token)

				if (payload?.id) {

					perfilFindCon.perfilId = payload.id

					perfilFind = await this.perfilService.find(payload.id)
					this.logger.log('Socket User Set: [' + perfilFind.id + '] ' + perfilFind.nomeCompleto)

				} else {

					if (perfilFindCon.perfilId) {
						perfilFind = await this.perfilService.find(perfilFindCon.perfilId)
						this.logger.log('Socket User Unset: [' + perfilFind.id + '] ' + perfilFind.nomeCompleto)
					} else {
						this.logger.log('Socket User Set: 0')
					}

					perfilFindCon.perfilId = 0

				}

			} else {

				if (perfilFindCon.perfilId) {
					perfilFind = await this.perfilService.find(perfilFindCon.perfilId)
					this.logger.log('Socket User Unset: [' + perfilFind.id + '] ' + perfilFind.nomeCompleto)
				} else {
					this.logger.log('Socket User Set: 0')
				}

				perfilFindCon.perfilId = 0

			}

		}

		return perfilFindCon

	}

	get(ID: string): Subject<any> {

		if (!this.subjects[ID]) {
			this.subjects[ID] = new Subject()
		}

		return this.subjects[ID]

	}

	getConexoes(): ISocketInterface[] {
		return Object.assign(this.conexoes);
	}

	findConexoesByPerfil(perfilId: number) {
		return this.conexoes.filter(conexao => perfilId === conexao.perfilId)
	}

	findConexaoBySocketId(socketId: string) {
		return this.conexoes.find(conexao => socketId === conexao.socketId)
	}

	findSocketsByPerfil(perfilId: number) {
		return this.conexoes.filter(conexao => perfilId === conexao.perfilId).map(conexao => conexao.socket)
	}

	msgClient(clients: Socket | Socket[], id: IdDataSocket, data: any = {}) {

		if (!clients) {
			return
		}

		if (clients instanceof Array) {
			clients.forEach(client => client.emit('client.' + id, JSON.stringify(data)))
			return
		}

		clients.emit('client.' + id, JSON.stringify(data))

	}

	msgTodos(id: IdDataSocket, data: any = {}) {
		//console.log("TODOS", data)
		this.server.emit('client.' + id, JSON.stringify(data))
	}

}