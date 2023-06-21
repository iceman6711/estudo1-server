import {IsNumber, IsOptional, Max, Min} from 'class-validator'
import {Expose} from 'class-transformer'

export class PagerDTO {

    @Expose()
    @Min(0)
	@IsNumber()
    @IsOptional()
    skip?: number

    @Expose()
    @Min(0)
    @Max(100)
	@IsNumber()
    @IsOptional()
    take?: number

    @Expose()
    @Min(0)
	@IsNumber()
    offset: number

    @Expose()
    @Min(0)
    @Max(100)
	@IsNumber()
    limit: number

}
