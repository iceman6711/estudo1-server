import { AppSession } from 'src/interfaces/app-session.interface';

import { QSListDTO } from '../dto/qs-list.dto';

export abstract class BaseController {

	abstract getOne(filters: QSListDTO, session: AppSession): Promise<{ [property: string]: any }>

	abstract getMany(filters: QSListDTO, session: AppSession): Promise<{ [property: string]: any }>

	abstract create(body: { [property: string]: any }, session: AppSession): Promise<{ [property: string]: any }>

	abstract update(body: { [property: string]: any }, id: number, session: AppSession): Promise<{ [property: string]: any }>

	abstract delete(ids: string, session: AppSession): Promise<{ [property: string]: any }>

}