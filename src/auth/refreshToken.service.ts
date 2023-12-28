import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
// TODO: надо добавить обработку ошибок с бд

@Injectable()
export class RefreshTokenService {
	constructor(
		@Inject(forwardRef(() => UserService))
		private userService: UserService) {}

	async saveRefreshToken(
		userId: number,
		refreshToken: string,
	): Promise<void> {
		// Сохранение refresh токена в базе данных для указанного пользователя
		const user = await this.userService.findById(userId);
		if (user) {
			await this.userService.updateById(userId, {
				refreshToken: refreshToken,
			});
		} else {
			// Если пользователь не найден, можно создать новую запись или бросить исключение
			throw new NotFoundException('User not found');
		}
	}

	async validateRefreshToken(
		userId: number,
		refreshToken: string,
	): Promise<boolean> {
		// Проверка валидности refresh токена для указанного пользователя
		const user = await this.userService.findById(userId);

		return user && user.refreshToken === refreshToken;


	}
}
