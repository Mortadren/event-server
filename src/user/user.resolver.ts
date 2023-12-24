import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserRegisterDTO } from './dto/user-register.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoginResponse } from 'src/auth/dto/login-response';
import { VerifyInputDTO } from './dto/verify-input.dto';
import { CheckEmailDTO, CheckedEmailDTO } from './dto/check-email.dto';
import { Region } from 'src/config/smsCode.config';
import { CheckPhoneDTO, CheckedPhoneDTO } from './dto/check-phoneNum.dto';

@Resolver(() => User)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	// Доступ реализован только при наличии JWT токена в запросе из-за @UseGuards(JwtAuthGuard)
	@Query(() => [User])
	@UseGuards(JwtAuthGuard)
	async getUsers(@Context() context) {
		// Можно получить доступ к данным по авторизованному юзеру через context.req.user. Этот параметр конфигурируется в jwt.strategy.ts через return
		return this.userService.getAll();
	}

	@Mutation(() => String)
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async requestVerificationCode(
		@Args('registerInput', { type: () => UserRegisterDTO })
		registerInput: UserRegisterDTO,
	): Promise<string> {
		return this.userService.generateVerificationCode(registerInput);
	}

	@Mutation(() => LoginResponse, { nullable: true })
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async verifyPhoneNumber(
		@Args('verifyInput', { type: () => VerifyInputDTO })
		verifyInput: VerifyInputDTO,
	): Promise<{
		access_token: string;
		user: User;
	}> {
		return this.userService.verifyPhoneNumber(verifyInput);
	}
	@Mutation(() => CheckedEmailDTO)
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async checkUniqueEmail(
		@Args('checkEmailDTO', { type: () => CheckEmailDTO })
		checkEmailDTO: CheckEmailDTO,
	): Promise<CheckedEmailDTO> {
		return this.userService.checkEmailUniqueness(checkEmailDTO);
	}

	@Mutation(() => CheckedPhoneDTO)
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async checkUniquePhoneNumber(
		@Args('checkPhoneDTO', { type: () => CheckPhoneDTO })
		checkPhoneDTO: CheckPhoneDTO,
	): Promise<CheckedPhoneDTO> {
		return this.userService.checkPhoneNumberUniqueness(checkPhoneDTO);
	}
}
