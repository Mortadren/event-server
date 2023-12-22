import { InputType, Field } from '@nestjs/graphql';
import { Region } from '../../config/smsCode.config';
import { IsPhoneNumberDynamic } from '../../user/dto/is-phone-number-dynamic.decorator';
import { IsNotEmpty } from 'class-validator';
import { IsRegion } from '../../user/dto/is-region.decorator';

@InputType()
export class LoginByPhoneUserInput {
	@Field()
	@IsNotEmpty()
	@IsPhoneNumberDynamic('region')
	phoneNumber: string;

	@Field()
	@IsNotEmpty()
	@IsRegion()
	region: Region;

	@Field()
	@IsNotEmpty()
	password: string;
}
