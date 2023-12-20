import { IsEmail, IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { IsStrongPassword } from './is-strong-password.decorator';
import { IsPhoneNumberDynamic } from './is-phone-number-dynamic.decorator';
import { Region } from './user.dto.config';
//TODO: написать конфиг файл с дефолтными сообщениями
@InputType()
export class UserRegisterDTO {
	@Field()
	@IsNotEmpty()
	region: Region; // Поле для региона

	@Field()
	@IsNotEmpty()
	@IsPhoneNumberDynamic('region') // Используйте новый декоратор здесь
	phoneNumber: string;

	@Field()
	@IsEmail()
	email: string;

	@Field()
	@IsNotEmpty()
	@IsStrongPassword()
	password: string;
}
