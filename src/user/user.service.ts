import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRegisterDTO } from './dto/user-register.dto';
import phoneNumberFormatter from '../utils/phoneNumberFormatter';
import * as bcrypt from 'bcrypt';
import { codeConfig, Region, regions } from '../config/smsCode.config';
import { errorsConfig } from '../config/errors.config';
import { generateRandomNumberWithNDigits } from '../utils/generateRandomNumberWithNDigits';
import { JwtService } from '@nestjs/jwt';
import { VerifyInputDTO } from './dto/verify-input.dto';
import { AuthService } from '../auth/auth.service';
import { CheckPhoneDTO } from './dto/check-phoneNum.dto';
import { CheckEmailDTO } from './dto/check-email.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private jwtService: JwtService,
		private authService: AuthService,
	) {}
	async updateById(id: number, data: any): Promise<any> {
		await this.userRepository.update(id, data);
	}

	async findById(id: number): Promise<User | undefined> {
		return this.userRepository.findOne({ where: { id: id } });
	}
	async findUserByEmail(email: string): Promise<User> {
		const existingUser = await this.userRepository.findOne({
			where: { email: email },
		});
		if (!existingUser) {
			throw new ConflictException(errorsConfig.emailNotFound);
		}

		return existingUser;
	}

	async findUserByPhoneNumber(
		phoneNumber: string,
		region: Region,
	): Promise<User> {
		const formattedNumber = phoneNumberFormatter(phoneNumber, region);
		const existingUser = this.userRepository.findOne({
			where: { phoneNumber: formattedNumber },
		});

		if (!existingUser) {
			throw new ConflictException(errorsConfig.emailNotFound);
		}

		return existingUser;
	}

	async getAll() {
		return this.userRepository.find();
	}

	async generateVerificationCode(userData: UserRegisterDTO): Promise<string> {
		const { region, email, password, phoneNumber } = userData;
		const formattedNumber = phoneNumberFormatter(phoneNumber, region);

		const userByEmail = await this.userRepository.findOne({
			where: { email },
		});
		const userByPhone = await this.userRepository.findOne({
			where: { phoneNumber: formattedNumber },
		});

		const existingUser = userByPhone || userByEmail;
		if (existingUser && existingUser.verified) {
			throw new ConflictException(errorsConfig.isNotUniqueEmailOrPhone);
		}

		// Генерация и сохранение кода подтверждения
		const verificationCode = generateRandomNumberWithNDigits(
			codeConfig.codeLength,
		).toString();

		if (
			userByPhone &&
			new Date().getTime() -
				userByPhone?.verificationCodeTimestamp?.getTime() >
				codeConfig.timeout * 60000 + userByPhone.extraTimeout
		) {
			await this.userRepository.update(
				{ phoneNumber: formattedNumber },
				{
					email,
					phoneNumber: formattedNumber,
					password: await bcrypt.hash(password, 10),
					verificationCode,
					verificationCodeTimestamp: new Date(),
					verificationCodeAttempts: 0, // Сброс количества попыток
				},
			);
		} else if (
			userByPhone &&
			new Date().getTime() -
				userByPhone?.verificationCodeTimestamp?.getTime() <=
				codeConfig.timeout * 60000 + userByPhone.extraTimeout
		) {
			throw new ConflictException(errorsConfig.tooFastForNewCode);
		}

		if (!userByPhone && !userByEmail) {
			const newUser = this.userRepository.create({
				email,
				verified: false,
				verificationCode,
				verificationCodeTimestamp: new Date(),
				verificationCodeAttempts: 0,
				password: await bcrypt.hash(userData.password, 10),
				phoneNumber: formattedNumber,
				extraTimeout: 0,
			});

			await this.userRepository.save(newUser);
		} else if (userByEmail) {
			await this.userRepository.update(
				{ email },
				{
					phoneNumber: formattedNumber,
					password: await bcrypt.hash(password, 10),
					verificationCode,
					verificationCodeTimestamp: new Date(),
					verificationCodeAttempts: 0, // Сброс количества попыток
				},
			);
		}

		//TODO Реализовать смс-сервис
		return verificationCode; // Возврат кода пользователю (в реальности через СМС)
	}

	async verifyPhoneNumber(verifyInput: VerifyInputDTO): Promise<{
		access_token: string;
		refresh_token: string;
	}> {
		const { region, phoneNumber, code } = verifyInput;
		// Проверка данных пользователя и кода подтверждения
		const IsRegion = regions.includes(region);
		if (!IsRegion) {
			throw new ConflictException(errorsConfig.invalidRegion);
		}
		const formattedNumber = phoneNumberFormatter(phoneNumber, region);
		const existingUser = await this.userRepository.findOne({
			where: { phoneNumber: formattedNumber },
		});

		if (existingUser && existingUser.verified) {
			throw new ConflictException(errorsConfig.phoneIsInUse);
		}

		const user = await this.userRepository.findOne({
			where: { phoneNumber: formattedNumber },
		});

		if (!user) {
			throw new ConflictException(errorsConfig.userNotFound);
		}

		// Проверка времени жизни кода
		if (
			new Date().getTime() - user.verificationCodeTimestamp.getTime() >
			codeConfig.timeout * 60000 + user.extraTimeout
		) {
			throw new ConflictException(errorsConfig.expiredCode);
		}

		// Проверка количества попыток
		if (user.verificationCodeAttempts >= 4) {
			await this.userRepository.update(
				{ phoneNumber: formattedNumber },
				{
					verificationCodeAttempts: 0,
					extraTimeout:
						codeConfig.extraTimeout * 60000 + user.extraTimeout,
				},
			);

			throw new ConflictException(errorsConfig.tooManyCodeAttempts);
		}

		// Проверка кода
		if (code !== user.verificationCode) {
			await this.userRepository.update(
				{ phoneNumber: formattedNumber },
				{
					verificationCodeAttempts: user.verificationCodeAttempts + 1,
				},
			);
			throw new ConflictException(errorsConfig.wrongCode);
		}

		const newData = {
			verified: true,
			verificationCode: null, // Удаление кода
			verificationCodeTimestamp: null, // Сброс времени
			verificationCodeAttempts: 0, // Сброс попыток
			extraTimeout: 0,
		};

		// Код подтверждён, обновляем данные пользователя
		await this.userRepository.update(
			{ phoneNumber: formattedNumber },
			newData,
		);
		const userResponse = await this.userRepository.findOne({
			where: { phoneNumber: formattedNumber },
		});

		const verifyRequest = await this.authService.login(user);
		return {
			access_token: verifyRequest.access_token,
			refresh_token: verifyRequest.refresh_token,
		};
	}

	//проверка емейла на уникальность
	async checkEmailUniqueness(checkEmailDTO: CheckEmailDTO) {
		const { email } = checkEmailDTO;
		const userWithEmail = await this.userRepository.findOne({
			where: { email, verified: true },
		});

		return { unique: !userWithEmail, field: email };
	}

	//проверка номера на уникальность
	async checkPhoneNumberUniqueness(checkPhoneDTO: CheckPhoneDTO) {
		const { phoneNumber, region } = checkPhoneDTO;
		const formattedNumber = phoneNumberFormatter(phoneNumber, region);
		const userWithPhoneNumber = await this.userRepository.findOne({
			where: { phoneNumber: formattedNumber, verified: true },
		});

		return { unique: !userWithPhoneNumber, field: formattedNumber };
	}
}
