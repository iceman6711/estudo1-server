
import {Expose} from 'class-transformer'

@Expose()
export class OrderDTO {

	[property: string]: "ASC" | "DESC";

}