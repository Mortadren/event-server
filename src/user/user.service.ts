import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRegisterDTO } from './dto/user-register.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>, // Инъекция репозитория
	) {}

	async register(userData: UserRegisterDTO): Promise<User> {
		// Проверяем, существует ли уже пользователь с таким email
		const existingUser = await this.userRepository.findOne({
			where: { email: userData.email },
		});
		if (existingUser) {
			throw new ConflictException('Email already in use');
		}

		const newUser = this.userRepository.create(userData);
		return this.userRepository.save(newUser);
	}

	async getNum() {
		return this.userRepository.count();
	}

	async getAll() {
		return this.userRepository.find();
	}
}
