import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRegisterDTO } from './dto/user-register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>, // Инъекция репозитория
	) {}

	async findUserByEmail(email: string): Promise<User> {
		const existingUser = await this.userRepository.findOne({
			where: { email: email },
		});
		if (!existingUser) {
			throw new ConflictException(`No user with email ${email}.`);
		}

		return existingUser;
	}
	async findUserByPhone(phoneNumber: string): Promise<User> {
		const existingUser = await this.userRepository.findOne({
			where: { phoneNumber: phoneNumber },
		});

		return existingUser || undefined;
	}

	async register(userData: UserRegisterDTO): Promise<User> {
		// Проверяем, существует ли уже пользователь с таким email
		const existingUser = await this.userRepository.findOne({
			where: { email: userData.email },
		});
		if (existingUser) {
			throw new ConflictException('Email already in use');
		}
		const hashedPassword = await bcrypt.hash(userData.password, 10);
		// При авторизации проверка совпадения паролей через bcrypt.compare(pass1, pass2)

		const newUser = this.userRepository.create({
			...userData,
			password: hashedPassword,
		});

		return this.userRepository.save(newUser);
	}

	async getNum() {
		return this.userRepository.count();
	}

	async getAll() {
		return this.userRepository.find();
	}
}
