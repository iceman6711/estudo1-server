import { Injectable, Scope } from '@nestjs/common'
import {Subject} from 'rxjs'
// import {Subject} from 'rxjs'

@Injectable({ scope: Scope.DEFAULT }) // Scope não funciona por conta do método que gera ID automático por requisição, no controle das transactions do banco de dados
export class MessageService {

    private subjects: { [ID: string]: Subject<any> } = {}

    constructor() {

        // console.log('MessageService_____________')

    }

    get(ID: string): Subject<any> {

        if (!this.subjects[ID]) {
            this.subjects[ID] = new Subject()
        }

        return this.subjects[ID]

    }

}

/*

 export class MessageService {
 private subject = new Subject<any>()

 sendMessage(message: string) {
 this.subject.next({ text: message })
 }

 clearMessage() {
 this.subject.next()
 }

 getMessage(): Observable<any> {
 return this.subject.asObservable()
 }
 }

 */
