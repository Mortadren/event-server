import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRegisterDTO } from './dto/user-register.dto';
import phoneNumberFormatter from '../utils/phoneNumberFormater';
import * as bcrypt from 'bcrypt';
import { codeConfig, Region } from './dto/phone.config';
import { errors } from '../config/errors';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async findUserByEmail(email: string): Promise<User> {
		const existingUser = await this.userRepository.findOne({
			where: { email: email },
		});
		if (!existingUser) {
			throw new ConflictException(errors.emailNotFound(email));
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
			throw new ConflictException(errors.isNotUniqueEmailOrPhone);
		}

		// Генерация и сохранение кода подтверждения
		const verificationCode = Math.floor(
			1000 + Math.random() * 9000,
		).toString(); // Простой 4-значный код

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
			throw new ConflictException(errors.tooFastForNewCode);
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

		return verificationCode; // Возврат кода пользователю (в реальности через СМС)
	}

	async verifyPhoneNumber(
		phoneNumber: string,
		region: Region,
		verificationCode: string,
	): Promise<User> {
		// Проверка данных пользователя и кода подтверждения
		const formattedNumber = phoneNumberFormatter(phoneNumber, region);
		const existingUser = await this.userRepository.findOne({
			where: { phoneNumber: formattedNumber },
		});

		if (existingUser && existingUser.verified) {
			throw new ConflictException(errors.phoneIsInUse);
		}

		const user = await this.userRepository.findOne({
			where: { phoneNumber: formattedNumber },
		});

		if (!user) {
			throw new ConflictException(errors.userNotFound);
		}

		// Проверка времени жизни кода
		if (
			new Date().getTime() - user.verificationCodeTimestamp.getTime() >
			codeConfig.timeout * 60000 + user.extraTimeout
		) {
			throw new ConflictException(errors.expiredCode);
		}

		// Проверка количества попыток
		if (user.verificationCodeAttempts >= 4) {
			await this.userRepository.update(
				{ phoneNumber: formattedNumber },
				{
					verificationCodeAttempts: 0,
					extraTimeout: codeConfig.extraTimeout * 60000,
				},
			);

			throw new ConflictException(errors.tooManyCodeAttempts);
		}

		// Проверка кода
		if (verificationCode !== user.verificationCode) {
			await this.userRepository.update(
				{ phoneNumber: formattedNumber },
				{
					verificationCodeAttempts: user.verificationCodeAttempts + 1,
				},
			);
			throw new ConflictException(errors.wrongCode);
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

		return user;
	}
}
