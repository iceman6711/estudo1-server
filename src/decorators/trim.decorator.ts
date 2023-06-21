import { Transform, TransformFnParams } from 'class-transformer';

export function Trim(value?: any) {

	return Transform(({ value }: TransformFnParams) => value?.trim())

}