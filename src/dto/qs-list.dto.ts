import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { OrderDTO } from 'src/dto/order.dto';
import { PagerDTO } from 'src/dto/pager.dto';

export class QSListDTO {

	@Expose()
	@ValidateNested()
	@Type(() => PagerDTO)
	pager: PagerDTO

	@Expose()
	@IsOptional()
	@ValidateNested()
	@Type(() => OrderDTO)
	order?: OrderDTO

	@Expose()
	@IsOptional()
	@IsNumber()
	id?: number

	@Expose()
	@IsOptional()
	@IsString()
	@Length(0, 100)
	busca?: string

}