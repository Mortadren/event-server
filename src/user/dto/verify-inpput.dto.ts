import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { IsPhoneNumberDynamic } from './is-phone-number-dynamic.decorator';
import { IsRegion } from './is-region.decorator';
import { Region } from '../../config/smsCode.config';

@InputType()
export class VerifyInputDTO {
	@Field()
	@IsNotEmpty()
	@IsRegion()
	region: Region;

	@Field()
	@IsNotEmpty()
	@IsPhoneNumberDynamic('region')
	phoneNumber: string;

	@Field()
	@IsNotEmpty()
	code: string;
}
