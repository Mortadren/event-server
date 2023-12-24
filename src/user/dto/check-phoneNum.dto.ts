import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsRegion } from './is-region.decorator';
import { Region } from '../../config/smsCode.config';
import { IsNotEmpty } from 'class-validator';
import { IsPhoneNumberDynamic } from './is-phone-number-dynamic.decorator';

@InputType()
export class CheckPhoneDTO {
	@Field(() => String)
	@IsPhoneNumberDynamic('region')
	phoneNumber: string;

	@Field()
	@IsNotEmpty()
	@IsRegion()
	region: Region;
}

@ObjectType()
export class CheckedPhoneDTO {
	@Field(() => Boolean)
	unique: boolean;

	@Field(() => String)
	field: string;
}
